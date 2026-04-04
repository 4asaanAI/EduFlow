import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';
import {
  getConversations, createConversation, getMessages, sendMessageStream,
  updateConversation, deleteConversation,
} from '../lib/api';
import MessageRenderer from './MessageRenderer';
import InputBar from './InputBar';

const API = process.env.REACT_APP_BACKEND_URL + '/api';

function getHeaders(user) {
  return { 'Content-Type': 'application/json', 'X-User-Role': user?.role || 'owner', 'X-User-Id': user?.id || 'user-owner-001', 'X-User-Name': user?.name || 'Aman' };
}

async function executeAction(convId, action, params, label, user) {
  const res = await fetch(`${API}/chat/conversations/${convId}/action`, {
    method: 'POST', headers: getHeaders(user),
    body: JSON.stringify({ action, params, label }),
  });
  return res.json();
}

function TypingIndicator({ isDark }) {
  return (
    <div style={{ display: 'flex', gap: 12, padding: '8px 0', alignItems: 'flex-start' }}>
      <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 13, color: '#818CF8', flexShrink: 0 }}>E</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, paddingTop: 6 }}>
        <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
      </div>
    </div>
  );
}

function ToolCallBadge({ tool, status }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: 6, padding: '3px 8px', fontSize: 11, color: '#93C5FD', marginBottom: 8 }}>
      {status === 'running' ? <div className="spinner" style={{ width: 10, height: 10 }} /> : <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981' }} />}
      <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>{tool}</span>
      <span style={{ color: '#64748B' }}>{status === 'running' ? '...' : 'done'}</span>
    </div>
  );
}

export default function ChatInterface({ activeConvId, onConvCreated }) {
  const { currentUser } = useUser();
  const [convId, setConvId] = useState(activeConvId);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [currentStreamMsg, setCurrentStreamMsg] = useState(null);
  const messagesEndRef = useRef(null);

  // Sync external convId
  useEffect(() => {
    if (activeConvId && activeConvId !== convId) {
      setConvId(activeConvId);
    }
  }, [activeConvId]);

  // Load messages when conversation changes OR user switches role  
  useEffect(() => {
    if (convId) {
      setMessages([]);
      loadMessages(convId);
    } else {
      setMessages([]);
    }
  }, [convId, currentUser.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentStreamMsg]);

  const loadMessages = async (id) => {
    try {
      const res = await getMessages(id, currentUser);
      if (res.success) {
        setMessages(res.data || []);
      }
    } catch {}
  };

  const handleSend = async (text) => {
    if (!text.trim() || streaming) return;

    let cid = convId;

    // Create conversation if none
    if (!cid) {
      const res = await createConversation(currentUser);
      if (!res.success) return;
      cid = res.data.id;
      setConvId(cid);
      onConvCreated(cid);
    }

    // Add user message to UI
    const userMsg = { id: `tmp-${Date.now()}`, role: 'user', content: text, created_at: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setStreaming(true);

    // Init streaming message
    const streamMsg = { id: 'streaming', role: 'assistant', content: '', toolCall: null, richBlocks: [], actionButtons: [] };
    setCurrentStreamMsg({ ...streamMsg });

    try {
      await sendMessageStream(cid, text, currentUser, (event) => {
        if (event.type === 'text_delta') {
          setCurrentStreamMsg(prev => ({ ...prev, content: (prev?.content || '') + event.delta }));
        } else if (event.type === 'tool_call') {
          setCurrentStreamMsg(prev => ({ ...prev, toolCall: { tool: event.tool, status: event.status } }));
        } else if (event.type === 'rich_blocks') {
          setCurrentStreamMsg(prev => ({
            ...prev,
            richBlocks: event.blocks || [],
            actionButtons: event.action_buttons || [],
          }));
        } else if (event.type === 'done') {
          setStreaming(false);
          // Finalize the streaming message into messages array (don't reload from DB to avoid duplicates)
          setCurrentStreamMsg(prev => {
            if (prev) {
              const finalMsg = {
                ...prev,
                id: event.message_id || `ai-${Date.now()}`,
                role: 'assistant',
              };
              setMessages(m => [...m, finalMsg]);
            }
            return null;
          });
        }
      });
    } catch (err) {
      setStreaming(false);
      setCurrentStreamMsg(null);
      setMessages(prev => [...prev, {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: 'Something went wrong. Please try again.',
        created_at: new Date().toISOString(),
      }]);
    }
  };

  const handleActionButton = async (action, params, label) => {
    if (!convId) return;
    try {
      const actionIndicator = { id: `act-${Date.now()}`, role: 'user', content: `▶ ${label || action}`, isAction: true, created_at: new Date().toISOString() };
      setMessages(prev => [...prev, actionIndicator]);
      const res = await executeAction(convId, action, params, label, currentUser);
      if (res.success) {
        const resultMsg = { id: `res-${Date.now()}`, role: 'assistant', content: res.data?.message || 'Done.', created_at: new Date().toISOString() };
        setMessages(prev => [...prev, resultMsg]);
      }
    } catch {}
  };

  const isNewChat = !convId || messages.length === 0;
  const bg = '#0A0A0F'; // always dark for chat area for now

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', background: bg }}>
      <div data-testid="messages-area" style={{ flex: 1, overflowY: 'auto', padding: '24px 0 180px' }}>
        <div style={{ maxWidth: 820, margin: '0 auto', padding: '0 24px' }}>
          {isNewChat && (
            <div className="fade-in" style={{ textAlign: 'center', padding: '60px 0 40px' }}>
              <div style={{ width: 56, height: 56, borderRadius: 14, background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 24, color: '#818CF8' }}>E</div>
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 22, fontWeight: 600, color: '#fff', marginBottom: 8 }}>
                Hello {currentUser.name}! What can I assist you with today?
              </h2>
              <p style={{ color: '#64748B', fontSize: 13, maxWidth: 400, margin: '0 auto 32px' }}>
                Ask me anything about your school, or type / to use a specific tool.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', maxWidth: 600, margin: '0 auto' }}>
                {getSuggestedPrompts(currentUser.role).map((prompt, i) => (
                  <button key={i} data-testid={`suggested-prompt-${i}`} onClick={() => handleSend(prompt)}
                    style={{ background: '#161622', border: '1px solid #222230', borderRadius: 8, padding: '8px 14px', color: '#94A3B8', fontSize: 12, cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#1C1C28'; e.currentTarget.style.color = '#E2E8F0'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#161622'; e.currentTarget.style.color = '#94A3B8'; }}
                  >{prompt}</button>
                ))}
              </div>
            </div>
          )}
          {messages.map((msg, idx) => (
            <div key={msg.id || idx} className="fade-in">
              <MessageRenderer message={msg} onActionButton={handleActionButton} />
            </div>
          ))}
          {streaming && currentStreamMsg && (
            <div className="fade-in">
              {currentStreamMsg.toolCall && (
                <div style={{ paddingLeft: 42, marginBottom: 4 }}>
                  <ToolCallBadge tool={currentStreamMsg.toolCall.tool} status={currentStreamMsg.toolCall.status} />
                </div>
              )}
              {currentStreamMsg.content ? (
                <MessageRenderer message={{ ...currentStreamMsg, role: 'assistant' }} isStreaming onActionButton={handleActionButton} />
              ) : (
                <TypingIndicator />
              )}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <InputBar onSend={handleSend} disabled={streaming} />
    </div>
  );
}

function getSuggestedPrompts(role) {
  const prompts = {
    owner: [
      "Show me today's school status",
      "Who are the top fee defaulters?",
      "Which staff were absent this week?",
      "Give me a financial summary for this month",
    ],
    admin: [
      "Show fee defaulters list",
      "Search for a student named Rahul",
      "What leave requests are pending?",
      "Show today's attendance",
    ],
    teacher: [
      "Show my class attendance",
      "List students in my class",
      "What assignments are due?",
      "Show school announcements",
    ],
    student: [
      "What is my attendance percentage?",
      "Show my fee payment status",
      "What are my recent exam results?",
      "Any new school announcements?",
    ],
  };
  return prompts[role] || prompts.owner;
}
