import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';
import { getConversations, updateConversation, deleteConversation } from '../lib/api';
import { Activity, IndianRupee, Users, BarChart2, Bell, FileText, HeartPulse, Megaphone, CalendarDays, UserPlus, MessageSquare, Pin, Star, Trash2, Plus, BookOpen, ClipboardList, GraduationCap, Brain, PenTool, BarChart, UserCheck, Award, Building2, Truck, Eye, Package, Printer, Clipboard, FilePlus, HelpCircle, Target, Compass, FileCheck, MoreHorizontal, Edit2, X, ChevronRight } from 'lucide-react';

const TOOLS_BY_ROLE = {
  owner: [
    { id: 'school-pulse', name: 'School pulse', subtitle: "Today's overview", icon: Activity, color: '#F97316' },
    { id: 'fee-collection', name: 'Fee collection', subtitle: 'Revenue & defaulters', icon: IndianRupee, color: '#3B82F6' },
    { id: 'student-strength', name: 'Student strength', subtitle: 'Class-wise overview', icon: Users, color: '#10B981' },
    { id: 'attendance-overview', name: 'Attendance overview', subtitle: 'Trends & patterns', icon: ClipboardList, color: '#8B5CF6' },
    { id: 'staff-attendance-tracker', name: 'Staff tracker', subtitle: 'Attendance & leaves', icon: UserCheck, color: '#06B6D4' },
    { id: 'financial-reports', name: 'Financial reports', subtitle: 'Revenue & expenses', icon: FileText, color: '#06B6D4' },
    { id: 'announcement-broadcaster', name: 'Announcements', subtitle: 'Broadcast messages', icon: Megaphone, color: '#EAB308' },
    { id: 'admission-funnel', name: 'Admission funnel', subtitle: 'Enquiries & conversions', icon: UserPlus, color: '#3B82F6' },
    { id: 'staff-leave-manager', name: 'Leave manager', subtitle: 'Approve / reject', icon: CalendarDays, color: '#10B981' },
    { id: 'staff-performance', name: 'Staff performance', subtitle: 'Overview & analytics', icon: BarChart2, color: '#F97316' },
    { id: 'ai-health-report', name: 'AI health report', subtitle: 'Weekly auto-summary', icon: HeartPulse, color: '#EC4899' },
    { id: 'smart-alerts', name: 'Smart alerts', subtitle: 'Exceptions & flags', icon: Bell, color: '#EF4444' },
    { id: 'expense-tracker', name: 'Expense tracker', subtitle: 'Track & approve', icon: IndianRupee, color: '#F59E0B' },
    { id: 'complaint-tracker', name: 'Complaints', subtitle: 'Grievance tracker', icon: HelpCircle, color: '#8B5CF6' },
    { id: 'custom-report-builder', name: 'Custom reports', subtitle: 'Build any report', icon: FilePlus, color: '#64748B' },
    { id: 'board-report', name: 'Board report', subtitle: 'Trust meeting data', icon: Clipboard, color: '#64748B' },
  ],
  admin: [
    { id: 'student-database', name: 'Student database', subtitle: 'Manage & search', icon: Users, color: '#3B82F6' },
    { id: 'fee-tracker', name: 'Fee tracker', subtitle: 'Reminders & dues', icon: IndianRupee, color: '#10B981' },
    { id: 'attendance-recorder', name: 'Attendance', subtitle: 'Mark & track', icon: ClipboardList, color: '#F97316' },
    { id: 'certificate-generator', name: 'Certificates', subtitle: 'TC, Bonafide, etc.', icon: Award, color: '#EAB308' },
    { id: 'circular-sender', name: 'Circulars', subtitle: 'Notices & messages', icon: Megaphone, color: '#06B6D4' },
    { id: 'enquiry-register', name: 'Enquiry register', subtitle: 'Admission leads', icon: UserPlus, color: '#8B5CF6' },
    { id: 'document-scanner', name: 'Doc scanner', subtitle: 'Extract & file', icon: FileCheck, color: '#64748B' },
    { id: 'smart-fee-defaulter', name: 'Fee defaulters', subtitle: 'Smart reminders', icon: Bell, color: '#EF4444' },
    { id: 'admission-pipeline', name: 'Admission pipeline', subtitle: 'Track conversions', icon: Target, color: '#3B82F6' },
    { id: 'parent-message', name: 'Parent messages', subtitle: 'Compose & send', icon: MessageSquare, color: '#10B981' },
    { id: 'student-transfer', name: 'Student transfer', subtitle: 'Withdrawal & TC', icon: UserPlus, color: '#F97316' },
    { id: 'id-card-generator', name: 'ID cards', subtitle: 'Generate & print', icon: Printer, color: '#8B5CF6' },
    { id: 'timetable-builder', name: 'Timetable', subtitle: 'Build & manage', icon: CalendarDays, color: '#EC4899' },
    { id: 'asset-tracker', name: 'Asset tracker', subtitle: 'Inventory & items', icon: Package, color: '#06B6D4' },
    { id: 'visitor-log', name: 'Visitor log', subtitle: 'Entry & exit', icon: Eye, color: '#EAB308' },
    { id: 'transport-manager', name: 'Transport', subtitle: 'Routes & buses', icon: Truck, color: '#F97316' },
    { id: 'automated-report', name: 'Auto reports', subtitle: 'Scheduled reports', icon: FileText, color: '#64748B' },
    { id: 'custom-form-builder', name: 'Form builder', subtitle: 'Dynamic forms', icon: FilePlus, color: '#64748B' },
    { id: 'payroll-preparer', name: 'Payroll', subtitle: 'Staff salary data', icon: IndianRupee, color: '#64748B' },
  ],
  teacher: [
    { id: 'class-attendance-marker', name: 'Attendance', subtitle: 'Mark my class', icon: ClipboardList, color: '#F97316' },
    { id: 'assignment-generator', name: 'Assignments', subtitle: 'Create & manage', icon: BookOpen, color: '#3B82F6' },
    { id: 'question-paper-creator', name: 'Question papers', subtitle: 'Create & export', icon: PenTool, color: '#10B981' },
    { id: 'report-card-builder', name: 'Report cards', subtitle: 'Enter & generate', icon: FileText, color: '#8B5CF6' },
    { id: 'student-performance-viewer', name: 'Student performance', subtitle: 'Marks & trends', icon: BarChart2, color: '#06B6D4' },
    { id: 'leave-application', name: 'Leave application', subtitle: 'Apply for leave', icon: CalendarDays, color: '#EAB308' },
    { id: 'lesson-plan-generator', name: 'Lesson plans', subtitle: 'Plan chapters', icon: BookOpen, color: '#EC4899' },
    { id: 'worksheet-creator', name: 'Worksheets', subtitle: 'Practice sheets', icon: FilePlus, color: '#F97316' },
    { id: 'class-performance-analytics', name: 'Class analytics', subtitle: 'Trends & insights', icon: BarChart, color: '#8B5CF6' },
    { id: 'substitution-viewer', name: 'Substitutions', subtitle: 'My schedule changes', icon: CalendarDays, color: '#64748B' },
    { id: 'ptm-notes', name: 'PTM notes', subtitle: 'Parent meet notes', icon: MessageSquare, color: '#10B981' },
    { id: 'curriculum-tracker', name: 'Curriculum', subtitle: 'Progress tracking', icon: Target, color: '#3B82F6' },
  ],
  student: [
    { id: 'ai-tutor', name: 'AI tutor', subtitle: 'Study help', icon: Brain, color: '#8B5CF6' },
    { id: 'doubt-solver', name: 'Doubt solver', subtitle: 'Ask any doubt', icon: HelpCircle, color: '#3B82F6' },
    { id: 'homework-viewer', name: 'Homework', subtitle: 'My assignments', icon: BookOpen, color: '#F97316' },
    { id: 'attendance-self-check', name: 'My attendance', subtitle: 'View records', icon: ClipboardList, color: '#10B981' },
    { id: 'result-viewer', name: 'My results', subtitle: 'Exam marks', icon: BarChart2, color: '#EC4899' },
    { id: 'practice-test', name: 'Practice tests', subtitle: 'Self-assessment', icon: PenTool, color: '#EAB308' },
    { id: 'study-planner', name: 'Study planner', subtitle: 'Plan your week', icon: Target, color: '#06B6D4' },
    { id: 'career-guidance', name: 'Career guidance', subtitle: 'Future planning', icon: Compass, color: '#8B5CF6' },
    { id: 'fee-status-viewer', name: 'My fees', subtitle: 'Payment status', icon: IndianRupee, color: '#3B82F6' },
    { id: 'ptm-summary-viewer', name: 'PTM summary', subtitle: 'Teacher notes', icon: MessageSquare, color: '#10B981' },
  ],
};

function timeAgo(iso) {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function ConvMenu({ conv, onClose, onRename, onPin, onStar, onDelete }) {
  const ref = useRef(null);
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  return (
    <div ref={ref} style={{
      position: 'absolute', top: '100%', left: 0, right: 0,
      background: '#1C1C28', border: '1px solid #222230', borderRadius: 8,
      padding: 4, zIndex: 200, boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
    }}>
      {[
        { label: 'Rename', icon: Edit2, action: onRename },
        { label: conv.is_pinned ? 'Unpin' : 'Pin', icon: Pin, action: onPin },
        { label: conv.is_starred ? 'Unstar' : 'Star', icon: Star, action: onStar },
        { label: 'Delete', icon: Trash2, action: onDelete, danger: true },
      ].map(item => (
        <button key={item.label} onClick={() => { item.action(); onClose(); }}
          style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '7px 10px', background: 'transparent', border: 'none', borderRadius: 6, cursor: 'pointer', color: item.danger ? '#EF4444' : '#94A3B8', fontSize: 12, textAlign: 'left' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <item.icon size={12} />
          {item.label}
        </button>
      ))}
    </div>
  );
}

export default function Sidebar({ onSelectTool, onSelectConv, onNewChat, activeTool, activeConvId, convRefresh, sidebarOpen, setSidebarOpen }) {
  const { currentUser } = useUser();
  const { isDark } = useTheme();
  const [conversations, setConversations] = useState([]);
  const [menuConvId, setMenuConvId] = useState(null);
  const [renamingId, setRenamingId] = useState(null);
  const [renameVal, setRenameVal] = useState('');

  const tools = TOOLS_BY_ROLE[currentUser.role] || [];

  useEffect(() => { loadConversations(); }, [currentUser.id, convRefresh]);

  const loadConversations = async () => {
    try {
      const res = await getConversations(currentUser);
      if (res.success) setConversations(res.data || []);
    } catch {}
  };

  const handleRename = async (conv) => {
    setRenamingId(conv.id);
    setRenameVal(conv.title || '');
  };

  const commitRename = async (convId) => {
    if (!renameVal.trim()) return;
    await updateConversation(convId, { title: renameVal.trim() }, currentUser);
    setRenamingId(null);
    loadConversations();
  };

  const handlePin = async (conv) => {
    await updateConversation(conv.id, { is_pinned: !conv.is_pinned }, currentUser);
    loadConversations();
  };

  const handleStar = async (conv) => {
    await updateConversation(conv.id, { is_starred: !conv.is_starred }, currentUser);
    loadConversations();
  };

  const handleDelete = async (convId) => {
    await deleteConversation(convId, currentUser);
    loadConversations();
  };

  const bg = isDark ? '#12121A' : '#FFFFFF';
  const border = isDark ? '#222230' : '#E2E8F0';
  const textPrimary = isDark ? '#fff' : '#0F172A';
  const textMuted = isDark ? '#64748B' : '#94A3B8';
  const toolHover = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)';
  const activeToolBg = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(59,130,246,0.08)';

  return (
    <>
      {/* Mobile sidebar */}
      <style>{`
        @media (max-width: 768px) {
          .sidebar-wrapper { transform: ${sidebarOpen ? 'translateX(0)' : 'translateX(-100%)'}; transition: transform 0.25s ease; position: fixed; z-index: 50; height: 100vh; }
          .mobile-overlay { display: block !important; }
        }
        @media (min-width: 769px) {
          .sidebar-wrapper { transform: translateX(0) !important; position: relative !important; }
        }
      `}</style>
      <aside
        className="sidebar-wrapper"
        data-testid="sidebar"
        style={{
          width: 120, minWidth: 120,
          background: bg,
          borderRight: `1px solid ${border}`,
          display: 'flex', flexDirection: 'column',
          height: '100vh', overflow: 'hidden', flexShrink: 0,
        }}
      >
        {/* Logo + close button (mobile) */}
        <div style={{ padding: '14px 8px 10px', borderBottom: `1px solid ${border}`, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 15, color: textPrimary }}>EduFlow</span>
          <button onClick={() => setSidebarOpen(false)} className="mobile-close" style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', color: textMuted, padding: 2 }}>
            <X size={14} />
          </button>
        </div>

        {/* Tools */}
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          <div style={{ padding: '8px 6px 2px', fontSize: 9, fontWeight: 700, color: textMuted, letterSpacing: '0.08em', textTransform: 'uppercase', textAlign: 'center' }}>
            TOOLS
          </div>
          {tools.map((tool) => {
            const Icon = tool.icon;
            const isActive = activeTool === tool.id;
            return (
              <button
                key={tool.id}
                data-testid={`tool-btn-${tool.id}`}
                onClick={() => onSelectTool(tool.id)}
                title={tool.name}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  width: '100%', padding: '7px 5px',
                  background: isActive ? activeToolBg : 'transparent',
                  border: 'none', borderLeft: isActive ? `2px solid ${tool.color}` : '2px solid transparent',
                  borderRadius: '0 8px 8px 0', cursor: 'pointer',
                  transition: 'all 0.15s', gap: 3, marginBottom: 0,
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = toolHover; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: `${tool.color}18`, border: `1px solid ${tool.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={15} color={tool.color} />
                </div>
                <span style={{ fontSize: 9.5, fontWeight: 600, color: isActive ? textPrimary : (isDark ? '#CBD5E1' : '#64748B'), lineHeight: 1.2, textAlign: 'center', maxWidth: 104 }}>
                  {tool.name}
                </span>
                <span style={{ fontSize: 8, color: textMuted, lineHeight: 1.1, textAlign: 'center' }}>{tool.subtitle}</span>
              </button>
            );
          })}

          {/* Chat history */}
          {conversations.length > 0 && (
            <>
              <div style={{ padding: '10px 6px 2px', fontSize: 9, fontWeight: 700, color: textMuted, letterSpacing: '0.08em', textTransform: 'uppercase', textAlign: 'center', borderTop: `1px solid ${border}`, marginTop: 6 }}>
                CHAT HISTORY
              </div>
              {conversations.slice(0, 10).map(conv => (
                <div key={conv.id} style={{ position: 'relative' }}>
                  {renamingId === conv.id ? (
                    <div style={{ padding: '4px 6px' }}>
                      <input
                        autoFocus
                        value={renameVal}
                        onChange={e => setRenameVal(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') commitRename(conv.id); if (e.key === 'Escape') setRenamingId(null); }}
                        onBlur={() => commitRename(conv.id)}
                        style={{ width: '100%', background: '#161622', border: '1px solid #3B82F6', borderRadius: 5, padding: '4px 6px', color: '#E2E8F0', fontSize: 10, outline: 'none' }}
                      />
                    </div>
                  ) : (
                    <button
                      data-testid={`conv-btn-${conv.id}`}
                      onClick={() => onSelectConv(conv.id)}
                      onContextMenu={e => { e.preventDefault(); setMenuConvId(conv.id); }}
                      style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                        width: '100%', padding: '5px 7px',
                        background: activeConvId === conv.id ? (isDark ? 'rgba(59,130,246,0.12)' : 'rgba(59,130,246,0.08)') : 'transparent',
                        border: 'none', borderLeft: activeConvId === conv.id ? '2px solid #3B82F6' : '2px solid transparent',
                        cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left', gap: 2,
                      }}
                      onMouseEnter={e => { if (activeConvId !== conv.id) e.currentTarget.style.background = toolHover; }}
                      onMouseLeave={e => { if (activeConvId !== conv.id) e.currentTarget.style.background = 'transparent'; }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 3, width: '100%' }}>
                        {conv.is_pinned && <Pin size={7} color="#F59E0B" />}
                        {conv.is_starred && <Star size={7} color="#EAB308" />}
                        <span style={{ fontSize: 9.5, fontWeight: 500, color: activeConvId === conv.id ? '#93C5FD' : (isDark ? '#94A3B8' : '#475569'), overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                          {conv.title || 'New conversation'}
                        </span>
                      </div>
                      <span style={{ fontSize: 7.5, color: textMuted }}>{timeAgo(conv.updated_at)}</span>
                    </button>
                  )}
                  {menuConvId === conv.id && (
                    <ConvMenu
                      conv={conv}
                      onClose={() => setMenuConvId(null)}
                      onRename={() => handleRename(conv)}
                      onPin={() => handlePin(conv)}
                      onStar={() => handleStar(conv)}
                      onDelete={() => handleDelete(conv.id)}
                    />
                  )}
                </div>
              ))}
            </>
          )}
        </div>

        {/* New Chat */}
        <div style={{ padding: '8px', borderTop: `1px solid ${border}` }}>
          <button
            data-testid="new-chat-btn"
            onClick={onNewChat}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '8px 6px', background: '#3B82F6', border: 'none', borderRadius: 8, color: '#fff', fontSize: 10, fontWeight: 700, cursor: 'pointer', transition: 'background 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#2563EB'}
            onMouseLeave={e => e.currentTarget.style.background = '#3B82F6'}
          >
            <Plus size={11} /> New Chat
          </button>
        </div>
      </aside>
    </>
  );
}
