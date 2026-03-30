import { useState, useRef, useEffect } from 'react';
import { Send, Clock, IndianRupee, Users, BarChart3, AlertTriangle, FileText, Activity, Megaphone, ClipboardList, UserPlus, User } from 'lucide-react';
import { tools, students } from '@/data/mockData';

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

export default function InputBar({ onSend, onToolSelect }) {
  const [text, setText] = useState('');
  const [showTools, setShowTools] = useState(false);
  const [showStudents, setShowStudents] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [highlightIdx, setHighlightIdx] = useState(0);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const filteredTools = tools.filter(t =>
    t.name.toLowerCase().includes(filterText.toLowerCase()) ||
    t.desc.toLowerCase().includes(filterText.toLowerCase())
  );

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(filterText.toLowerCase()) ||
    s.class.toLowerCase().includes(filterText.toLowerCase())
  );

  const activeList = showTools ? filteredTools : showStudents ? filteredStudents : [];

  useEffect(() => {
    setHighlightIdx(0);
  }, [filterText, showTools, showStudents]);

  const handleChange = (e) => {
    const val = e.target.value;
    setText(val);

    // Detect / at the start
    if (val.startsWith('/')) {
      setShowTools(true);
      setShowStudents(false);
      setFilterText(val.slice(1));
    } else if (val.includes('@')) {
      const atIdx = val.lastIndexOf('@');
      const after = val.slice(atIdx + 1);
      if (!after.includes(' ') || after.length === 0) {
        setShowStudents(true);
        setShowTools(false);
        setFilterText(after);
      } else {
        setShowStudents(false);
      }
    } else {
      setShowTools(false);
      setShowStudents(false);
      setFilterText('');
    }
  };

  const handleToolClick = (tool) => {
    setShowTools(false);
    setText('');
    setFilterText('');
    if (onToolSelect) onToolSelect(tool.id);
  };

  const handleStudentClick = (student) => {
    const atIdx = text.lastIndexOf('@');
    const before = text.slice(0, atIdx);
    setText(`${before}@${student.name} `);
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
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightIdx((prev) => Math.min(prev + 1, activeList.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightIdx((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (showTools && filteredTools[highlightIdx]) {
          handleToolClick(filteredTools[highlightIdx]);
        } else if (showStudents && filteredStudents[highlightIdx]) {
          handleStudentClick(filteredStudents[highlightIdx]);
        }
        return;
      } else if (e.key === 'Escape') {
        setShowTools(false);
        setShowStudents(false);
        return;
      }
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowTools(false);
        setShowStudents(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="ef-input-wrap ef-dropdown-anchor" ref={dropdownRef} data-testid="input-bar">
      {/* Slash Command Dropdown */}
      {showTools && filteredTools.length > 0 && (
        <div className="ef-dropdown" data-testid="slash-dropdown">
          <div className="ef-dropdown-label">Tools</div>
          {filteredTools.map((tool, i) => {
            const Icon = iconMap[tool.icon] || Clock;
            const colors = colorMap[tool.color] || colorMap.blue;
            return (
              <div
                key={tool.id}
                className={`ef-dropdown-item ${i === highlightIdx ? 'highlighted' : ''}`}
                onClick={() => handleToolClick(tool)}
                data-testid={`slash-tool-${tool.id}`}
              >
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

      {/* @ Student Mention Dropdown */}
      {showStudents && filteredStudents.length > 0 && (
        <div className="ef-dropdown" data-testid="mention-dropdown">
          <div className="ef-dropdown-label">Students</div>
          {filteredStudents.map((student, i) => (
            <div
              key={`${student.name}-${student.class}`}
              className={`ef-dropdown-item ${i === highlightIdx ? 'highlighted' : ''}`}
              onClick={() => handleStudentClick(student)}
              data-testid={`mention-student-${student.name.replace(/\s+/g, '-').toLowerCase()}`}
            >
              <div className="ef-tool-ico" style={{ background: 'var(--green-dim)' }}>
                <User size={14} style={{ color: 'var(--green)' }} />
              </div>
              <div className="ef-dropdown-item-name">{student.name}</div>
              <span className="ef-student-class">{student.class}</span>
            </div>
          ))}
        </div>
      )}

      <form className="ef-input-bar" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Ask anything or type / to use a tool..."
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          data-testid="chat-input"
        />
        <button type="submit" className="ef-send-btn" data-testid="send-message-btn">
          <Send size={16} />
        </button>
      </form>
      <div className="ef-input-hint">
        Press <kbd>/</kbd> to browse tools &middot; <kbd>@</kbd> mention a student &middot; Hindi & English
      </div>
    </div>
  );
}
