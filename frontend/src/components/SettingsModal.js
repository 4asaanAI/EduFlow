import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';
import { X, Sun, Moon, Globe, Bell, Lock } from 'lucide-react';

export default function SettingsModal({ onClose }) {
  const { isDark, toggleTheme, theme } = useTheme();
  const { currentUser } = useUser();
  const [lang, setLang] = useState('en');

  const bg = isDark ? '#161622' : '#fff';
  const border = isDark ? '#222230' : '#E2E8F0';
  const text = isDark ? '#E2E8F0' : '#0F172A';
  const muted = isDark ? '#64748B' : '#94A3B8';
  const sectionBg = isDark ? '#0F0F1A' : '#F8F9FC';

  const Section = ({ title, children }) => (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>{title}</div>
      <div style={{ background: sectionBg, borderRadius: 10, border: `1px solid ${border}`, overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  );

  const Row = ({ icon: Icon, label, subtitle, control }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderBottom: `1px solid ${border}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {Icon && <Icon size={14} color={muted} />}
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, color: text }}>{label}</div>
          {subtitle && <div style={{ fontSize: 11, color: muted, marginTop: 1 }}>{subtitle}</div>}
        </div>
      </div>
      {control}
    </div>
  );

  const Toggle = ({ active, onToggle }) => (
    <button onClick={onToggle} style={{ width: 40, height: 22, borderRadius: 11, background: active ? '#3B82F6' : (isDark ? '#222230' : '#CBD5E1'), border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}>
      <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: active ? 21 : 3, transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
    </button>
  );

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300 }}>
      <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 16, padding: 28, width: 420, maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 18, fontWeight: 700, color: text }}>Settings</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: muted, cursor: 'pointer' }}><X size={18} /></button>
        </div>

        <Section title="Appearance">
          <Row icon={isDark ? Moon : Sun} label="Theme" subtitle={`Currently: ${theme === 'dark' ? 'Dark mode' : 'Light mode'}`}
            control={<Toggle active={isDark} onToggle={toggleTheme} />}
          />
        </Section>

        <Section title="Language">
          <Row icon={Globe} label="Interface Language" subtitle="AI responds in the language you type"
            control={
              <select value={lang} onChange={e => setLang(e.target.value)} style={{ background: isDark ? '#222230' : '#F1F5F9', border: `1px solid ${border}`, borderRadius: 6, padding: '4px 8px', color: text, fontSize: 12, outline: 'none' }}>
                <option value="en">English</option>
                <option value="hi">Hindi (हिन्दी)</option>
              </select>
            }
          />
          <div style={{ padding: '10px 14px', borderBottom: `1px solid ${border}` }}>
            <p style={{ fontSize: 11, color: muted }}>
              The AI automatically detects the language you type in and responds accordingly. If you type in Hindi (using any keyboard), the AI responds in Hindi. No manual switch needed during chat.
            </p>
          </div>
        </Section>

        <Section title="Notifications">
          <Row icon={Bell} label="Push Notifications" subtitle="School alerts & reminders"
            control={<Toggle active={true} onToggle={() => {}} />}
          />
          <Row label="Leave approvals" subtitle="Notify when leave is approved/rejected"
            control={<Toggle active={true} onToggle={() => {}} />}
          />
          <Row label="Fee reminders" subtitle="Alert when fee payment is due"
            control={<Toggle active={true} onToggle={() => {}} />}
          />
        </Section>

        <Section title="Privacy & Security">
          <Row icon={Lock} label="Data Privacy" subtitle="DPDP Act compliant data handling"
            control={<span style={{ fontSize: 11, color: '#10B981' }}>Active</span>}
          />
          <Row label="Session timeout" subtitle="Auto-logout after inactivity"
            control={<select style={{ background: isDark ? '#222230' : '#F1F5F9', border: `1px solid ${border}`, borderRadius: 6, padding: '4px 8px', color: text, fontSize: 12, outline: 'none' }}><option>30 min</option><option>1 hour</option><option>2 hours</option></select>}
          />
        </Section>

        <Section title="About">
          <Row label="EduFlow Version" control={<span style={{ fontSize: 11, color: muted }}>v1.0.0</span>} />
          <Row label="School" control={<span style={{ fontSize: 11, color: muted }}>The Aaryans, CBSE</span>} />
          <Row label="Academic Year" control={<span style={{ fontSize: 11, color: muted }}>2025-26</span>} />
        </Section>
      </div>
    </div>
  );
}
