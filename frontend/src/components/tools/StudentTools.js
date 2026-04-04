/**
 * All 10 Student Tools
 */
import React, { useState, useEffect } from 'react';
import { useUser } from '../../contexts/UserContext';
import { ToolPage, StatCard, DataTable, Badge, ComingSoon, FormField, ActionBtn } from './ToolPage';
import { Brain, HelpCircle, Send } from 'lucide-react';

const API = process.env.REACT_APP_BACKEND_URL + '/api';
function h(user) { return { 'Content-Type': 'application/json', 'X-User-Role': user?.role || 'student', 'X-User-Id': user?.id || 'user-student-001', 'X-User-Name': user?.name || 'Rahul' }; }

// 1. AI Tutor
export function AiTutor() {
  const { currentUser } = useUser();
  const [messages, setMessages] = useState([{ role: 'ai', text: `Hello ${currentUser.name}! I'm your AI tutor. I can help you understand concepts, solve doubts, and study smarter. What would you like to learn today?` }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);
    try {
      const res = await fetch(`${API}/chat/conversations/tutor/messages`, {
        method: 'POST',
        headers: h(currentUser),
        body: JSON.stringify({ text: userMsg }),
      });
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let aiText = '';
      setMessages(prev => [...prev, { role: 'ai', text: '' }]);
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const events = chunk.split('\n\n').filter(e => e.startsWith('data: '));
        for (const event of events) {
          try {
            const data = JSON.parse(event.slice(6));
            if (data.type === 'text_delta') {
              aiText += data.delta;
              setMessages(prev => { const n = [...prev]; n[n.length - 1] = { role: 'ai', text: aiText }; return n; });
            }
          } catch {}
        }
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, I had trouble connecting. Please try again.' }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#0A0A0F' }}>
      <div style={{ padding: '16px 24px', borderBottom: '1px solid #222230', display: 'flex', alignItems: 'center', gap: 10 }}>
        <Brain size={18} color="#8B5CF6" />
        <div>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 16, fontWeight: 600, color: '#fff' }}>AI Tutor</h1>
          <p style={{ fontSize: 11, color: '#64748B' }}>NCERT/CBSE curriculum • Assignment protection active</p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          <Badge text="CBSE" color="blue" />
          <Badge text="Assignment Protected" color="red" />
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 14 }}>
            {msg.role === 'ai' && (
              <div style={{ width: 28, height: 28, borderRadius: 7, background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginRight: 10 }}>
                <Brain size={13} color="#8B5CF6" />
              </div>
            )}
            <div style={{ maxWidth: '80%', background: msg.role === 'user' ? '#1C1C28' : 'transparent', border: msg.role === 'user' ? '1px solid #222230' : 'none', borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : 0, padding: msg.role === 'user' ? '10px 14px' : '0', color: '#E2E8F0', fontSize: 13, lineHeight: 1.6 }}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: 'rgba(139,92,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Brain size={13} color="#8B5CF6" /></div>
            <div style={{ display: 'flex', gap: 3 }}>
              <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
            </div>
          </div>
        )}
      </div>
      <div style={{ padding: '12px 24px', borderTop: '1px solid #222230' }}>
        <div style={{ display: 'flex', gap: 8, background: '#1C1C28', border: '1px solid #222230', borderRadius: 12, padding: '8px 12px' }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }} placeholder="Ask me anything about your syllabus..." disabled={loading} style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#E2E8F0', fontSize: 13 }} />
          <button onClick={sendMessage} disabled={loading || !input.trim()} style={{ background: input.trim() ? '#8B5CF6' : '#222230', border: 'none', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <Send size={13} color="#fff" />
          </button>
        </div>
        <p style={{ fontSize: 9, color: '#374151', textAlign: 'center', marginTop: 6 }}>AI tutor will guide with hints only for assignment questions. NCERT curriculum.</p>
      </div>
    </div>
  );
}

// 2. Doubt Solver
export function DoubtSolver() {
  const { currentUser } = useUser();
  const [doubt, setDoubt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const solve = async () => {
    if (!doubt.trim() || loading) return;
    setLoading(true);
    setResponse('');
    try {
      const convId = `doubt-${Date.now()}`;
      const res = await fetch(`${API}/chat/conversations/${convId}/messages`, { method: 'POST', headers: h(currentUser), body: JSON.stringify({ text: `Doubt: ${doubt}` }) });
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let text = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split('\n\n')) {
          if (line.startsWith('data: ')) {
            try {
              const d = JSON.parse(line.slice(6));
              if (d.type === 'text_delta') { text += d.delta; setResponse(text); }
            } catch {}
          }
        }
      }
    } catch { setResponse('Could not solve doubt. Please try again.'); }
    setLoading(false);
  };

  return (
    <ToolPage title="Doubt Solver" subtitle="Get instant help with any concept">
      <div style={{ maxWidth: 600 }}>
        <div style={{ background: '#161622', border: '1px solid #222230', borderRadius: 11, padding: 20, marginBottom: 16 }}>
          <FormField label="Your Doubt or Question" type="textarea" value={doubt} onChange={setDoubt} placeholder="Type your doubt here... e.g. 'Explain photosynthesis with an example'" />
          <ActionBtn label={loading ? 'Solving...' : 'Solve My Doubt'} onClick={solve} disabled={loading} />
        </div>
        {response && (
          <div style={{ background: '#161622', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 11, padding: 20 }}>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', color: '#A78BFA', fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Answer</h3>
            <p style={{ color: '#94A3B8', fontSize: 13, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{response}</p>
          </div>
        )}
      </div>
    </ToolPage>
  );
}

// 3. Homework & Assignment Viewer
export function HomeworkViewer() {
  const { currentUser } = useUser();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetch(`${API}/academics/assignments`, { headers: h(currentUser) }).then(r => r.json()).then(r => { if (r.success) setAssignments(r.data || []); }).finally(() => setLoading(false)); }, []);
  const today = new Date().toISOString().slice(0, 10);
  return (
    <ToolPage title="Homework & Assignments" subtitle="View your pending assignments" loading={loading}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16, maxWidth: 500 }}>
        <StatCard value={assignments.length} label="TOTAL" color="#3B82F6" />
        <StatCard value={assignments.filter(a => a.due_date && a.due_date < today).length} label="OVERDUE" color="#EF4444" />
        <StatCard value={assignments.filter(a => !a.due_date || a.due_date >= today).length} label="UPCOMING" color="#10B981" />
      </div>
      <DataTable headers={['Title', 'Subject', 'Due Date', 'AI Help']}
        rows={assignments.map(a => [
          a.title,
          a.subject_name,
          a.due_date || 'No deadline',
          a.is_ai_blocked ? <Badge text="AI Blocked" color="red" /> : <Badge text="AI Allowed" color="green" />
        ])}
        emptyMsg="No assignments"
      />
    </ToolPage>
  );
}

// 4. Attendance Self-Check
export function AttendanceSelfCheck() {
  const { currentUser } = useUser();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { import('../../lib/api').then(({ executeTool }) => executeTool('get_my_attendance', {}, currentUser).then(r => { if (r.success) setData(r.data); setLoading(false); })); }, []);
  return (
    <ToolPage title="My Attendance" subtitle="View your attendance record" loading={loading}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 16, maxWidth: 600 }}>
        <StatCard value={data?.attendance_rate || '0%'} label="MY ATTENDANCE" color={parseFloat(data?.attendance_rate) >= 75 ? '#10B981' : '#EF4444'} />
        <StatCard value={data?.present || 0} label="PRESENT DAYS" color="#10B981" />
        <StatCard value={data?.absent || 0} label="ABSENT DAYS" color="#EF4444" />
        <StatCard value={data?.total_days || 0} label="TOTAL DAYS" color="#E2E8F0" />
      </div>
      {parseFloat(data?.attendance_rate) < 75 && (
        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '12px 16px', marginBottom: 16, fontSize: 12, color: '#FCA5A5' }}>
          ⚠️ Your attendance is below 75%. You may not be eligible to appear in exams. Please contact your class teacher.
        </div>
      )}
      <DataTable title="Recent Records (Last 7 Days)" headers={['Date', 'Status']}
        rows={(data?.records || []).map(r => [r.date, <Badge text={r.status} color={{ present: 'green', absent: 'red', late: 'yellow' }[r.status] || 'gray'} />])}
        emptyMsg="No recent attendance records"
      />
    </ToolPage>
  );
}

// 5. Result Viewer
export function ResultViewer() {
  const { currentUser } = useUser();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { import('../../lib/api').then(({ executeTool }) => executeTool('get_my_results', {}, currentUser).then(r => { if (r.success) setData(r.data); setLoading(false); })); }, []);
  return (
    <ToolPage title="My Results" subtitle="View your exam marks & grades" loading={loading}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 16, maxWidth: 400 }}>
        <StatCard value={data?.total_exams || 0} label="EXAMS" color="#3B82F6" />
        <StatCard value={data?.student_name || currentUser.name} label="STUDENT" color="#E2E8F0" />
      </div>
      <DataTable headers={['Exam', 'Subject', 'Marks', 'Grade']}
        rows={(data?.results || []).map(r => [r.exam, r.subject, r.marks, <Badge text={r.grade} color={r.grade?.startsWith('A') ? 'green' : r.grade?.startsWith('B') ? 'blue' : 'yellow'} />])}
        emptyMsg="No results available yet"
      />
    </ToolPage>
  );
}

// 6. Practice Test Generator
export function PracticeTest() { return <ComingSoon toolName="Practice Test Generator (Phase 4)" />; }

// 7. Study Planner - FIXED (saves to DB)
export function StudyPlanner() {
  const { currentUser } = useUser();
  const [plan, setPlan] = useState({ monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const f = k => v => setPlan(p => ({ ...p, [k]: v }));

  useEffect(() => {
    fetch(`${API}/ops/study-plan`, { headers: h(currentUser) }).then(r => r.json())
      .then(r => { if (r.success && r.data) setPlan(r.data); })
      .catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const r = await fetch(`${API}/ops/study-plan`, { method: 'POST', headers: h(currentUser), body: JSON.stringify(plan) }).then(r => r.json());
      if (r.success) { setSaved(true); setTimeout(() => setSaved(false), 3000); }
    } catch {}
    setSaving(false);
  };

  if (loading) return <ToolPage title="Study Planner" subtitle="Plan your week"><div style={{ color: '#64748B', fontSize: 13 }}>Loading...</div></ToolPage>;

  return (
    <ToolPage title="Study Planner" subtitle="Plan your weekly study schedule">
      <div style={{ maxWidth: 600 }}>
        <p style={{ color: '#64748B', fontSize: 12, marginBottom: 16 }}>Set your study goals for each day of the week. Your plan is saved automatically.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
          {Object.keys(plan).filter(k => k !== 'user_id' && k !== 'updated_at').map(day => (
            <FormField key={day} label={day.charAt(0).toUpperCase() + day.slice(1)} value={plan[day] || ''} onChange={f(day)}
              placeholder={`e.g. Maths Chapter 5, Physics revision`} type="textarea" />
          ))}
        </div>
        <ActionBtn label={saved ? '✓ Saved!' : saving ? 'Saving...' : 'Save My Plan'} onClick={handleSave} disabled={saving} />
      </div>
    </ToolPage>
  );
}

// 8. Career Guidance AI
export function CareerGuidance() {
  const [subject, setSubject] = useState('');
  const [response, setResponse] = useState('');
  return (
    <ToolPage title="Career Guidance AI" subtitle="Explore career options based on your interests">
      <div style={{ maxWidth: 500 }}>
        <div style={{ background: '#161622', border: '1px solid #222230', borderRadius: 11, padding: 20, marginBottom: 16 }}>
          <FormField label="Your Favourite Subject" type="select" value={subject} onChange={setSubject} options={['Mathematics', 'Science', 'English', 'Hindi', 'Social Science', 'Computer Science'].map(v => ({ value: v, label: v }))} />
          <ActionBtn label="Explore Careers" onClick={() => setResponse(`Based on your interest in ${subject}, here are some career paths:\n\n• Engineering & Technology\n• Research & Academia\n• Public Service\n\n(Full AI guidance available in Phase 4)`)} />
        </div>
        {response && <div style={{ background: '#161622', border: '1px solid #222230', borderRadius: 11, padding: 20 }}><p style={{ color: '#94A3B8', fontSize: 13, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{response}</p></div>}
      </div>
    </ToolPage>
  );
}

// 9. Fee Status Viewer
export function FeeStatusViewer() {
  const { currentUser } = useUser();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { import('../../lib/api').then(({ executeTool }) => executeTool('get_my_fees', {}, currentUser).then(r => { if (r.success) setData(r.data); setLoading(false); })); }, []);
  return (
    <ToolPage title="My Fee Status" subtitle="View your payment history" loading={loading}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 16, maxWidth: 400 }}>
        <StatCard value={data?.total_paid || '₹0'} label="TOTAL PAID" color="#10B981" />
        <StatCard value={data?.total_pending || '₹0'} label="PENDING" color="#EF4444" />
      </div>
      <DataTable headers={['Fee Type', 'Amount', 'Due Date', 'Status']}
        rows={(data?.transactions || []).map(t => [t.fee_type, t.amount, t.due_date || 'N/A', <Badge text={t.status} color={{ paid: 'green', pending: 'yellow', overdue: 'red' }[t.status] || 'gray'} />])}
        emptyMsg="No fee records"
      />
    </ToolPage>
  );
}

// 10. PTM Summary Viewer
export function PtmSummaryViewer() {
  const { currentUser } = useUser();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetch(`${API}/academics/ptm-notes`, { headers: h(currentUser) }).then(r => r.json()).then(r => { if (r.success) setNotes(r.data || []); }).finally(() => setLoading(false)); }, []);
  return (
    <ToolPage title="PTM Summary" subtitle="Read teacher notes from parent-teacher meetings" loading={loading}>
      {notes.length === 0 ? (
        <div style={{ padding: 32, textAlign: 'center', color: '#64748B', background: '#161622', border: '1px solid #222230', borderRadius: 11, fontSize: 12 }}>No PTM notes recorded yet</div>
      ) : (
        notes.map((n, i) => (
          <div key={i} style={{ background: '#161622', border: '1px solid #222230', borderRadius: 10, padding: 16, marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontWeight: 600, color: '#E2E8F0', fontSize: 13 }}>PTM Notes</span>
              <span style={{ fontSize: 11, color: '#64748B' }}>{n.created_at?.slice(0, 10)}</span>
            </div>
            <p style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.6 }}>{n.notes}</p>
          </div>
        ))
      )}
    </ToolPage>
  );
}
