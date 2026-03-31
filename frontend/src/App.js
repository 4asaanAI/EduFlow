import { useState, useRef, useEffect, useCallback } from 'react';
import '@/App.css';
import Sidebar from '@/components/Sidebar';
import ChatMessage from '@/components/ChatMessage';
import InputBar from '@/components/InputBar';
import ToolView from '@/components/ToolView';
import { Toaster, toast } from 'sonner';
import { tools, conversations, defaultHistory, keywordMap, genericResponses } from '@/data/mockData';
import { Menu, Sun, Moon, ArrowLeft } from 'lucide-react';

function App() {
  const [activeConvId, setActiveConvId] = useState('morning_briefing');
  const [activeToolId, setActiveToolId] = useState(null);
  const [viewMode, setViewMode] = useState('chat'); // 'chat' | 'tool'
  const [allConvs, setAllConvs] = useState(conversations);
  const [history, setHistory] = useState(defaultHistory.map(h => ({ ...h, starred: false, pinned: false })));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const [theme, setTheme] = useState('dark');
  const chatRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    if (chatRef.current) {
      setTimeout(() => { chatRef.current.scrollTop = chatRef.current.scrollHeight; }, 50);
    }
  }, []);

  useEffect(() => { scrollToBottom(); }, [activeConvId, allConvs, scrollToBottom]);

  const activeMessages = allConvs[activeConvId]?.messages || [];

  const addToHistory = (id, title) => {
    setHistory((prev) => {
      if (prev.some((h) => h.id === id)) return prev;
      return [{ id, title, time: 'Just now', starred: false, pinned: false }, ...prev];
    });
  };

  const handleToolClick = (toolId) => {
    setActiveToolId(toolId);
    setViewMode('tool');
    setSidebarOpen(false);
  };

  const handleConvClick = (convId) => {
    setActiveConvId(convId);
    setViewMode('chat');
    setSidebarOpen(false);
  };

  const handleNewChat = () => {
    const id = `chat_${Date.now()}`;
    const newConv = {
      id, title: 'New conversation', time: 'Just now',
      messages: [{ role: 'ai', text: "Good morning, Aman! How can I help you today? You can ask about school pulse, fees, staff attendance, analytics, or any other module. Use the tools panel on the left for quick access." }],
    };
    setAllConvs((prev) => ({ ...prev, [id]: newConv }));
    setActiveConvId(id);
    setViewMode('chat');
    addToHistory(id, 'New conversation');
    setSidebarOpen(false);
  };

  const handleRenameChat = (id, newTitle) => {
    setHistory((prev) => prev.map(h => h.id === id ? { ...h, title: newTitle } : h));
  };

  const handleToggleStar = (id) => {
    setHistory((prev) => prev.map(h => h.id === id ? { ...h, starred: !h.starred } : h));
  };

  const handleTogglePin = (id) => {
    setHistory((prev) => prev.map(h => h.id === id ? { ...h, pinned: !h.pinned } : h));
  };

  const handleDeleteChat = (id) => {
    setHistory((prev) => prev.filter(h => h.id !== id));
    setAllConvs((prev) => { const next = { ...prev }; delete next[id]; return next; });
    if (activeConvId === id) {
      setViewMode('tool');
      setActiveToolId('school_pulse');
    }
    toast.success('Chat deleted');
  };

  const detectModule = (text) => {
    const lower = text.toLowerCase();
    for (const [keyword, moduleId] of Object.entries(keywordMap)) {
      if (lower.includes(keyword)) return moduleId;
    }
    return null;
  };

  const handleSend = (text) => {
    // If we're in tool view, switch to chat view first
    if (viewMode === 'tool') {
      handleNewChat();
      // We need to add the message to the newly created chat
      setTimeout(() => {
        const userMsg = { role: 'user', text };
        setAllConvs((prev) => {
          const keys = Object.keys(prev);
          const lastKey = keys[keys.length - 1];
          return { ...prev, [lastKey]: { ...prev[lastKey], messages: [...prev[lastKey].messages, userMsg] } };
        });
      }, 100);
      return;
    }

    const userMsg = { role: 'user', text };
    setAllConvs((prev) => ({
      ...prev, [activeConvId]: { ...prev[activeConvId], messages: [...(prev[activeConvId]?.messages || []), userMsg] },
    }));
    setHistory((prev) => prev.map((h) =>
      h.id === activeConvId && h.title === 'New conversation'
        ? { ...h, title: text.slice(0, 40) + (text.length > 40 ? '...' : '') } : h
    ));
    setTyping(true);
    scrollToBottom();

    setTimeout(() => {
      const moduleId = detectModule(text);
      let aiResponse;
      if (moduleId && conversations[moduleId]) {
        const aiMsg = conversations[moduleId].messages.find((m) => m.role === 'ai');
        aiResponse = aiMsg ? { ...aiMsg } : { role: 'ai', text: genericResponses[Math.floor(Math.random() * genericResponses.length)] };
      } else {
        aiResponse = { role: 'ai', text: genericResponses[Math.floor(Math.random() * genericResponses.length)] };
      }
      setAllConvs((prev) => ({
        ...prev, [activeConvId]: { ...prev[activeConvId], messages: [...(prev[activeConvId]?.messages || []), aiResponse] },
      }));
      setTyping(false);
      scrollToBottom();
    }, 1200);
  };

  const handleAction = (action) => {
    toast.success(`${action}`, { description: 'Action completed successfully.', duration: 3000 });
  };

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  const activeToolName = tools.find(t => t.id === activeToolId)?.name || '';

  return (
    <div className="ef-app" data-testid="eduflow-app" data-theme={theme}>
      <Sidebar tools={tools} history={history} activeConvId={activeConvId} activeToolId={activeToolId} viewMode={viewMode}
        onToolClick={handleToolClick} onConvClick={handleConvClick} onNewChat={handleNewChat}
        onRenameChat={handleRenameChat} onToggleStar={handleToggleStar} onTogglePin={handleTogglePin} onDeleteChat={handleDeleteChat}
        isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="ef-main" data-testid="main-area">
        <div className="ef-top-bar" data-testid="top-bar">
          <button className="ef-hamburger" onClick={() => setSidebarOpen(true)} data-testid="hamburger-btn"><Menu size={18} /></button>
          {viewMode === 'tool' && (
            <button className="ef-back-btn" onClick={() => { setViewMode('chat'); setActiveConvId(history[0]?.id || 'morning_briefing'); }} data-testid="back-to-chat-btn">
              <ArrowLeft size={16} /> Chat
            </button>
          )}
          <div className="ef-top-title">EduFlow AI</div>
          <div className="ef-role-pill" data-testid="role-pill"><span className="ef-role-dot" /> Owner &mdash; Aman</div>
          <button className="ef-theme-toggle" onClick={toggleTheme} data-testid="theme-toggle-btn" title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

        {viewMode === 'tool' ? (
          <div className="ef-tool-view-container" data-testid="tool-view-container">
            <ToolView toolId={activeToolId} toolName={activeToolName} />
          </div>
        ) : (
          <>
            <div className="ef-chat" ref={chatRef} data-testid="chat-area">
              {activeMessages.map((msg, i) => (
                <ChatMessage key={`${activeConvId}-${i}`} message={msg} onAction={handleAction} index={i} />
              ))}
              {typing && (
                <div className="ef-msg ai" data-testid="typing-indicator">
                  <div className="ef-avatar ai-av">E</div>
                  <div className="ef-bubble"><div className="ef-typing"><div className="ef-typing-dot" /><div className="ef-typing-dot" /><div className="ef-typing-dot" /></div></div>
                </div>
              )}
            </div>
            <InputBar onSend={handleSend} onToolSelect={handleToolClick} />
          </>
        )}
      </div>

      <Toaster theme={theme} position="bottom-right"
        toastOptions={{ style: theme === 'dark' ? { background: '#15151f', border: '1px solid rgba(255,255,255,0.09)', color: '#ededeb' } : { background: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', color: '#1a1a1e' } }} />
    </div>
  );
}

export default App;
