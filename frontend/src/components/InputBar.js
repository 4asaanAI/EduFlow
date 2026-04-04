import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, X } from 'lucide-react';

const TOOL_SUGGESTIONS = [
  { id: 'school-pulse', label: '/school-pulse', desc: "Today's school overview" },
  { id: 'fee-collection', label: '/fee-collection', desc: 'Fee summary & defaulters' },
  { id: 'staff-tracker', label: '/staff-tracker', desc: 'Staff attendance & leaves' },
  { id: 'attendance-overview', label: '/attendance-overview', desc: 'Attendance trends' },
  { id: 'fee-summary', label: '/fee-summary', desc: 'Fee collection report' },
  { id: 'smart-alerts', label: '/smart-alerts', desc: 'Active alerts' },
];

export default function InputBar({ onSend, disabled }) {
  const [text, setText] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (text.startsWith('/')) {
      const query = text.slice(1).toLowerCase();
      const filtered = TOOL_SUGGESTIONS.filter(
        s => s.label.toLowerCase().includes(query) || s.desc.toLowerCase().includes(query)
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [text]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    if (e.key === 'Escape') setShowSuggestions(false);
  };

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText('');
    setShowSuggestions(false);
  };

  const handleSuggestion = (suggestion) => {
    const prompt = `Use ${suggestion.label.slice(1)} tool to get the data`;
    onSend(prompt);
    setText('');
    setShowSuggestions(false);
  };

  return (
    <div
      data-testid="input-bar"
      style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        background: 'linear-gradient(to top, #0A0A0F 70%, transparent)',
        padding: '32px 24px 24px',
        zIndex: 40,
      }}
    >
      <div style={{ maxWidth: 820, margin: '0 auto', position: 'relative' }}>

        {/* Slash command suggestions */}
        {showSuggestions && (
          <div style={{
            position: 'absolute',
            bottom: '100%',
            left: 0, right: 0,
            background: '#1C1C28',
            border: '1px solid #222230',
            borderRadius: 10,
            marginBottom: 6,
            overflow: 'hidden',
            boxShadow: '0 -8px 32px rgba(0,0,0,0.4)',
          }}>
            {filteredSuggestions.map((s) => (
              <button
                key={s.id}
                data-testid={`suggestion-${s.id}`}
                onClick={() => handleSuggestion(s)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 14px', background: 'transparent', border: 'none',
                  cursor: 'pointer', textAlign: 'left', transition: 'background 0.1s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <code style={{ fontSize: 12, color: '#818CF8', fontFamily: 'JetBrains Mono, monospace' }}>{s.label}</code>
                <span style={{ fontSize: 12, color: '#64748B' }}>{s.desc}</span>
              </button>
            ))}
          </div>
        )}

        {/* Input box */}
        <div style={{
          background: '#1C1C28',
          border: `1px solid ${disabled ? '#1A1A24' : '#222230'}`,
          borderRadius: 14,
          display: 'flex',
          alignItems: 'flex-end',
          padding: '10px 12px',
          gap: 8,
          transition: 'border-color 0.15s',
        }}
        onFocus={() => {}}
        >
          <textarea
            ref={textareaRef}
            data-testid="chat-input"
            value={text}
            onChange={e => {
              setText(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px';
            }}
            onKeyDown={handleKeyDown}
            placeholder={disabled ? 'EduFlow AI is thinking...' : 'Describe what you need, or type / to use a tool...'}
            disabled={disabled}
            rows={1}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: disabled ? '#475569' : '#E2E8F0',
              fontSize: 13,
              resize: 'none',
              lineHeight: 1.5,
              padding: 0,
              fontFamily: 'Manrope, sans-serif',
              maxHeight: 160,
              overflowY: 'auto',
            }}
          />
          <button
            data-testid="send-btn"
            onClick={handleSend}
            disabled={disabled || !text.trim()}
            style={{
              width: 32, height: 32, borderRadius: 8,
              background: disabled || !text.trim() ? '#1A1A24' : '#3B82F6',
              border: 'none', cursor: disabled || !text.trim() ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, transition: 'background 0.15s',
            }}
          >
            <Send size={13} color={disabled || !text.trim() ? '#374151' : '#fff'} />
          </button>
        </div>

        {/* Footer hint */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 8, color: '#374151', fontSize: 10 }}>
          <span>/ tool search</span>
          <span>@ mentions</span>
          <span style={{ color: '#374151' }}>EduFlow's AI can make mistakes. Please double-check responses</span>
        </div>
      </div>
    </div>
  );
}
