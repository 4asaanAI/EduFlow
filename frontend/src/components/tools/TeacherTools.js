/**
 * All 12 Teacher Tools
 */
import React, { useState, useEffect } from 'react';
import { useUser } from '../../contexts/UserContext';
import { getAllClasses, getStudents, getTodayAttendance, bulkMarkAttendance } from '../../lib/api';
import { ToolPage, StatCard, DataTable, Badge, ComingSoon, FormField, ActionBtn } from './ToolPage';
import { Plus, CheckCircle, Save } from 'lucide-react';

const API = process.env.REACT_APP_BACKEND_URL + '/api';
function h(user) { return { 'Content-Type': 'application/json', 'X-User-Role': user?.role || 'teacher', 'X-User-Id': user?.id || 'user-teacher-001', 'X-User-Name': user?.name || 'Rajesh' }; }

// 1. Class Attendance Marker
export function ClassAttendanceMarker() {
  const { currentUser } = useUser();
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { getAllClasses(currentUser).then(r => { if (r.success && r.data.length > 0) { setClasses(r.data); setSelectedClass(r.data[0].id); } }); }, []);
  useEffect(() => { if (selectedClass) { setLoading(true); getTodayAttendance(selectedClass, currentUser).then(r => { if (r.success) setRecords(r.data || []); }).finally(() => setLoading(false)); } }, [selectedClass, date]);

  const handleSave = async () => {
    setSaving(true);
    await bulkMarkAttendance({ class_id: selectedClass, date, records: records.map(s => ({ student_id: s.student_id, status: s.status })) }, currentUser);
    setSaved(true); setSaving(false); setTimeout(() => setSaved(false), 3000);
  };

  const markAll = status => setRecords(prev => prev.map(s => ({ ...s, status })));

  return (
    <ToolPage title="Class Attendance" subtitle="Mark attendance for your class">
      <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap', alignItems: 'center' }}>
        <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} style={{ background: '#161622', border: '1px solid #222230', borderRadius: 7, padding: '8px 12px', color: '#E2E8F0', fontSize: 12, outline: 'none' }}>
          {classes.map(c => <option key={c.id} value={c.id}>{c.name}-{c.section}</option>)}
        </select>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ background: '#161622', border: '1px solid #222230', borderRadius: 7, padding: '8px 12px', color: '#E2E8F0', fontSize: 12, outline: 'none' }} />
        <ActionBtn label="All Present" variant="success" onClick={() => markAll('present')} />
        <ActionBtn label="All Absent" variant="danger" onClick={() => markAll('absent')} />
      </div>
      {records.length > 0 && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          {[['Present', records.filter(r => r.status === 'present').length, '#10B981'], ['Absent', records.filter(r => r.status === 'absent').length, '#EF4444'], ['Total', records.length, '#E2E8F0']].map(([l, v, c]) => (
            <StatCard key={l} value={v} label={l} color={c} small />
          ))}
        </div>
      )}
      <DataTable headers={['Roll', 'Student Name', 'Status', 'Quick Mark']}
        rows={records.map((s, i) => [
          s.roll_number || '-',
          s.name,
          <Badge text={s.status} color={{ present: 'green', absent: 'red', late: 'yellow', holiday: 'gray', not_marked: 'gray' }[s.status] || 'gray'} />,
          <div style={{ display: 'flex', gap: 3 }}>
            {[['P', 'present', '#10B981'], ['A', 'absent', '#EF4444'], ['L', 'late', '#F59E0B']].map(([lbl, val, col]) => (
              <button key={lbl} onClick={() => setRecords(prev => prev.map(st => st.student_id === s.student_id ? { ...st, status: val } : st))}
                style={{ background: s.status === val ? `${col}20` : 'transparent', border: `1px solid ${s.status === val ? col + '50' : '#222230'}`, borderRadius: 4, padding: '3px 7px', color: s.status === val ? col : '#64748B', fontSize: 10, cursor: 'pointer', fontWeight: 700 }}>{lbl}</button>
            ))}
          </div>
        ])}
        emptyMsg={loading ? 'Loading...' : 'No students found'}
      />
      {records.length > 0 && <button onClick={handleSave} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: 7, background: saved ? '#10B981' : '#3B82F6', border: 'none', borderRadius: 8, padding: '10px 20px', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', marginTop: 12 }}>
        {saved ? <CheckCircle size={14} /> : <Save size={14} />}{saved ? 'Saved!' : saving ? 'Saving...' : 'Save Attendance'}
      </button>}
    </ToolPage>
  );
}

// 2. Assignment Generator
export function AssignmentGenerator() {
  const { currentUser } = useUser();
  const [assignments, setAssignments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ class_id: '', subject_id: '', title: '', description: '', due_date: '', is_ai_blocked: true });
  const f = k => v => setForm(p => ({ ...p, [k]: v }));
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    Promise.all([
      getAllClasses(currentUser).then(r => { if (r.success) setClasses(r.data || []); }),
      fetch(`${API}/academics/assignments`, { headers: h(currentUser) }).then(r => r.json()).then(r => { if (r.success) setAssignments(r.data || []); })
    ]).finally(() => setLoading(false));
  }, []);

  const loadSubjects = async (classId) => {
    const r = await fetch(`${API}/academics/subjects?class_id=${classId}`, { headers: h(currentUser) }).then(r => r.json());
    if (r.success) setSubjects(r.data || []);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await fetch(`${API}/academics/assignments`, { method: 'POST', headers: h(currentUser), body: JSON.stringify(form) });
    setShowForm(false);
    const r = await fetch(`${API}/academics/assignments`, { headers: h(currentUser) }).then(r => r.json());
    if (r.success) setAssignments(r.data || []);
  };

  return (
    <ToolPage title="Assignment Generator" subtitle="Create & manage assignments" onRefresh={() => window.location.reload()} loading={loading}
      actions={<ActionBtn label="Create Assignment" onClick={() => setShowForm(true)} icon={<Plus size={11} />} />}>
      {showForm && (
        <div style={{ background: '#161622', border: '1px solid #222230', borderRadius: 11, padding: 20, marginBottom: 16 }}>
          <h3 style={{ fontFamily: 'Outfit, sans-serif', color: '#E2E8F0', fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Create Assignment</h3>
          <form onSubmit={handleCreate}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <FormField label="Class" type="select" value={form.class_id} onChange={v => { f('class_id')(v); loadSubjects(v); }} options={classes.map(c => ({ value: c.id, label: `${c.name}-${c.section}` }))} required />
              <FormField label="Subject" type="select" value={form.subject_id} onChange={f('subject_id')} options={subjects.map(s => ({ value: s.id, label: s.name }))} />
              <FormField label="Title" value={form.title} onChange={f('title')} placeholder="Assignment title" required />
              <FormField label="Due Date" type="date" value={form.due_date} onChange={f('due_date')} />
            </div>
            <FormField label="Description / Instructions" type="textarea" value={form.description} onChange={f('description')} placeholder="Assignment instructions..." />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <input type="checkbox" checked={form.is_ai_blocked} onChange={e => f('is_ai_blocked')(e.target.checked)} id="ai-block" />
              <label htmlFor="ai-block" style={{ fontSize: 12, color: '#94A3B8' }}>Block AI Tutor from solving this assignment (recommended)</label>
            </div>
            <div style={{ display: 'flex', gap: 8 }}><ActionBtn label="Create" /><ActionBtn label="Cancel" variant="secondary" onClick={() => setShowForm(false)} /></div>
          </form>
        </div>
      )}
      <DataTable headers={['Title', 'Class', 'Subject', 'Due Date', 'AI Blocked']}
        rows={assignments.map(a => [a.title, a.class_name, a.subject_name, a.due_date || 'N/A', <Badge text={a.is_ai_blocked ? 'Protected' : 'Open'} color={a.is_ai_blocked ? 'red' : 'green'} />])}
        emptyMsg="No assignments created yet"
      />
    </ToolPage>
  );
}

// 3. Question Paper Creator
export function QuestionPaperCreator() {
  const { currentUser } = useUser();
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState({ subject_id: '', title: '', chapters: '', easy: 30, medium: 50, hard: 20 });
  const [showForm, setShowForm] = useState(false);
  const f = k => v => setForm(p => ({ ...p, [k]: v }));

  useEffect(() => {
    fetch(`${API}/academics/subjects`, { headers: h(currentUser) }).then(r => r.json()).then(r => { if (r.success) setSubjects(r.data || []); }).finally(() => setLoading(false));
  }, []);

  return (
    <ToolPage title="Question Paper Creator" subtitle="Create question papers with AI assistance" loading={loading}
      actions={<ActionBtn label="Create Paper" onClick={() => setShowForm(true)} icon={<Plus size={11} />} />}>
      {showForm && (
        <div style={{ background: '#161622', border: '1px solid #222230', borderRadius: 11, padding: 20, marginBottom: 16 }}>
          <form>
            <FormField label="Subject" type="select" value={form.subject_id} onChange={f('subject_id')} options={subjects.map(s => ({ value: s.id, label: s.name }))} />
            <FormField label="Paper Title" value={form.title} onChange={f('title')} placeholder="e.g. Mid-Term Science Paper" />
            <FormField label="Chapters (comma-separated)" value={form.chapters} onChange={f('chapters')} placeholder="e.g. Chapter 1, Chapter 2, Chapter 3" />
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 10, color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 8 }}>DIFFICULTY MIX</label>
              <div style={{ display: 'flex', gap: 10 }}>
                {[['Easy', 'easy', '#10B981'], ['Medium', 'medium', '#F59E0B'], ['Hard', 'hard', '#EF4444']].map(([l, k, c]) => (
                  <div key={k} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: c, fontWeight: 700, marginBottom: 4 }}>{form[k]}%</div>
                    <input type="range" min={0} max={100} value={form[k]} onChange={e => f(k)(+e.target.value)} style={{ width: 80, accentColor: c }} />
                    <div style={{ fontSize: 9, color: '#64748B' }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <ActionBtn label="Generate with AI" onClick={() => { alert('AI question paper generation coming in Phase 3'); setShowForm(false); }} />
              <ActionBtn label="Cancel" variant="secondary" onClick={() => setShowForm(false)} />
            </div>
          </form>
        </div>
      )}
      <div style={{ padding: 32, textAlign: 'center', color: '#64748B', background: '#161622', border: '1px solid #222230', borderRadius: 11, fontSize: 12 }}>
        No question papers yet. Create one to get started.
      </div>
    </ToolPage>
  );
}

// 4. Report Card Builder
export function ReportCardBuilder() {
  const { currentUser } = useUser();
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetch(`${API}/academics/exams`, { headers: h(currentUser) }).then(r => r.json()).then(r => { if (r.success) setExams(r.data || []); }).finally(() => setLoading(false)); }, []);
  useEffect(() => { if (selectedExam) fetch(`${API}/academics/results?exam_id=${selectedExam}`, { headers: h(currentUser) }).then(r => r.json()).then(r => { if (r.success) setResults(r.data || []); }); }, [selectedExam]);

  return (
    <ToolPage title="Report Card Builder" subtitle="Enter marks & generate report cards" loading={loading}>
      <div style={{ marginBottom: 14 }}>
        <select value={selectedExam} onChange={e => setSelectedExam(e.target.value)} style={{ background: '#161622', border: '1px solid #222230', borderRadius: 7, padding: '8px 12px', color: '#E2E8F0', fontSize: 12, outline: 'none' }}>
          <option value="">Select exam...</option>
          {exams.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
        </select>
      </div>
      <DataTable headers={['Student', 'Subject', 'Marks', 'Max', 'Grade']}
        rows={results.map(r => [r.student_name, r.subject_name, r.marks_obtained, r.max_marks, <Badge text={r.grade || 'N/A'} color={r.grade?.startsWith('A') ? 'green' : r.grade?.startsWith('B') ? 'blue' : 'yellow'} />])}
        emptyMsg={selectedExam ? 'No results entered yet' : 'Select an exam to view results'}
      />
    </ToolPage>
  );
}

// 5. Student Performance Viewer
export function StudentPerformanceViewer() {
  const { currentUser } = useUser();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getStudents(currentUser).then(r => { if (r.success) setStudents(r.data || []); }).finally(() => setLoading(false)); }, []);
  return (
    <ToolPage title="Student Performance" subtitle="View marks & attendance trends" loading={loading}>
      <DataTable headers={['Name', 'Class', 'Status']}
        rows={students.slice(0, 15).map(s => [s.name, s.class_info ? `${s.class_info.name}-${s.class_info.section}` : 'N/A', <Badge text={s.status} color="green" />])}
        emptyMsg="No students found"
      />
    </ToolPage>
  );
}

// 6. Leave Application
export function LeaveApplication() {
  const { currentUser } = useUser();
  const [myLeaves, setMyLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ leave_type: 'casual', start_date: '', end_date: '', reason: '' });
  const f = k => v => setForm(p => ({ ...p, [k]: v }));

  useEffect(() => { fetch(`${API}/staff/leaves/pending`, { headers: h(currentUser) }).then(r => r.json()).then(r => { if (r.success) setMyLeaves(r.data || []); }).finally(() => setLoading(false)); }, []);

  const handleApply = async (e) => {
    e.preventDefault();
    await fetch(`${API}/ops/leaves`, { method: 'POST', headers: h(currentUser), body: JSON.stringify(form) });
    setForm({ leave_type: 'casual', start_date: '', end_date: '', reason: '' });
    alert('Leave application submitted successfully!');
  };

  return (
    <ToolPage title="Leave Application" subtitle="Apply for leave" loading={loading}>
      <div style={{ background: '#161622', border: '1px solid #222230', borderRadius: 11, padding: 20, marginBottom: 16, maxWidth: 500 }}>
        <h3 style={{ fontFamily: 'Outfit, sans-serif', color: '#E2E8F0', fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Apply for Leave</h3>
        <form onSubmit={handleApply}>
          <FormField label="Leave Type" type="select" value={form.leave_type} onChange={f('leave_type')} options={['casual', 'medical', 'earned', 'maternity', 'paternity', 'unpaid'].map(v => ({ value: v, label: v.charAt(0).toUpperCase() + v.slice(1) }))} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <FormField label="Start Date" type="date" value={form.start_date} onChange={f('start_date')} required />
            <FormField label="End Date" type="date" value={form.end_date} onChange={f('end_date')} required />
          </div>
          <FormField label="Reason" type="textarea" value={form.reason} onChange={f('reason')} placeholder="Reason for leave..." required />
          <ActionBtn label="Submit Application" />
        </form>
      </div>
      <DataTable title="Recent Leave Requests" headers={['Type', 'Start', 'End', 'Status']}
        rows={myLeaves.slice(0, 5).map(l => [l.leave?.leave_type || 'N/A', l.leave?.start_date || 'N/A', l.leave?.end_date || 'N/A', <Badge text={l.leave?.status || 'N/A'} color={{ pending: 'yellow', approved: 'green', rejected: 'red' }[l.leave?.status] || 'gray'} />])}
      />
    </ToolPage>
  );
}

// 7. Lesson Plan Generator
export function LessonPlanGenerator() {
  const { currentUser } = useUser();
  const [subjects, setSubjects] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ class_id: '', subject_id: '', chapter: '', content: '' });
  const [showForm, setShowForm] = useState(false);
  const [classes, setClasses] = useState([]);
  const f = k => v => setForm(p => ({ ...p, [k]: v }));

  useEffect(() => {
    Promise.all([
      getAllClasses(currentUser).then(r => { if (r.success) setClasses(r.data || []); }),
      fetch(`${API}/academics/subjects`, { headers: h(currentUser) }).then(r => r.json()).then(r => { if (r.success) setSubjects(r.data || []); }),
    ]).finally(() => setLoading(false));
  }, []);

  const create = async (e) => {
    e.preventDefault();
    await fetch(`${API}/academics/lesson-plans`, { method: 'POST', headers: h(currentUser), body: JSON.stringify({ ...form, content: { description: form.content } }) }).catch(() => {});
    setShowForm(false);
  };

  return (
    <ToolPage title="Lesson Plan Generator" subtitle="Create structured lesson plans" loading={loading}
      actions={<ActionBtn label="New Plan" onClick={() => setShowForm(true)} icon={<Plus size={11} />} />}>
      {showForm && (
        <div style={{ background: '#161622', border: '1px solid #222230', borderRadius: 11, padding: 20, marginBottom: 16 }}>
          <form onSubmit={create}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <FormField label="Class" type="select" value={form.class_id} onChange={f('class_id')} options={classes.map(c => ({ value: c.id, label: `${c.name}-${c.section}` }))} />
              <FormField label="Subject" type="select" value={form.subject_id} onChange={f('subject_id')} options={subjects.map(s => ({ value: s.id, label: s.name }))} />
              <FormField label="Chapter" value={form.chapter} onChange={f('chapter')} placeholder="Chapter name/topic" required />
            </div>
            <FormField label="Lesson Notes / Content" type="textarea" value={form.content} onChange={f('content')} placeholder="Lesson plan details..." />
            <div style={{ display: 'flex', gap: 8 }}><ActionBtn label="Save Plan" /><ActionBtn label="Cancel" variant="secondary" onClick={() => setShowForm(false)} /></div>
          </form>
        </div>
      )}
      <div style={{ padding: 32, textAlign: 'center', color: '#64748B', background: '#161622', border: '1px solid #222230', borderRadius: 11, fontSize: 12 }}>No lesson plans yet. Create your first plan above.</div>
    </ToolPage>
  );
}

// 8-12: Remaining Teacher Tools
export function WorksheetCreator() { return <ComingSoon toolName="Worksheet & Handout Creator" />; }
export function ClassPerformanceAnalytics() {
  const { currentUser } = useUser();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetch(`${API}/academics/results`, { headers: h(currentUser) }).then(r => r.json()).then(r => { if (r.success) setResults(r.data || []); }).finally(() => setLoading(false)); }, []);
  const avgMarks = results.length > 0 ? Math.round(results.reduce((s, r) => s + (r.marks_obtained || 0), 0) / results.length) : 0;
  return (
    <ToolPage title="Class Performance Analytics" subtitle="Trends and insights for your class" loading={loading}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 18, maxWidth: 500 }}>
        <StatCard value={results.length} label="RESULT ENTRIES" color="#3B82F6" />
        <StatCard value={`${avgMarks}/100`} label="AVG MARKS" color="#10B981" />
        <StatCard value={results.filter(r => r.marks_obtained >= 80).length} label="ABOVE 80%" color="#8B5CF6" />
      </div>
      <DataTable headers={['Student', 'Subject', 'Marks', 'Grade']}
        rows={results.slice(0, 10).map(r => [r.student_name, r.subject_name, `${r.marks_obtained}/${r.max_marks}`, <Badge text={r.grade || 'N/A'} color={r.grade?.startsWith('A') ? 'green' : 'blue'} />])}
      />
    </ToolPage>
  );
}
export function SubstitutionViewer() { return <ComingSoon toolName="Substitution Viewer" />; }
export function PtmNotes() {
  const { currentUser } = useUser();
  const [notes, setNotes] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ student_id: '', notes: '' });
  const f = k => v => setForm(p => ({ ...p, [k]: v }));

  useEffect(() => {
    Promise.all([
      getStudents(currentUser).then(r => { if (r.success) setStudents(r.data || []); }),
      fetch(`${API}/academics/ptm-notes`, { headers: h(currentUser) }).then(r => r.json()).then(r => { if (r.success) setNotes(r.data || []); })
    ]).finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    await fetch(`${API}/academics/ptm-notes`, { method: 'POST', headers: h(currentUser), body: JSON.stringify(form) });
    setForm({ student_id: '', notes: '' });
    const r = await fetch(`${API}/academics/ptm-notes`, { headers: h(currentUser) }).then(r => r.json());
    if (r.success) setNotes(r.data || []);
  };

  return (
    <ToolPage title="PTM Notes" subtitle="Record parent-teacher meeting notes" loading={loading}>
      <div style={{ background: '#161622', border: '1px solid #222230', borderRadius: 11, padding: 20, marginBottom: 16, maxWidth: 500 }}>
        <form onSubmit={handleSave}>
          <FormField label="Student" type="select" value={form.student_id} onChange={f('student_id')} options={students.map(s => ({ value: s.id, label: s.name }))} required />
          <FormField label="PTM Notes" type="textarea" value={form.notes} onChange={f('notes')} placeholder="Notes from the parent-teacher meeting..." required />
          <ActionBtn label="Save Notes" />
        </form>
      </div>
      <DataTable headers={['Student', 'Notes (Preview)', 'Date']}
        rows={notes.map(n => [n.student_name, n.notes?.slice(0, 60) + '...', n.created_at?.slice(0, 10)])}
        emptyMsg="No PTM notes yet"
      />
    </ToolPage>
  );
}
export function CurriculumTracker() {
  const { currentUser } = useUser();
  const [progress, setProgress] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ class_id: '', subject_id: '', topic: '', status: 'not_started' });
  const f = k => v => setForm(p => ({ ...p, [k]: v }));

  useEffect(() => {
    Promise.all([
      getAllClasses(currentUser).then(r => { if (r.success) setClasses(r.data || []); }),
      fetch(`${API}/academics/subjects`, { headers: h(currentUser) }).then(r => r.json()).then(r => { if (r.success) setSubjects(r.data || []); }),
      fetch(`${API}/academics/curriculum`, { headers: h(currentUser) }).then(r => r.json()).then(r => { if (r.success) setProgress(r.data || []); }),
    ]).finally(() => setLoading(false));
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    await fetch(`${API}/academics/curriculum`, { method: 'POST', headers: h(currentUser), body: JSON.stringify(form) });
    const r = await fetch(`${API}/academics/curriculum`, { headers: h(currentUser) }).then(r => r.json());
    if (r.success) setProgress(r.data || []);
    setForm({ class_id: '', subject_id: '', topic: '', status: 'not_started' });
  };

  const statusColors = { not_started: 'gray', in_progress: 'yellow', completed: 'green', revised: 'blue' };
  return (
    <ToolPage title="Curriculum Tracker" subtitle="Track syllabus coverage" loading={loading}>
      <div style={{ background: '#161622', border: '1px solid #222230', borderRadius: 11, padding: 20, marginBottom: 16 }}>
        <form onSubmit={handleUpdate}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10, alignItems: 'end' }}>
            <FormField label="Class" type="select" value={form.class_id} onChange={f('class_id')} options={classes.map(c => ({ value: c.id, label: `${c.name}-${c.section}` }))} />
            <FormField label="Subject" type="select" value={form.subject_id} onChange={f('subject_id')} options={subjects.map(s => ({ value: s.id, label: s.name }))} />
            <FormField label="Topic" value={form.topic} onChange={f('topic')} placeholder="Chapter/topic" required />
            <FormField label="Status" type="select" value={form.status} onChange={f('status')} options={['not_started', 'in_progress', 'completed', 'revised'].map(v => ({ value: v, label: v.replace('_', ' ') }))} />
          </div>
          <ActionBtn label="Update Progress" />
        </form>
      </div>
      <DataTable headers={['Topic', 'Status', 'Updated']}
        rows={progress.map(p => [p.topic, <Badge text={p.status?.replace('_', ' ')} color={statusColors[p.status] || 'gray'} />, p.updated_at?.slice(0, 10)])}
        emptyMsg="No curriculum progress tracked"
      />
    </ToolPage>
  );
}
