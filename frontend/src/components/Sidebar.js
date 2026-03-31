import { useState, useRef, useEffect } from 'react';
import { Clock, IndianRupee, Users, BarChart3, AlertTriangle, FileText, Activity, Megaphone, ClipboardList, UserPlus, X, MessageSquare, Plus, MoreHorizontal, Star, Pin, Trash2, Pencil } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const iconMap = { Clock, IndianRupee, Users, BarChart3, AlertTriangle, FileText, Activity, Megaphone, ClipboardList, UserPlus };
const colorMap = {
  blue: { bg: 'var(--blue-dim)', stroke: 'var(--blue)' },
  orange: { bg: 'var(--orange-dim)', stroke: 'var(--orange)' },
  green: { bg: 'var(--green-dim)', stroke: 'var(--green)' },
  red: { bg: 'var(--red-dim)', stroke: 'var(--red)' },
  purple: { bg: 'var(--purple-dim)', stroke: 'var(--purple)' },
};

function ChatItemMenu({ conv, onRename, onToggleStar, onTogglePin, onDelete, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  return (
    <div className="ef-chat-menu" ref={ref} data-testid={`chat-menu-${conv.id}`}>
      <button onClick={() => { onRename(conv.id); onClose(); }} data-testid={`chat-rename-${conv.id}`}><Pencil size={13}/> Rename</button>
      <button onClick={() => { onToggleStar(conv.id); onClose(); }} data-testid={`chat-star-${conv.id}`}><Star size={13}/> {conv.starred ? 'Unstar' : 'Star'}</button>
      <button onClick={() => { onTogglePin(conv.id); onClose(); }} data-testid={`chat-pin-${conv.id}`}><Pin size={13}/> {conv.pinned ? 'Unpin' : 'Pin'}</button>
      <button className="danger" onClick={() => { onDelete(conv.id); onClose(); }} data-testid={`chat-delete-${conv.id}`}><Trash2 size={13}/> Delete</button>
    </div>
  );
}

export default function Sidebar({ tools, history, activeConvId, activeToolId, viewMode, onToolClick, onConvClick, onNewChat, onRenameChat, onToggleStar, onTogglePin, onDeleteChat, isOpen, onClose }) {
  const [menuOpen, setMenuOpen] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const editRef = useRef(null);

  useEffect(() => {
    if (editingId && editRef.current) editRef.current.focus();
  }, [editingId]);

  const startRename = (id) => {
    const conv = history.find(h => h.id === id);
    if (conv) { setEditingId(id); setEditText(conv.title); }
  };

  const commitRename = () => {
    if (editingId && editText.trim()) { onRenameChat(editingId, editText.trim()); }
    setEditingId(null);
  };

  const pinnedChats = history.filter(h => h.pinned);
  const starredChats = history.filter(h => h.starred && !h.pinned);
  const regularChats = history.filter(h => !h.pinned && !h.starred);

  const renderChatItem = (conv) => {
    const isActive = viewMode === 'chat' && activeConvId === conv.id;
    return (
      <div key={conv.id} className={`ef-history-item ${isActive ? 'active' : ''}`} style={{ position: 'relative' }}>
        <div className="ef-history-item-content" onClick={() => onConvClick(conv.id)} data-testid={`sidebar-history-${conv.id}`}>
          <MessageSquare size={16} />
          <div style={{ flex: 1, minWidth: 0 }}>
            {editingId === conv.id ? (
              <input ref={editRef} className="ef-history-rename-input" value={editText} onChange={(e) => setEditText(e.target.value)}
                onBlur={commitRename} onKeyDown={(e) => { if (e.key === 'Enter') commitRename(); if (e.key === 'Escape') setEditingId(null); }}
                data-testid={`chat-rename-input-${conv.id}`} onClick={(e) => e.stopPropagation()} />
            ) : (
              <>
                <div className="ef-history-title">
                  {conv.pinned && <Pin size={11} style={{ marginRight: 3, flexShrink: 0 }} />}
                  {conv.starred && <Star size={11} style={{ marginRight: 3, flexShrink: 0, fill: 'var(--orange)', color: 'var(--orange)' }} />}
                  <span>{conv.title}</span>
                </div>
                <div className="ef-history-meta">{conv.time}</div>
              </>
            )}
          </div>
        </div>
        <button className="ef-history-more" onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === conv.id ? null : conv.id); }}
          data-testid={`chat-more-${conv.id}`}><MoreHorizontal size={14} /></button>
        {menuOpen === conv.id && (
          <ChatItemMenu conv={conv} onRename={startRename} onToggleStar={onToggleStar} onTogglePin={onTogglePin} onDelete={onDeleteChat} onClose={() => setMenuOpen(null)} />
        )}
      </div>
    );
  };

  return (
    <>
      <div className={`ef-sb-bg ${isOpen ? 'open' : ''}`} onClick={onClose} data-testid="sidebar-overlay" />
      <aside className={`ef-sidebar ${isOpen ? 'open' : ''}`} data-testid="sidebar">
        <div className="ef-sb-head">
          <div className="ef-logo-mark">
            <div className="ef-logo-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </div>
            <span className="ef-logo-text">EduFlow</span>
          </div>
          <button className="ef-sb-close" onClick={onClose} data-testid="sidebar-close-btn"><X size={18} /></button>
        </div>

        <div className="ef-tools-section">
          <div className="ef-sb-label">Tools</div>
          {tools.map((tool) => {
            const Icon = iconMap[tool.icon] || Clock;
            const colors = colorMap[tool.color] || colorMap.blue;
            return (
              <div key={tool.id} className={`ef-tool-item ${viewMode === 'tool' && activeToolId === tool.id ? 'active' : ''}`}
                onClick={() => onToolClick(tool.id)} data-testid={`sidebar-tool-${tool.id}`}>
                <div className="ef-tool-ico" style={{ background: colors.bg }}><Icon size={15} style={{ color: colors.stroke }} /></div>
                <div><div className="ef-tool-name">{tool.name}</div><div className="ef-tool-desc">{tool.desc}</div></div>
              </div>
            );
          })}
        </div>

        <ScrollArea className="ef-history-section">
          <div className="ef-sb-label">Chat History</div>
          {pinnedChats.length > 0 && pinnedChats.map(renderChatItem)}
          {starredChats.length > 0 && starredChats.map(renderChatItem)}
          {regularChats.map(renderChatItem)}
          {history.length === 0 && <div style={{ padding: '10px', fontSize: 12, color: 'var(--tx-4)' }}>No recent chats</div>}
        </ScrollArea>

        <div className="ef-sb-foot">
          <button className="ef-sb-new" onClick={onNewChat} data-testid="new-chat-btn"><Plus size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} /> New Chat</button>
        </div>
      </aside>
    </>
  );
}
