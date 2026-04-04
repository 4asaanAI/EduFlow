import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { getConversations } from '../lib/api';
import {
  Activity, IndianRupee, Users, BarChart2, Bell, FileText,
  HeartPulse, Megaphone, CalendarDays, UserPlus, MessageSquare,
  Pin, Star, Trash2, Plus, BookOpen, ClipboardList, ChevronRight,
} from 'lucide-react';

const TOOLS_BY_ROLE = {
  owner: [
    { id: 'school-pulse', name: 'School pulse', subtitle: "Today's overview", icon: Activity, color: '#F97316' },
    { id: 'fee-collection', name: 'Fee collection', subtitle: 'Revenue & defaulters', icon: IndianRupee, color: '#3B82F6' },
    { id: 'staff-tracker', name: 'Staff tracker', subtitle: 'Attendance & leaves', icon: Users, color: '#10B981' },
    { id: 'smart-analytics', name: 'Smart analytics', subtitle: 'Trends & insights', icon: BarChart2, color: '#8B5CF6' },
    { id: 'smart-alerts', name: 'Smart alerts', subtitle: 'Exceptions & flags', icon: Bell, color: '#EF4444' },
    { id: 'financial-reports', name: 'Financial reports', subtitle: 'Revenue & expenses', icon: FileText, color: '#06B6D4' },
    { id: 'ai-health-report', name: 'AI health report', subtitle: 'Weekly auto-summary', icon: HeartPulse, color: '#EC4899' },
    { id: 'announcements', name: 'Announcements', subtitle: 'Broadcast messages', icon: Megaphone, color: '#EAB308' },
    { id: 'leave-manager', name: 'Leave manager', subtitle: 'Approve / reject', icon: CalendarDays, color: '#10B981' },
    { id: 'admission-funnel', name: 'Admission funnel', subtitle: 'Enquiries & conversions', icon: UserPlus, color: '#3B82F6' },
  ],
  admin: [
    { id: 'student-database', name: 'Student database', subtitle: 'Manage & search', icon: Users, color: '#3B82F6' },
    { id: 'fee-collection', name: 'Fee collection', subtitle: 'Revenue & defaulters', icon: IndianRupee, color: '#10B981' },
    { id: 'attendance-recorder', name: 'Attendance', subtitle: 'Mark & track', icon: ClipboardList, color: '#F97316' },
    { id: 'staff-tracker', name: 'Staff tracker', subtitle: 'Attendance & leaves', icon: Users, color: '#8B5CF6' },
    { id: 'announcements', name: 'Announcements', subtitle: 'Broadcast messages', icon: Megaphone, color: '#EAB308' },
    { id: 'leave-manager', name: 'Leave manager', subtitle: 'Approve / reject', icon: CalendarDays, color: '#EC4899' },
    { id: 'admission-funnel', name: 'Admission funnel', subtitle: 'Enquiries & conversions', icon: UserPlus, color: '#06B6D4' },
  ],
  teacher: [
    { id: 'attendance-recorder', name: 'Attendance', subtitle: 'Mark my class', icon: ClipboardList, color: '#F97316' },
    { id: 'student-database', name: 'My students', subtitle: 'Class roster', icon: Users, color: '#3B82F6' },
    { id: 'announcements', name: 'Announcements', subtitle: 'School notices', icon: Megaphone, color: '#EAB308' },
    { id: 'assignments', name: 'Assignments', subtitle: 'Create & manage', icon: BookOpen, color: '#10B981' },
  ],
  student: [
    { id: 'my-attendance', name: 'My attendance', subtitle: 'Attendance record', icon: ClipboardList, color: '#F97316' },
    { id: 'my-results', name: 'My results', subtitle: 'Exam marks', icon: BarChart2, color: '#8B5CF6' },
    { id: 'my-fees', name: 'My fees', subtitle: 'Payment status', icon: IndianRupee, color: '#3B82F6' },
    { id: 'announcements', name: 'Announcements', subtitle: 'School notices', icon: Megaphone, color: '#EAB308' },
  ],
};

const IMPLEMENTED_TOOLS = new Set([
  'school-pulse', 'fee-collection', 'staff-tracker',
  'student-database', 'attendance-recorder',
]);

function timeAgo(isoString) {
  if (!isoString) return '';
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function Sidebar({ onSelectTool, onSelectConv, onNewChat, activeTool, activeConvId, convRefresh }) {
  const { currentUser } = useUser();
  const [conversations, setConversations] = useState([]);
  const tools = TOOLS_BY_ROLE[currentUser.role] || [];

  useEffect(() => {
    loadConversations();
  }, [currentUser.id, convRefresh]);

  const loadConversations = async () => {
    try {
      const res = await getConversations(currentUser);
      if (res.success) setConversations(res.data || []);
    } catch {}
  };

  return (
    <aside
      data-testid="sidebar"
      style={{
        width: 120,
        minWidth: 120,
        background: '#12121A',
        borderRight: '1px solid #222230',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div style={{ padding: '16px 8px 12px', borderBottom: '1px solid #1A1A24', textAlign: 'center' }}>
        <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 15, color: '#fff', letterSpacing: '-0.3px' }}>
          EduFlow
        </div>
      </div>

      {/* Tools section */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        <div style={{ padding: '10px 6px 4px', fontSize: 9, fontWeight: 600, color: '#64748B', letterSpacing: '0.08em', textTransform: 'uppercase', textAlign: 'center' }}>
          TOOLS
        </div>

        {tools.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;
          const isImplemented = IMPLEMENTED_TOOLS.has(tool.id);

          return (
            <button
              key={tool.id}
              data-testid={`tool-btn-${tool.id}`}
              onClick={() => isImplemented ? onSelectTool(tool.id) : null}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                padding: '8px 6px',
                background: isActive ? 'rgba(255,255,255,0.07)' : 'transparent',
                border: 'none',
                borderRadius: 10,
                cursor: isImplemented ? 'pointer' : 'default',
                transition: 'background 0.15s',
                opacity: isImplemented ? 1 : 0.5,
                gap: 4,
                marginBottom: 1,
              }}
              onMouseEnter={e => { if (isImplemented && !isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
              title={!isImplemented ? 'Coming soon' : tool.name}
            >
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: `${tool.color}18`,
                border: `1px solid ${tool.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon size={16} color={tool.color} />
              </div>
              <span style={{ fontSize: 10, fontWeight: 600, color: isActive ? '#fff' : '#CBD5E1', lineHeight: 1.2, textAlign: 'center', maxWidth: 100 }}>
                {tool.name}
              </span>
              <span style={{ fontSize: 8.5, color: '#64748B', lineHeight: 1.2, textAlign: 'center' }}>
                {tool.subtitle}
              </span>
            </button>
          );
        })}

        {/* Chat history */}
        {conversations.length > 0 && (
          <>
            <div style={{ padding: '12px 6px 4px', fontSize: 9, fontWeight: 600, color: '#64748B', letterSpacing: '0.08em', textTransform: 'uppercase', textAlign: 'center', borderTop: '1px solid #1A1A24', marginTop: 6 }}>
              CHAT HISTORY
            </div>
            {conversations.slice(0, 8).map(conv => (
              <button
                key={conv.id}
                data-testid={`conv-btn-${conv.id}`}
                onClick={() => onSelectConv(conv.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  width: '100%',
                  padding: '6px 8px',
                  background: activeConvId === conv.id ? 'rgba(59,130,246,0.12)' : 'transparent',
                  border: 'none',
                  borderLeft: activeConvId === conv.id ? '2px solid #3B82F6' : '2px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  gap: 2,
                  textAlign: 'left',
                }}
                onMouseEnter={e => { if (activeConvId !== conv.id) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                onMouseLeave={e => { if (activeConvId !== conv.id) e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, width: '100%' }}>
                  {conv.is_pinned && <Pin size={8} color="#F59E0B" />}
                  {conv.is_starred && <Star size={8} color="#EAB308" />}
                  <span style={{ fontSize: 9.5, fontWeight: 500, color: activeConvId === conv.id ? '#93C5FD' : '#94A3B8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                    {conv.title || 'New conversation'}
                  </span>
                </div>
                <span style={{ fontSize: 8, color: '#475569' }}>{timeAgo(conv.updated_at)}</span>
              </button>
            ))}
          </>
        )}
      </div>

      {/* New Chat button */}
      <div style={{ padding: '10px 8px', borderTop: '1px solid #1A1A24' }}>
        <button
          data-testid="new-chat-btn"
          onClick={onNewChat}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            padding: '8px 6px',
            background: '#3B82F6',
            border: 'none',
            borderRadius: 8,
            color: '#fff',
            fontSize: 10,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#2563EB'}
          onMouseLeave={e => e.currentTarget.style.background = '#3B82F6'}
        >
          <Plus size={12} />
          New Chat
        </button>
      </div>
    </aside>
  );
}
