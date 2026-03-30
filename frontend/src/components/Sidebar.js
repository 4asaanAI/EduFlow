import { Clock, IndianRupee, Users, BarChart3, AlertTriangle, FileText, Activity, Megaphone, ClipboardList, UserPlus, X, MessageSquare, Plus } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const iconMap = {
  Clock, IndianRupee, Users, BarChart3, AlertTriangle, FileText, Activity, Megaphone, ClipboardList, UserPlus,
};

const colorMap = {
  blue: { bg: 'var(--blue-dim)', stroke: 'var(--blue)' },
  orange: { bg: 'var(--orange-dim)', stroke: 'var(--orange)' },
  green: { bg: 'var(--green-dim)', stroke: 'var(--green)' },
  red: { bg: 'var(--red-dim)', stroke: 'var(--red)' },
  purple: { bg: 'var(--purple-dim)', stroke: 'var(--purple)' },
};

export default function Sidebar({ tools, history, activeConvId, onToolClick, onConvClick, onNewChat, isOpen, onClose }) {
  return (
    <>
      <div
        className={`ef-sb-bg ${isOpen ? 'open' : ''}`}
        onClick={onClose}
        data-testid="sidebar-overlay"
      />
      <aside className={`ef-sidebar ${isOpen ? 'open' : ''}`} data-testid="sidebar">
        {/* Header */}
        <div className="ef-sb-head">
          <div className="ef-logo-mark">
            <div className="ef-logo-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </div>
            <span className="ef-logo-text">EduFlow</span>
          </div>
          <button className="ef-sb-close" onClick={onClose} data-testid="sidebar-close-btn">
            <X size={18} />
          </button>
        </div>

        {/* Tools Section */}
        <div className="ef-tools-section">
          <div className="ef-sb-label">Tools</div>
          {tools.map((tool) => {
            const Icon = iconMap[tool.icon] || Clock;
            const colors = colorMap[tool.color] || colorMap.blue;
            return (
              <div
                key={tool.id}
                className={`ef-tool-item ${activeConvId === tool.id ? 'active' : ''}`}
                onClick={() => onToolClick(tool.id)}
                data-testid={`sidebar-tool-${tool.id}`}
              >
                <div className="ef-tool-ico" style={{ background: colors.bg }}>
                  <Icon size={15} style={{ color: colors.stroke }} />
                </div>
                <div>
                  <div className="ef-tool-name">{tool.name}</div>
                  <div className="ef-tool-desc">{tool.desc}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Chat History */}
        <ScrollArea className="ef-history-section">
          <div className="ef-sb-label">Chat History</div>
          {history.map((conv) => (
            <div
              key={conv.id}
              className={`ef-history-item ${activeConvId === conv.id ? 'active' : ''}`}
              onClick={() => onConvClick(conv.id)}
              data-testid={`sidebar-history-${conv.id}`}
            >
              <MessageSquare size={16} />
              <div>
                <div style={{ fontSize: 13 }}>{conv.title}</div>
                <div className="ef-history-meta">{conv.time}</div>
              </div>
            </div>
          ))}
        </ScrollArea>

        {/* Footer */}
        <div className="ef-sb-foot">
          <button className="ef-sb-new" onClick={onNewChat} data-testid="new-chat-btn">
            <Plus size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
            New Chat
          </button>
        </div>
      </aside>
    </>
  );
}
