import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';
import Sidebar from './Sidebar';
import Header from './Header';
import ChatInterface from './ChatInterface';
import { createConversation } from '../lib/api';
import ProfileModal from './ProfileModal';
import SettingsModal from './SettingsModal';

// Dynamic tool component loader
const TOOL_MAP = {};
const loadTool = async (toolId) => {
  const OWNERS = ['school-pulse','fee-collection','student-strength','attendance-overview','staff-attendance-tracker','financial-reports','announcement-broadcaster','admission-funnel','staff-leave-manager','staff-performance','ai-health-report','smart-alerts','expense-tracker','complaint-tracker','custom-report-builder','board-report'];
  const ADMINS = ['student-database','fee-tracker','attendance-recorder','certificate-generator','circular-sender','enquiry-register','document-scanner','smart-fee-defaulter','admission-pipeline','parent-message','student-transfer','id-card-generator','timetable-builder','asset-tracker','visitor-log','transport-manager','automated-report','custom-form-builder','payroll-preparer'];
  const TEACHERS = ['class-attendance-marker','assignment-generator','question-paper-creator','report-card-builder','student-performance-viewer','leave-application','lesson-plan-generator','worksheet-creator','class-performance-analytics','substitution-viewer','ptm-notes','curriculum-tracker'];
  const STUDENTS = ['ai-tutor','doubt-solver','homework-viewer','attendance-self-check','result-viewer','practice-test','study-planner','career-guidance','fee-status-viewer','ptm-summary-viewer'];

  if (OWNERS.includes(toolId)) return (await import('./tools/OwnerTools'))[toolIdToComp(toolId)];
  if (ADMINS.includes(toolId)) return (await import('./tools/AdminTools'))[toolIdToComp(toolId)];
  if (TEACHERS.includes(toolId)) return (await import('./tools/TeacherTools'))[toolIdToComp(toolId)];
  if (STUDENTS.includes(toolId)) return (await import('./tools/StudentTools'))[toolIdToComp(toolId)];
  return null;
};

function toolIdToComp(id) {
  return id.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join('');
}

function ToolView({ toolId }) {
  const [Comp, setComp] = useState(null);
  useEffect(() => {
    loadTool(toolId).then(C => setComp(() => C || null));
  }, [toolId]);
  if (!Comp) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', flexDirection: 'column', gap: 12 }}>
      <div className="spinner" />
      <span>Loading tool...</span>
    </div>
  );
  return <Comp />;
}

export default function Layout() {
  const { currentUser } = useUser();
  const { isDark } = useTheme();
  const [activeTool, setActiveTool] = useState(null);
  const [activeConvId, setActiveConvId] = useState(null);
  const [convRefresh, setConvRefresh] = useState(0);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleNewChat = async () => {
    setActiveTool(null);
    const res = await createConversation(currentUser);
    if (res.success) {
      setActiveConvId(res.data.id);
      setConvRefresh(n => n + 1);
    }
  };

  const handleSelectTool = (toolId) => setActiveTool(toolId);
  const handleSelectConv = (convId) => { setActiveTool(null); setActiveConvId(convId); };
  const handleConvCreated = (convId) => { setActiveConvId(convId); setConvRefresh(n => n + 1); };

  // Listen for tool open events from Quick Actions
  useEffect(() => {
    const handler = (e) => { if (e.detail) { setActiveTool(e.detail); setActiveConvId(null); } };
    window.addEventListener('open-tool', handler);
    return () => window.removeEventListener('open-tool', handler);
  }, []);

  // Reset tool + conversation when user switches role
  useEffect(() => {
    setActiveTool(null);
    setActiveConvId(null);
  }, [currentUser.id]);

  const bg = isDark ? '#0A0A0F' : '#F8F9FC';

  return (
    <div style={{ display: 'flex', height: '100vh', background: bg, overflow: 'hidden' }}>
      {/* Mobile menu overlay */}
      {!sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(true)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 39, display: 'none' }}
          className="mobile-overlay"
        />
      )}

      <Sidebar
        onSelectTool={handleSelectTool}
        onSelectConv={handleSelectConv}
        onNewChat={handleNewChat}
        activeTool={activeTool}
        activeConvId={activeConvId}
        convRefresh={convRefresh}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <Header
          activeTool={activeTool}
          onBackToChat={() => setActiveTool(null)}
          onOpenProfile={() => setShowProfile(true)}
          onOpenSettings={() => setShowSettings(true)}
          onToggleSidebar={() => setSidebarOpen(v => !v)}
        />
        <div style={{ flex: 1, overflow: 'hidden' }}>
          {activeTool ? (
            <ToolView toolId={activeTool} />
          ) : (
            <ChatInterface
              activeConvId={activeConvId}
              onConvCreated={handleConvCreated}
            />
          )}
        </div>
      </div>

      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
}
