import { useState, useRef, useEffect, useCallback } from 'react';
import '@/App.css';
import Sidebar from '@/components/Sidebar';
import ChatMessage from '@/components/ChatMessage';
import InputBar from '@/components/InputBar';
import ToolView from '@/components/ToolView';
import { Toaster, toast } from 'sonner';
import { tools, conversations, defaultHistory, keywordMap, toolFollowUps, toolIntros, paramKeywords, clarifyResponse } from '@/data/mockData';
import { Menu, Sun, Moon, ArrowLeft } from 'lucide-react';

function App() {
  const [activeConvId, setActiveConvId] = useState('morning_briefing');
  const [activeToolId, setActiveToolId] = useState(null);
  const [viewMode, setViewMode] = useState('chat');
  const [allConvs, setAllConvs] = useState(conversations);
  const [history, setHistory] = useState(defaultHistory.map(h => ({ ...h, starred: false, pinned: false })));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [pendingTool, setPendingTool] = useState(null);
  const chatRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    if (chatRef.current) setTimeout(() => { chatRef.current.scrollTop = chatRef.current.scrollHeight; }, 50);
  }, []);
  useEffect(() => { scrollToBottom(); }, [activeConvId, allConvs, scrollToBottom]);

  const activeMessages = allConvs[activeConvId]?.messages || [];

  const addToHistory = (id, title) => {
    setHistory(prev => { if (prev.some(h => h.id === id)) return prev; return [{ id, title, time: 'Just now', starred: false, pinned: false }, ...prev]; });
  };

  const addMessage = (convId, msg) => {
    setAllConvs(prev => ({
      ...prev, [convId]: { ...prev[convId], messages: [...(prev[convId]?.messages || []), msg] },
    }));
  };

  // --- Tool detection from /slash or keywords ---
  const extractToolFromSlash = (text) => {
    const match = text.match(/\/([\w-]+)/);
    if (match) {
      const slug = match[1].replace(/-/g, '_');
      if (tools.some(t => t.id === slug)) return slug;
    }
    return null;
  };

  const detectFromKeywords = (text) => {
    const lower = text.toLowerCase();
    for (const [keyword, moduleId] of Object.entries(keywordMap)) {
      if (lower.includes(keyword)) return moduleId;
    }
    return null;
  };

  const hasEnoughParams = (text, toolId) => {
    const keywords = paramKeywords[toolId] || [];
    if (keywords.length === 0) return true;
    const lower = text.toLowerCase();
    return keywords.some(k => lower.includes(k));
  };

  // --- Smart response engine ---
  const processMessage = (text, convId) => {
    // 1. If waiting for params from previous question, use the pending tool
    if (pendingTool) {
      const toolId = pendingTool;
      setPendingTool(null);
      return buildToolResponse(toolId, text);
    }

    // 2. Check for explicit /tool reference
    let toolId = extractToolFromSlash(text);
    const cleanText = text.replace(/\/[\w-]+\s*/, '').trim();

    // 3. If no explicit tool, auto-detect from keywords
    if (!toolId) toolId = detectFromKeywords(text);

    // 4. No tool found at all → ask for clarification
    if (!toolId) {
      return { role: 'ai', text: clarifyResponse };
    }

    // 5. Tool found — check if it needs follow-up params
    const followUp = toolFollowUps[toolId];
    if (followUp && !hasEnoughParams(cleanText, toolId)) {
      setPendingTool(toolId);
      const toolName = tools.find(t => t.id === toolId)?.name;
      return {
        role: 'ai',
        text: `Using <b>${toolName}</b>. ${followUp.question}`,
        tags: [{ name: toolName, icon: tools.find(t => t.id === toolId)?.icon }],
        actions: followUp.options,
        isQuickReply: true,
      };
    }

    // 6. All good — generate tool response
    return buildToolResponse(toolId, cleanText);
  };

  const buildToolResponse = (toolId, context) => {
    const conv = conversations[toolId];
    const aiMsg = conv?.messages.find(m => m.role === 'ai');
    if (!aiMsg) return { role: 'ai', text: "I'll look into that for you" };

    const toolName = tools.find(t => t.id === toolId)?.name;
    const intro = toolIntros[toolId] || '';
    return {
      ...aiMsg,
      role: 'ai',
      text: `${intro}\n\n${aiMsg.text}`,
      tags: [{ name: toolName, icon: tools.find(t => t.id === toolId)?.icon }],
      isQuickReply: false,
    };
  };

  // --- Handlers ---
  const ensureChatMode = () => {
    if (viewMode === 'chat') return activeConvId;
    const id = `chat_${Date.now()}`;
    const newConv = {
      id, title: 'New conversation', time: 'Just now',
      messages: [{ role: 'ai', text: "Hello Aman! What can I assist you with today?" }],
    };
    setAllConvs(prev => ({ ...prev, [id]: newConv }));
    setActiveConvId(id);
    setViewMode('chat');
    addToHistory(id, 'New conversation');
    return id;
  };

  const handleSend = (text) => {
    const convId = ensureChatMode();

    // Add user message
    const userMsg = { role: 'user', text };
    addMessage(convId, userMsg);

    // Update history title if new chat
    setHistory(prev => prev.map(h =>
      h.id === convId && h.title === 'New conversation'
        ? { ...h, title: text.slice(0, 40) + (text.length > 40 ? '...' : '') } : h
    ));

    setTyping(true);
    scrollToBottom();

    setTimeout(() => {
      const response = processMessage(text, convId);
      addMessage(convId, response);
      setTyping(false);
      scrollToBottom();
    }, 1000 + Math.random() * 500);
  };

  const handleAction = (action, isQuickReply) => {
    // If this is a quick-reply option (from a follow-up question), treat as user message
    if (isQuickReply || pendingTool) {
      handleSend(action);
    } else {
      toast.success(action, { description: 'Action completed', duration: 3000 });
    }
  };

  const handleToolClick = (toolId) => { setActiveToolId(toolId); setViewMode('tool'); setSidebarOpen(false); };
  const handleConvClick = (convId) => { setActiveConvId(convId); setViewMode('chat'); setSidebarOpen(false); };

  const handleNewChat = () => {
    const id = `chat_${Date.now()}`;
    setAllConvs(prev => ({ ...prev, [id]: {
      id, title: 'New conversation', time: 'Just now',
      messages: [{ role: 'ai', text: "Hello Aman! What can I assist you with today?" }],
    }}));
    setActiveConvId(id);
    setViewMode('chat');
    addToHistory(id, 'New conversation');
    setSidebarOpen(false);
    setPendingTool(null);
  };

  const handleRenameChat = (id, t) => { setHistory(prev => prev.map(h => h.id === id ? { ...h, title: t } : h)); };
  const handleToggleStar = (id) => { setHistory(prev => prev.map(h => h.id === id ? { ...h, starred: !h.starred } : h)); };
  const handleTogglePin = (id) => { setHistory(prev => prev.map(h => h.id === id ? { ...h, pinned: !h.pinned } : h)); };
  const handleDeleteChat = (id) => {
    setHistory(prev => prev.filter(h => h.id !== id));
    setAllConvs(prev => { const n = { ...prev }; delete n[id]; return n; });
    if (activeConvId === id) { setViewMode('tool'); setActiveToolId('school_pulse'); }
    toast.success('Chat deleted');
  };

  const toggleTheme = () => setTheme(p => p === 'dark' ? 'light' : 'dark');
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
            <InputBar onSend={handleSend} />
          </>
        )}
      </div>

      <Toaster theme={theme} position="bottom-right"
        toastOptions={{ style: theme === 'dark' ? { background: '#15151f', border: '1px solid rgba(255,255,255,0.09)', color: '#ededeb' } : { background: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', color: '#1a1a1e' } }} />
    </div>
  );
}

export default App;
