import { useState } from 'react';
import { Send } from 'lucide-react';

export default function InputBar({ onSend }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="ef-input-wrap" data-testid="input-bar">
      <form className="ef-input-bar" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Ask anything or type / to use a tool..."
          value={text}
          onChange={(e) => setText(e.target.value)}
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
