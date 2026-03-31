import { useState, useRef, useEffect, useMemo } from 'react';
import { Search, X, Clock, IndianRupee, Users, BarChart3, AlertTriangle, FileText, Activity, Megaphone, ClipboardList, UserPlus, MessageSquare, BookOpen, GraduationCap, Bus, Building, CalendarDays } from 'lucide-react';
import { tools } from '@/data/mockData';

const toolIconMap = { Clock, IndianRupee, Users, BarChart3, AlertTriangle, FileText, Activity, Megaphone, ClipboardList, UserPlus };
const colorMap = {
  blue: { bg: 'var(--blue-dim)', stroke: 'var(--blue)' },
  orange: { bg: 'var(--orange-dim)', stroke: 'var(--orange)' },
  green: { bg: 'var(--green-dim)', stroke: 'var(--green)' },
  red: { bg: 'var(--red-dim)', stroke: 'var(--red)' },
  purple: { bg: 'var(--purple-dim)', stroke: 'var(--purple)' },
};

const generalTopics = [
  { name: 'Student information', desc: 'Look up any student', icon: GraduationCap, category: 'info' },
  { name: 'Class details', desc: 'Class-wise data and stats', icon: BookOpen, category: 'info' },
  { name: 'Exam results', desc: 'Test scores and rankings', icon: FileText, category: 'info' },
  { name: 'Timetable', desc: 'Daily and weekly schedule', icon: CalendarDays, category: 'info' },
  { name: 'Events calendar', desc: 'Upcoming events and functions', icon: CalendarDays, category: 'info' },
  { name: 'Transport & buses', desc: 'Routes, drivers, status', icon: Bus, category: 'info' },
  { name: 'Infrastructure', desc: 'Facilities, labs, maintenance', icon: Building, category: 'info' },
  { name: 'Parent feedback', desc: 'Complaints, PTM, communication', icon: MessageSquare, category: 'info' },
  { name: 'School policies', desc: 'Rules, uniform, discipline', icon: FileText, category: 'info' },
  { name: 'Homework tracker', desc: 'Pending assignments and projects', icon: BookOpen, category: 'info' },
];

export default function SearchModal({ open, onClose, history, onToolClick, onConvClick, onSendMessage }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    if (!open) setQuery('');
  }, [open]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); onClose('toggle'); }
      if (e.key === 'Escape' && open) onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  const results = useMemo(() => {
    if (!query.trim()) return { tools: tools, chats: history.slice(0, 5), topics: generalTopics.slice(0, 5) };
    const q = query.toLowerCase();
    return {
      tools: tools.filter(t => t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q)),
      chats: history.filter(h => h.title.toLowerCase().includes(q)),
      topics: generalTopics.filter(t => t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q)),
    };
  }, [query, history]);

  const hasResults = results.tools.length + results.chats.length + results.topics.length > 0;

  if (!open) return null;

  return (
    <div className="ef-search-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} data-testid="search-overlay">
      <div className="ef-search-modal" ref={panelRef} data-testid="search-modal">
        <div className="ef-search-input-wrap">
          <Search size={16} />
          <input ref={inputRef} type="text" placeholder="Search tools, chats, or ask about anything..." value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && query.trim()) { onSendMessage(query.trim()); onClose(); }
            }}
            data-testid="search-input" />
          <kbd className="ef-search-kbd">ESC</kbd>
        </div>

        <div className="ef-search-results">
          {!hasResults && <div className="ef-search-empty">No results \u2014 press Enter to ask in chat</div>}

          {results.tools.length > 0 && (
            <div className="ef-search-section">
              <div className="ef-search-section-label">Tools</div>
              {results.tools.map(tool => {
                const Icon = toolIconMap[tool.icon] || Clock;
                const colors = colorMap[tool.color] || colorMap.blue;
                return (
                  <div key={tool.id} className="ef-search-item" onClick={() => { onToolClick(tool.id); onClose(); }} data-testid={`search-tool-${tool.id}`}>
                    <div className="ef-tool-ico" style={{ background: colors.bg, width: 28, height: 28 }}>
                      <Icon size={14} style={{ color: colors.stroke }} />
                    </div>
                    <div><div className="ef-search-item-name">{tool.name}</div><div className="ef-search-item-desc">{tool.desc}</div></div>
                  </div>
                );
              })}
            </div>
          )}

          {results.chats.length > 0 && (
            <div className="ef-search-section">
              <div className="ef-search-section-label">Chat History</div>
              {results.chats.map(conv => (
                <div key={conv.id} className="ef-search-item" onClick={() => { onConvClick(conv.id); onClose(); }} data-testid={`search-chat-${conv.id}`}>
                  <div className="ef-tool-ico" style={{ background: 'var(--blue-dim)', width: 28, height: 28 }}>
                    <MessageSquare size={14} style={{ color: 'var(--blue)' }} />
                  </div>
                  <div><div className="ef-search-item-name">{conv.title}</div><div className="ef-search-item-desc">{conv.time}</div></div>
                </div>
              ))}
            </div>
          )}

          {results.topics.length > 0 && (
            <div className="ef-search-section">
              <div className="ef-search-section-label">School Information</div>
              {results.topics.map((topic, i) => {
                const Icon = topic.icon;
                return (
                  <div key={i} className="ef-search-item" onClick={() => { onSendMessage(`Tell me about ${topic.name.toLowerCase()}`); onClose(); }} data-testid={`search-topic-${i}`}>
                    <div className="ef-tool-ico" style={{ background: 'var(--purple-dim)', width: 28, height: 28 }}>
                      <Icon size={14} style={{ color: 'var(--purple)' }} />
                    </div>
                    <div><div className="ef-search-item-name">{topic.name}</div><div className="ef-search-item-desc">{topic.desc}</div></div>
                  </div>
                );
              })}
            </div>
          )}

          {query.trim() && (
            <div className="ef-search-section">
              <div className="ef-search-ask-row" onClick={() => { onSendMessage(query.trim()); onClose(); }} data-testid="search-ask-chat">
                <MessageSquare size={14} /> Ask &ldquo;{query}&rdquo; in chat
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
