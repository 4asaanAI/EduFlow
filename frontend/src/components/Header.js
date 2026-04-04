import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { Search, Bell, Settings, ChevronDown, ChevronLeft, Sun, Moon } from 'lucide-react';

const ROLE_COLORS = {
  owner: '#F97316',
  admin: '#3B82F6',
  teacher: '#10B981',
  student: '#8B5CF6',
};

const ROLE_LABELS = {
  owner: 'Owner',
  admin: 'Admin',
  teacher: 'Teacher',
  student: 'Student',
};

export default function Header({ activeTool, onBackToChat }) {
  const { currentUser, switchRole, MOCK_USERS } = useUser();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const title = activeTool
    ? activeTool.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')
    : 'EduFlow AI';

  return (
    <header
      data-testid="main-header"
      style={{
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        borderBottom: '1px solid #222230',
        background: '#0A0A0F',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        gap: 16,
        flexShrink: 0,
      }}
    >
      {/* Left: title / back */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 160 }}>
        {activeTool && (
          <button
            data-testid="back-to-chat-btn"
            onClick={onBackToChat}
            style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, padding: '4px 0' }}
          >
            <ChevronLeft size={14} />
            Chat
          </button>
        )}
        <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: 15, color: '#fff' }}>
          {title}
        </span>
      </div>

      {/* Center: search */}
      <div style={{ flex: 1, maxWidth: 400, position: 'relative' }}>
        <Search size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748B', pointerEvents: 'none' }} />
        <input
          data-testid="header-search"
          type="text"
          placeholder="Search tools, people, or anything..."
          value={searchVal}
          onChange={e => setSearchVal(e.target.value)}
          style={{
            width: '100%',
            background: '#161622',
            border: '1px solid #222230',
            borderRadius: 20,
            padding: '7px 12px 7px 32px',
            color: '#E2E8F0',
            fontSize: 12,
            outline: 'none',
          }}
        />
      </div>

      {/* Right: notifications + role switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 160, justifyContent: 'flex-end' }}>
        <button
          data-testid="notifications-btn"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', padding: 6, position: 'relative' }}
        >
          <Bell size={16} />
          <span style={{ position: 'absolute', top: 4, right: 4, width: 6, height: 6, background: '#EF4444', borderRadius: '50%', border: '1px solid #0A0A0F' }} />
        </button>

        {/* Role switcher */}
        <div style={{ position: 'relative' }}>
          <button
            data-testid="role-switcher-btn"
            onClick={() => setShowRoleMenu(v => !v)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: '#161622',
              border: '1px solid #222230',
              borderRadius: 20,
              padding: '5px 10px 5px 6px',
              cursor: 'pointer',
              color: '#fff',
              fontSize: 12,
            }}
          >
            <div style={{
              width: 22, height: 22, borderRadius: '50%',
              background: ROLE_COLORS[currentUser.role],
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 9, fontWeight: 700, color: '#fff',
            }}>
              {currentUser.initials}
            </div>
            <span style={{ fontWeight: 500 }}>
              <span style={{ color: ROLE_COLORS[currentUser.role], fontSize: 10, marginRight: 4 }}>{ROLE_LABELS[currentUser.role]}</span>
              — {currentUser.name}
            </span>
            <ChevronDown size={11} color="#64748B" />
          </button>

          {showRoleMenu && (
            <div
              data-testid="role-menu"
              style={{
                position: 'absolute',
                top: '110%',
                right: 0,
                background: '#1C1C28',
                border: '1px solid #222230',
                borderRadius: 10,
                padding: 6,
                minWidth: 160,
                zIndex: 100,
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              }}
            >
              <div style={{ fontSize: 10, color: '#64748B', padding: '4px 8px 8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Switch Role (Dev)</div>
              {Object.entries(MOCK_USERS).map(([role, user]) => (
                <button
                  key={role}
                  data-testid={`switch-role-${role}`}
                  onClick={() => { switchRole(role); setShowRoleMenu(false); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    width: '100%',
                    padding: '7px 10px',
                    background: currentUser.role === role ? 'rgba(255,255,255,0.06)' : 'transparent',
                    border: 'none',
                    borderRadius: 7,
                    cursor: 'pointer',
                    color: currentUser.role === role ? '#fff' : '#94A3B8',
                    fontSize: 12,
                    textAlign: 'left',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => { if (currentUser.role !== role) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                  onMouseLeave={e => { if (currentUser.role !== role) e.currentTarget.style.background = 'transparent'; }}
                >
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: ROLE_COLORS[role], flexShrink: 0 }} />
                  <span style={{ fontWeight: 500 }}>{ROLE_LABELS[role]}</span>
                  <span style={{ color: '#64748B', marginLeft: 'auto', fontSize: 11 }}>{user.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
