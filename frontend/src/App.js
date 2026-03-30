import { useState, useRef, useEffect, useCallback } from 'react';
import '@/App.css';
import Sidebar from '@/components/Sidebar';
import ChatMessage from '@/components/ChatMessage';
import InputBar from '@/components/InputBar';
import { Toaster, toast } from 'sonner';
import { tools, conversations, defaultHistory, keywordMap, genericResponses } from '@/data/mockData';
import { Menu } from 'lucide-react';

function App() {
  const [activeConvId, setActiveConvId] = useState('morning_briefing');
  const [allConvs, setAllConvs] = useState(conversations);
  const [history, setHistory] = useState(defaultHistory);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const chatRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    if (chatRef.current) {
      setTimeout(() => {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }, 50);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [activeConvId, allConvs, scrollToBottom]);

  const activeMessages = allConvs[activeConvId]?.messages || [];

  const addToHistory = (id, title) => {
    setHistory((prev) => {
      if (prev.some((h) => h.id === id)) return prev;
      return [{ id, title, time: 'Just now' }, ...prev];
    });
  };

  const handleToolClick = (toolId) => {
    setActiveConvId(toolId);
    const conv = conversations[toolId];
    if (conv) {
      addToHistory(toolId, conv.title);
      if (!allConvs[toolId]) {
        setAllConvs((prev) => ({ ...prev, [toolId]: conv }));
      }
    }
    setSidebarOpen(false);
  };

  const handleConvClick = (convId) => {
    setActiveConvId(convId);
    setSidebarOpen(false);
  };

  const handleNewChat = () => {
    const id = `chat_${Date.now()}`;
    const newConv = {
      id,
      title: 'New conversation',
      time: 'Just now',
      messages: [
        {
          role: 'ai',
          text: "Good morning, Akshat! How can I help you today? You can ask about school pulse, fees, staff attendance, analytics, or any other module. Use the tools panel on the left for quick access.",
        },
      ],
    };
    setAllConvs((prev) => ({ ...prev, [id]: newConv }));
    setActiveConvId(id);
    addToHistory(id, 'New conversation');
    setSidebarOpen(false);
  };

  const detectModule = (text) => {
    const lower = text.toLowerCase();
    for (const [keyword, moduleId] of Object.entries(keywordMap)) {
      if (lower.includes(keyword)) return moduleId;
    }
    return null;
  };

  const handleSend = (text) => {
    const userMsg = { role: 'user', text };

    setAllConvs((prev) => ({
      ...prev,
      [activeConvId]: {
        ...prev[activeConvId],
        messages: [...(prev[activeConvId]?.messages || []), userMsg],
      },
    }));

    // Update history title if it's a new chat
    setHistory((prev) =>
      prev.map((h) =>
        h.id === activeConvId && h.title === 'New conversation'
          ? { ...h, title: text.slice(0, 40) + (text.length > 40 ? '...' : '') }
          : h
      )
    );

    setTyping(true);
    scrollToBottom();

    setTimeout(() => {
      const moduleId = detectModule(text);
      let aiResponse;

      if (moduleId && conversations[moduleId]) {
        const moduleConv = conversations[moduleId];
        const aiMsg = moduleConv.messages.find((m) => m.role === 'ai');
        aiResponse = aiMsg ? { ...aiMsg } : {
          role: 'ai',
          text: genericResponses[Math.floor(Math.random() * genericResponses.length)],
        };
      } else {
        aiResponse = {
          role: 'ai',
          text: genericResponses[Math.floor(Math.random() * genericResponses.length)],
        };
      }

      setAllConvs((prev) => ({
        ...prev,
        [activeConvId]: {
          ...prev[activeConvId],
          messages: [...(prev[activeConvId]?.messages || []), aiResponse],
        },
      }));
      setTyping(false);
      scrollToBottom();
    }, 1200);
  };

  const handleAction = (action) => {
    toast.success(`${action}`, {
      description: 'Action completed successfully.',
      duration: 3000,
    });
  };

  return (
    <div className="ef-app" data-testid="eduflow-app">
      <Sidebar
        tools={tools}
        history={history}
        activeConvId={activeConvId}
        onToolClick={handleToolClick}
        onConvClick={handleConvClick}
        onNewChat={handleNewChat}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="ef-main" data-testid="main-area">
        {/* Top Bar */}
        <div className="ef-top-bar" data-testid="top-bar">
          <button
            className="ef-hamburger"
            onClick={() => setSidebarOpen(true)}
            data-testid="hamburger-btn"
          >
            <Menu size={18} />
          </button>
          <div className="ef-top-title">EduFlow AI</div>
          <div className="ef-role-pill" data-testid="role-pill">
            <span className="ef-role-dot" />
            Owner &mdash; Aman
          </div>
        </div>

        {/* Chat Area */}
        <div className="ef-chat" ref={chatRef} data-testid="chat-area">
          {activeMessages.map((msg, i) => (
            <ChatMessage
              key={`${activeConvId}-${i}`}
              message={msg}
              onAction={handleAction}
              index={i}
            />
          ))}
          {typing && (
            <div className="ef-msg ai" data-testid="typing-indicator">
              <div className="ef-avatar ai-av">E</div>
              <div className="ef-bubble">
                <div className="ef-typing">
                  <div className="ef-typing-dot" />
                  <div className="ef-typing-dot" />
                  <div className="ef-typing-dot" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <InputBar onSend={handleSend} />
      </div>

      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#15151f',
            border: '1px solid rgba(255,255,255,0.09)',
            color: '#ededeb',
          },
        }}
      />
    </div>
  );
}

export default App;
