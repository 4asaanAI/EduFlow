import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import Sidebar from './Sidebar';
import Header from './Header';
import ChatInterface from './ChatInterface';
import SchoolPulse from './tools/SchoolPulse';
import FeeCollection from './tools/FeeCollection';
import StaffTracker from './tools/StaffTracker';
import StudentDatabase from './tools/StudentDatabase';
import AttendanceRecorder from './tools/AttendanceRecorder';
import { createConversation } from '../lib/api';

const TOOL_COMPONENTS = {
  'school-pulse': SchoolPulse,
  'fee-collection': FeeCollection,
  'staff-tracker': StaffTracker,
  'student-database': StudentDatabase,
  'attendance-recorder': AttendanceRecorder,
};

export default function Layout() {
  const { currentUser } = useUser();
  const [activeTool, setActiveTool] = useState(null);
  const [activeConvId, setActiveConvId] = useState(null);
  const [convRefresh, setConvRefresh] = useState(0);

  const handleNewChat = async () => {
    setActiveTool(null);
    const res = await createConversation(currentUser);
    if (res.success) {
      setActiveConvId(res.data.id);
      setConvRefresh(n => n + 1);
    }
  };

  const handleSelectTool = (toolId) => {
    setActiveTool(toolId);
  };

  const handleSelectConv = (convId) => {
    setActiveTool(null);
    setActiveConvId(convId);
  };

  const handleConvCreated = (convId) => {
    setActiveConvId(convId);
    setConvRefresh(n => n + 1);
  };

  // Reset tool when user switches role
  useEffect(() => {
    setActiveTool(null);
  }, [currentUser.role]);

  const ToolComponent = activeTool ? TOOL_COMPONENTS[activeTool] : null;

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#0A0A0F', overflow: 'hidden' }}>
      <Sidebar
        onSelectTool={handleSelectTool}
        onSelectConv={handleSelectConv}
        onNewChat={handleNewChat}
        activeTool={activeTool}
        activeConvId={activeConvId}
        convRefresh={convRefresh}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', marginLeft: 0 }}>
        <Header
          activeTool={activeTool}
          onBackToChat={() => setActiveTool(null)}
        />
        <div style={{ flex: 1, overflow: 'hidden' }}>
          {ToolComponent ? (
            <ToolComponent />
          ) : (
            <ChatInterface
              activeConvId={activeConvId}
              onConvCreated={handleConvCreated}
            />
          )}
        </div>
      </div>
    </div>
  );
}
