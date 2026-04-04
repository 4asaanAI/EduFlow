import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';
import { Search, Bell, ChevronDown, ChevronLeft, Sun, Moon, User, Settings, Menu } from 'lucide-react';

const ROLE_COLORS = { owner: '#F97316', admin: '#3B82F6', teacher: '#10B981', student: '#8B5CF6' };
const ROLE_LABELS = { owner: 'Owner', admin: 'Admin', teacher: 'Teacher', student: 'Student' };

export default function Header({ activeTool, onBackToChat, onOpenProfile, onOpenSettings, onToggleSidebar }) {
  const { currentUser, switchRole, MOCK_USERS } = useUser();
  const { theme, toggleTheme, isDark } = useTheme();
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const title = activeTool
    ? activeTool.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')
    : 'EduFlow AI';

  const bg = isDark ? '#0A0A0F' : '#FFFFFF';
  const border = isDark ? '#222230' : '#E2E8F0';
  const textPrimary = isDark ? '#fff' : '#0F172A';
  const textMuted = isDark ? '#64748B' : '#94A3B8';
  const cardBg = isDark ? '#161622' : '#F8F9FC';
  const cardBorder = isDark ? '#222230' : '#E2E8F0';

  return (
    <header data-testid="main-header" style={{ height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', borderBottom: `1px solid ${border}`, background: bg, position: 'sticky', top: 0, zIndex: 50, gap: 12, flexShrink: 0 }}>
      {/* Left */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
        <button onClick={onToggleSidebar} style={{ background: 'none', border: 'none', color: textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 4 }} className="mobile-menu-btn">
          <Menu size={16} />
        </button>
        {activeTool && (
          <button data-testid="back-to-chat-btn" onClick={onBackToChat} style={{ background: 'none', border: 'none', color: textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, padding: '3px 0' }}>
            <ChevronLeft size={13} />Chat
          </button>
        )}
        <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: 14, color: textPrimary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {title}
        </span>
      </div>

      {/* Center: search */}
      <div style={{ flex: 1, maxWidth: 380, position: 'relative' }}>
        <Search size={12} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: textMuted, pointerEvents: 'none' }} />
        <input
          data-testid="header-search"
          type="text"
          placeholder="Search tools, people, or anything..."
          style={{ width: '100%', background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 20, padding: '6px 10px 6px 28px', color: textPrimary, fontSize: 11, outline: 'none' }}
        />
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        {/* Theme toggle */}
        <button data-testid="theme-toggle" onClick={toggleTheme} style={{ background: 'none', border: 'none', cursor: 'pointer', color: textMuted, padding: 5, display: 'flex', alignItems: 'center' }}>
          {isDark ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* Notifications */}
        <button data-testid="notifications-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', color: textMuted, padding: 5, position: 'relative' }}>
          <Bell size={15} />
          <span style={{ position: 'absolute', top: 3, right: 3, width: 5, height: 5, background: '#EF4444', borderRadius: '50%' }} />
        </button>

        {/* Profile */}
        <button data-testid="profile-btn" onClick={onOpenProfile} style={{ background: 'none', border: 'none', cursor: 'pointer', color: textMuted, padding: 5 }}>
          <User size={15} />
        </button>

        {/* Settings */}
        <button data-testid="settings-btn" onClick={onOpenSettings} style={{ background: 'none', border: 'none', cursor: 'pointer', color: textMuted, padding: 5 }}>
          <Settings size={15} />
        </button>

        {/* Role switcher */}
        <div style={{ position: 'relative' }}>
          <button
            data-testid="role-switcher-btn"
            onClick={() => setShowRoleMenu(v => !v)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 18, padding: '4px 8px 4px 5px', cursor: 'pointer', color: textPrimary, fontSize: 11 }}
          >
            <div style={{ width: 20, height: 20, borderRadius: '50%', background: ROLE_COLORS[currentUser.role], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700, color: '#fff' }}>
              {currentUser.initials}
            </div>
            <span style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: 3 }}>
              <span style={{ color: ROLE_COLORS[currentUser.role], fontSize: 9, fontWeight: 700 }}>{ROLE_LABELS[currentUser.role]}</span>
              <span style={{ color: textMuted }}>—</span>
              <span>{currentUser.name.split(' ')[0]}</span>
            </span>
            <ChevronDown size={10} color={textMuted} />
          </button>

          {showRoleMenu && (
            <div data-testid="role-menu" style={{ position: 'absolute', top: '110%', right: 0, background: isDark ? '#1C1C28' : '#fff', border: `1px solid ${cardBorder}`, borderRadius: 10, padding: 5, minWidth: 160, zIndex: 100, boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
              <div style={{ fontSize: 9, color: textMuted, padding: '3px 8px 6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Switch Role (Dev)</div>
              {Object.entries(MOCK_USERS).map(([role, user]) => (
                <button
                  key={role}
                  data-testid={`switch-role-${role}`}
                  onClick={() => { switchRole(role); setShowRoleMenu(false); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '6px 9px', background: currentUser.role === role ? (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)') : 'transparent', border: 'none', borderRadius: 7, cursor: 'pointer', color: textPrimary, fontSize: 11, textAlign: 'left', transition: 'background 0.1s' }}
                >
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: ROLE_COLORS[role], flexShrink: 0 }} />
                  <span style={{ fontWeight: 500 }}>{ROLE_LABELS[role]}</span>
                  <span style={{ color: textMuted, marginLeft: 'auto', fontSize: 10 }}>{user.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
