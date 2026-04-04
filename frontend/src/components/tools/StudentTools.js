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
export function PracticeTest() {
  const { currentUser } = useUser();
  const [subjects, setSubjects] = useState([{ name: 'Mathematics' }, { name: 'Science' }, { name: 'English' }, { name: 'Social Science' }, { name: 'Hindi' }]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [generating, setGenerating] = useState(false);

  const generateTest = async () => {
    if (!selectedSubject) return;
    setGenerating(true);
    setScore(null);
    setAnswers({});
    // Use LLM to generate practice questions
    try {
      const convId = `practice-${Date.now()}`;
      const prompt = `Generate 5 multiple-choice questions for a CBSE student on subject: ${selectedSubject}. Difficulty: ${difficulty}. Format each question as:
Q: [question text]
A) [option A]
B) [option B]  
C) [option C]
D) [option D]
Answer: [correct letter]

Generate exactly 5 questions in this format.`;

      const res = await fetch(`${API}/chat/conversations/${convId}/messages`, {
        method: 'POST', headers: h(currentUser), body: JSON.stringify({ text: prompt }),
      });
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split('\n\n')) {
          if (line.startsWith('data: ')) {
            try { const d = JSON.parse(line.slice(6)); if (d.type === 'text_delta') fullText += d.delta; } catch {}
          }
        }
      }
      // Parse questions from response
      const qBlocks = fullText.split(/Q:/).filter(b => b.trim());
      const parsed = qBlocks.slice(0, 5).map((block, i) => {
        const lines = block.trim().split('\n').filter(l => l.trim());
        const questionText = lines[0]?.trim() || `Question ${i + 1}`;
        const options = {};
        let correct = 'A';
        lines.forEach(l => {
          if (l.match(/^A\)/)) options.A = l.slice(2).trim();
          else if (l.match(/^B\)/)) options.B = l.slice(2).trim();
          else if (l.match(/^C\)/)) options.C = l.slice(2).trim();
          else if (l.match(/^D\)/)) options.D = l.slice(2).trim();
          else if (l.startsWith('Answer:')) correct = l.replace('Answer:', '').trim()[0] || 'A';
        });
        return { id: i, question: questionText, options, correct };
      });
      setQuestions(parsed.filter(q => Object.keys(q.options).length >= 2));
    } catch { setQuestions([]); }
    setGenerating(false);
  };

  const submitTest = () => {
    let correct = 0;
    questions.forEach(q => { if (answers[q.id] === q.correct) correct++; });
    setScore({ correct, total: questions.length, pct: Math.round((correct / questions.length) * 100) });
  };

  return (
    <ToolPage title="Practice Test" subtitle="Self-assessment quizzes">
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} style={{ background: '#161622', border: '1px solid #222230', borderRadius: 7, padding: '8px 12px', color: '#E2E8F0', fontSize: 12, outline: 'none' }}>
          <option value="">Select subject...</option>
          {subjects.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
        </select>
        <select value={difficulty} onChange={e => setDifficulty(e.target.value)} style={{ background: '#161622', border: '1px solid #222230', borderRadius: 7, padding: '8px 12px', color: '#E2E8F0', fontSize: 12, outline: 'none' }}>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <ActionBtn label={generating ? 'Generating...' : 'Generate Test'} onClick={generateTest} disabled={generating || !selectedSubject} />
      </div>

      {score && (
        <div style={{ background: score.pct >= 80 ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', border: `1px solid ${score.pct >= 80 ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`, borderRadius: 10, padding: '16px 20px', marginBottom: 16 }}>
          <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 24, fontWeight: 700, color: score.pct >= 80 ? '#10B981' : '#F59E0B' }}>{score.correct}/{score.total}</div>
          <div style={{ fontSize: 13, color: '#94A3B8' }}>{score.pct}% correct · {score.pct >= 80 ? 'Excellent!' : score.pct >= 60 ? 'Good effort!' : 'Keep practicing!'}</div>
        </div>
      )}

      {questions.map((q, qi) => (
        <div key={q.id} style={{ background: score ? (answers[q.id] === q.correct ? 'rgba(16,185,129,0.05)' : 'rgba(239,68,68,0.05)') : '#161622', border: `1px solid ${score ? (answers[q.id] === q.correct ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)') : '#222230'}`, borderRadius: 10, padding: 16, marginBottom: 10 }}>
          <p style={{ fontWeight: 600, color: '#E2E8F0', fontSize: 13, marginBottom: 10 }}>{qi + 1}. {q.question}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {Object.entries(q.options).map(([k, v]) => (
              <label key={k} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: score ? 'default' : 'pointer', padding: '6px 10px', borderRadius: 7, background: (score && k === q.correct) ? 'rgba(16,185,129,0.15)' : 'transparent', border: `1px solid ${(score && k === q.correct) ? 'rgba(16,185,129,0.3)' : 'transparent'}` }}>
                <input type="radio" name={`q${q.id}`} value={k} checked={answers[q.id] === k} onChange={() => !score && setAnswers(p => ({ ...p, [q.id]: k }))} disabled={!!score} />
                <span style={{ fontSize: 12, color: score && k === q.correct ? '#10B981' : '#94A3B8' }}>{k}) {v}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      {questions.length > 0 && !score && (
        <ActionBtn label="Submit Test" onClick={submitTest} />
      )}
    </ToolPage>
  );
}

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

// 8. Career Guidance AI - powered by LLM with student context
export function CareerGuidance() {
  const { currentUser } = useUser();
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  useEffect(() => {
    // Load student's results for context
    fetch(`${API}/academics/results`, { headers: h(currentUser) }).then(r => r.json())
      .then(r => { if (r.success) setResults(r.data || []); }).catch(() => {});
  }, []);

  const ask = async () => {
    if (!input.trim() || loading) return;
    setLoading(true);
    setResponse('');
    try {
      const context = results?.length > 0 ? `Student's results: ${results.map(r => `${r.subject_name}: ${r.marks_obtained}/${r.max_marks}`).join(', ')}.` : '';
      const prompt = `${context} Student asks: ${input}. Provide thoughtful career guidance for a CBSE school student in India, considering their academic performance and interests. Suggest specific career paths, required subjects, and entrance exams.`;
      const convId = `career-${Date.now()}`;
      const res = await fetch(`${API}/chat/conversations/${convId}/messages`, { method: 'POST', headers: h(currentUser), body: JSON.stringify({ text: prompt }) });
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let text = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split('\n\n')) {
          if (line.startsWith('data: ')) {
            try { const d = JSON.parse(line.slice(6)); if (d.type === 'text_delta') { text += d.delta; setResponse(text); } } catch {}
          }
        }
      }
    } catch { setResponse('Could not load guidance. Please try again.'); }
    setLoading(false);
  };

  const suggestions = ['What career should I choose based on my marks?', 'How to prepare for IIT JEE?', 'What are options after 10th?', 'Tell me about medical careers', 'What subjects for IAS/UPSC?'];

  return (
    <ToolPage title="Career Guidance AI" subtitle="AI-powered career advice based on your performance">
      <div style={{ maxWidth: 640 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 16 }}>
          {suggestions.map((s, i) => (
            <button key={i} onClick={() => setInput(s)} style={{ background: '#161622', border: '1px solid #222230', borderRadius: 7, padding: '6px 12px', color: '#94A3B8', fontSize: 11, cursor: 'pointer' }}>{s}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && ask()} placeholder="Ask about your career options..." disabled={loading}
            style={{ flex: 1, background: '#161622', border: '1px solid #222230', borderRadius: 8, padding: '10px 14px', color: '#E2E8F0', fontSize: 13, outline: 'none' }} />
          <ActionBtn label={loading ? '...' : 'Ask'} onClick={ask} disabled={loading || !input.trim()} />
        </div>
        {response && (
          <div style={{ background: '#161622', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 11, padding: 20 }}>
            <p style={{ color: '#94A3B8', fontSize: 13, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{response}</p>
          </div>
        )}
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
