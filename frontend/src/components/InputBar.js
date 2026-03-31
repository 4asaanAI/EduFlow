import { useState, useRef, useEffect } from 'react';
import { Send, Clock, IndianRupee, Users, BarChart3, AlertTriangle, FileText, Activity, Megaphone, ClipboardList, UserPlus, User } from 'lucide-react';
import { tools, students } from '@/data/mockData';

const iconMap = { Clock, IndianRupee, Users, BarChart3, AlertTriangle, FileText, Activity, Megaphone, ClipboardList, UserPlus };
const colorMap = {
  blue: { bg: 'var(--blue-dim)', stroke: 'var(--blue)' },
  orange: { bg: 'var(--orange-dim)', stroke: 'var(--orange)' },
  green: { bg: 'var(--green-dim)', stroke: 'var(--green)' },
  red: { bg: 'var(--red-dim)', stroke: 'var(--red)' },
  purple: { bg: 'var(--purple-dim)', stroke: 'var(--purple)' },
};

export default function InputBar({ onSend }) {
  const [text, setText] = useState('');
  const [showTools, setShowTools] = useState(false);
  const [showStudents, setShowStudents] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [highlightIdx, setHighlightIdx] = useState(0);
  const [slashStart, setSlashStart] = useState(-1);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const filteredTools = tools.filter(t =>
    t.name.toLowerCase().includes(filterText.toLowerCase()) ||
    t.id.replace(/_/g, '-').includes(filterText.toLowerCase()) ||
    t.desc.toLowerCase().includes(filterText.toLowerCase())
  );
  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(filterText.toLowerCase()) ||
    s.class.toLowerCase().includes(filterText.toLowerCase())
  );
  const activeList = showTools ? filteredTools : showStudents ? filteredStudents : [];

  useEffect(() => { setHighlightIdx(0); }, [filterText, showTools, showStudents]);

  const handleChange = (e) => {
    const val = e.target.value;
    const cursor = e.target.selectionStart;
    setText(val);

    // Detect / — find the last / before cursor that isn't followed by a completed tool tag
    const beforeCursor = val.slice(0, cursor);
    const lastSlash = beforeCursor.lastIndexOf('/');
    if (lastSlash !== -1) {
      const afterSlash = beforeCursor.slice(lastSlash + 1);
      // Only show dropdown if no space in the filter (still typing the tool name)
      if (!afterSlash.includes(' ')) {
        setShowTools(true);
        setShowStudents(false);
        setFilterText(afterSlash);
        setSlashStart(lastSlash);
        return;
      }
    }

    // Detect @ for student mentions
    const lastAt = beforeCursor.lastIndexOf('@');
    if (lastAt !== -1) {
      const afterAt = beforeCursor.slice(lastAt + 1);
      if (!afterAt.includes(' ') || afterAt.length === 0) {
        setShowStudents(true);
        setShowTools(false);
        setFilterText(afterAt);
        return;
      }
    }

    setShowTools(false);
    setShowStudents(false);
    setFilterText('');
  };

  const handleToolClick = (tool) => {
    // Insert /tool-slug into text at the slash position, replacing the partial text
    const before = text.slice(0, slashStart);
    const afterFilter = text.slice(slashStart).indexOf(' ');
    const after = afterFilter === -1 ? '' : text.slice(slashStart + afterFilter);
    const slug = tool.id.replace(/_/g, '-');
    const newText = `${before}/${slug} ${after}`.replace(/\s+/g, ' ');
    setText(newText);
    setShowTools(false);
    setFilterText('');
    inputRef.current?.focus();
  };

  const handleStudentClick = (student) => {
    const atIdx = text.lastIndexOf('@');
    const before = text.slice(0, atIdx);
    const afterAt = text.slice(atIdx);
    const spaceIdx = afterAt.indexOf(' ');
    const after = spaceIdx === -1 ? '' : afterAt.slice(spaceIdx);
    setText(`${before}@${student.name} ${after}`.replace(/\s+/g, ' '));
    setShowStudents(false);
    setFilterText('');
    inputRef.current?.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setShowTools(false);
    setShowStudents(false);
    onSend(text.trim());
    setText('');
  };

  const handleKeyDown = (e) => {
    if (showTools || showStudents) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setHighlightIdx(p => Math.min(p + 1, activeList.length - 1)); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlightIdx(p => Math.max(p - 1, 0)); }
      else if (e.key === 'Enter') {
        e.preventDefault();
        if (showTools && filteredTools[highlightIdx]) handleToolClick(filteredTools[highlightIdx]);
        else if (showStudents && filteredStudents[highlightIdx]) handleStudentClick(filteredStudents[highlightIdx]);
        return;
      } else if (e.key === 'Escape') { setShowTools(false); setShowStudents(false); return; }
      else if (e.key === 'Tab' && (showTools || showStudents)) {
        e.preventDefault();
        if (showTools && filteredTools[highlightIdx]) handleToolClick(filteredTools[highlightIdx]);
        else if (showStudents && filteredStudents[highlightIdx]) handleStudentClick(filteredStudents[highlightIdx]);
        return;
      }
    } else if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e); }
  };

  useEffect(() => {
    const h = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) { setShowTools(false); setShowStudents(false); } };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <div className="ef-input-wrap ef-dropdown-anchor" ref={dropdownRef} data-testid="input-bar">
      {showTools && filteredTools.length > 0 && (
        <div className="ef-dropdown" data-testid="slash-dropdown">
          <div className="ef-dropdown-label">Insert tool into prompt</div>
          {filteredTools.map((tool, i) => {
            const Icon = iconMap[tool.icon] || Clock;
            const colors = colorMap[tool.color] || colorMap.blue;
            return (
              <div key={tool.id} className={`ef-dropdown-item ${i === highlightIdx ? 'highlighted' : ''}`}
                onClick={() => handleToolClick(tool)} data-testid={`slash-tool-${tool.id}`}>
                <div className="ef-tool-ico" style={{ background: colors.bg }}>
                  <Icon size={14} style={{ color: colors.stroke }} />
                </div>
                <div>
                  <div className="ef-dropdown-item-name">/{tool.id.replace(/_/g, '-')}</div>
                  <div className="ef-dropdown-item-desc">{tool.name} &mdash; {tool.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showStudents && filteredStudents.length > 0 && (
        <div className="ef-dropdown" data-testid="mention-dropdown">
          <div className="ef-dropdown-label">Mention student</div>
          {filteredStudents.map((student, i) => (
            <div key={`${student.name}-${student.class}`} className={`ef-dropdown-item ${i === highlightIdx ? 'highlighted' : ''}`}
              onClick={() => handleStudentClick(student)} data-testid={`mention-student-${student.name.replace(/\s+/g, '-').toLowerCase()}`}>
              <div className="ef-tool-ico" style={{ background: 'var(--green-dim)' }}><User size={14} style={{ color: 'var(--green)' }} /></div>
              <div className="ef-dropdown-item-name">{student.name}</div>
              <span className="ef-student-class">{student.class}</span>
            </div>
          ))}
        </div>
      )}

      <form className="ef-input-bar" onSubmit={handleSubmit}>
        <input ref={inputRef} type="text" placeholder="Describe what you need, or type / to use a tool..."
          value={text} onChange={handleChange} onKeyDown={handleKeyDown} data-testid="chat-input" />
        <button type="submit" className="ef-send-btn" data-testid="send-message-btn"><Send size={16} /></button>
      </form>
      <div className="ef-input-hint">
        <kbd>/</kbd> insert tool &middot; <kbd>@</kbd> mention student &middot; or just describe what you need
      </div>
    </div>
  );
}
