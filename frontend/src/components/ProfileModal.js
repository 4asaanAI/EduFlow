import React from 'react';
import { useUser } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';
import { X, User, Mail, Phone, Shield } from 'lucide-react';

const ROLE_COLORS = { owner: '#F97316', admin: '#3B82F6', teacher: '#10B981', student: '#8B5CF6' };
const ROLE_LABELS = { owner: 'Owner / Principal', admin: 'Admin Staff', teacher: 'Teacher', student: 'Student' };

export default function ProfileModal({ onClose }) {
  const { currentUser } = useUser();
  const { isDark } = useTheme();
  const bg = isDark ? '#161622' : '#fff';
  const border = isDark ? '#222230' : '#E2E8F0';
  const text = isDark ? '#E2E8F0' : '#0F172A';
  const muted = isDark ? '#64748B' : '#94A3B8';

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300 }}>
      <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 16, padding: 32, width: 380, boxShadow: '0 24px 64px rgba(0,0,0,0.4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 18, fontWeight: 700, color: text }}>Profile</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: muted, cursor: 'pointer' }}><X size={18} /></button>
        </div>

        {/* Avatar */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: ROLE_COLORS[currentUser.role], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700, color: '#fff', margin: '0 auto 12px', fontFamily: 'Outfit, sans-serif' }}>
            {currentUser.initials}
          </div>
          <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 20, fontWeight: 600, color: text, marginBottom: 4 }}>{currentUser.name}</h3>
          <span style={{ fontSize: 12, fontWeight: 600, color: ROLE_COLORS[currentUser.role], background: `${ROLE_COLORS[currentUser.role]}20`, padding: '3px 10px', borderRadius: 20 }}>
            {ROLE_LABELS[currentUser.role]}
          </span>
        </div>

        {/* Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { icon: User, label: 'User ID', value: currentUser.id },
            { icon: Shield, label: 'Role', value: currentUser.role },
            { icon: Mail, label: 'Email', value: `${currentUser.name.toLowerCase().replace(' ', '.')}@theararyans.edu.in` },
            { icon: Phone, label: 'School', value: 'The Aaryans, Lucknow' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: `1px solid ${border}` }}>
              <item.icon size={14} color={muted} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: muted, minWidth: 60 }}>{item.label}</span>
              <span style={{ fontSize: 12, color: text, fontWeight: 500 }}>{item.value}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 20, padding: '12px', background: isDark ? '#0F0F1A' : '#F8F9FC', borderRadius: 10, border: `1px solid ${border}` }}>
          <p style={{ fontSize: 11, color: muted, textAlign: 'center' }}>
            Authentication is disabled in development mode. Role switching available via header.
          </p>
        </div>
      </div>
    </div>
  );
}
