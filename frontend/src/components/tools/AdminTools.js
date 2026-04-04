/**
 * All 19 Admin Tools
 */
import React, { useState, useEffect } from 'react';
import { useUser } from '../../contexts/UserContext';
import { getStudents, createStudent, getAllClasses, getTodayAttendance, bulkMarkAttendance, getFeeTransactions, recordFeePayment, getPendingLeaves, updateLeave } from '../../lib/api';
import { ToolPage, StatCard, DataTable, Badge, ComingSoon, FormField, ActionBtn } from './ToolPage';
import { Search, Plus, CheckCircle, XCircle, Save, RefreshCw, X } from 'lucide-react';

const API = process.env.REACT_APP_BACKEND_URL + '/api';
function h(user) { return { 'Content-Type': 'application/json', 'X-User-Role': user?.role || 'admin', 'X-User-Id': user?.id || 'user-admin-001', 'X-User-Name': user?.name || 'Priya' }; }

// 1. Student Database Manager
export function StudentDatabase() {
  const { currentUser } = useUser();
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', class_id: '', admission_number: '', dob: '', gender: '', guardian_name: '', guardian_phone: '' });
  const f = k => v => setForm(p => ({ ...p, [k]: v }));

  useEffect(() => { getAllClasses(currentUser).then(r => { if (r.success) setClasses(r.data || []); }); }, []);
  useEffect(() => { load(); }, [search, filterClass, page]);

  const load = async () => {
    setLoading(true);
    const params = { page };
    if (search) params.search = search;
    if (filterClass) params.class_id = filterClass;
    try { const r = await getStudents(currentUser, params); if (r.success) { setStudents(r.data || []); setTotal(r.meta?.total || 0); } } catch {}
    setLoading(false);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name || !form.class_id) return;
    await createStudent(currentUser, form);
    setShowAdd(false); setForm({ name: '', class_id: '', admission_number: '', dob: '', gender: '', guardian_name: '', guardian_phone: '' }); load();
  };

  return (
    <ToolPage title="Student Database" subtitle={`${total} students enrolled`} onRefresh={load} loading={loading}
      actions={<ActionBtn label="Add Student" onClick={() => setShowAdd(true)} icon={<Plus size={11} />} />}>
      {showAdd && (
        <div style={{ background: '#161622', border: '1px solid #222230', borderRadius: 11, padding: 20, marginBottom: 16 }}>
          <h3 style={{ fontFamily: 'Outfit, sans-serif', color: '#E2E8F0', fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Add New Student</h3>
          <form onSubmit={handleAdd}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <FormField label="Full Name" value={form.name} onChange={f('name')} placeholder="Student full name" required />
              <FormField label="Class" type="select" value={form.class_id} onChange={f('class_id')} options={classes.map(c => ({ value: c.id, label: `${c.name}-${c.section}` }))} required />
              <FormField label="Admission No." value={form.admission_number} onChange={f('admission_number')} placeholder="Auto-generated if empty" />
              <FormField label="Date of Birth" type="date" value={form.dob} onChange={f('dob')} />
              <FormField label="Guardian Name" value={form.guardian_name} onChange={f('guardian_name')} placeholder="Parent/guardian name" />
              <FormField label="Guardian Phone" type="tel" value={form.guardian_phone} onChange={f('guardian_phone')} placeholder="10-digit mobile" />
            </div>
            <FormField label="Gender" type="select" value={form.gender} onChange={f('gender')} options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }, { value: 'other', label: 'Other' }]} />
            <div style={{ display: 'flex', gap: 8 }}><ActionBtn label="Add Student" /><ActionBtn label="Cancel" variant="secondary" onClick={() => setShowAdd(false)} /></div>
          </form>
        </div>
      )}
      <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 280 }}>
          <Search size={12} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} data-testid="student-search" placeholder="Search by name or admission no..." style={{ width: '100%', background: '#161622', border: '1px solid #222230', borderRadius: 7, padding: '8px 10px 8px 28px', color: '#E2E8F0', fontSize: 12, outline: 'none' }} />
        </div>
        <select value={filterClass} onChange={e => { setFilterClass(e.target.value); setPage(1); }} data-testid="class-filter" style={{ background: '#161622', border: '1px solid #222230', borderRadius: 7, padding: '8px 12px', color: '#E2E8F0', fontSize: 12, outline: 'none' }}>
          <option value="">All classes</option>
          {classes.map(c => <option key={c.id} value={c.id}>{c.name}-{c.section}</option>)}
        </select>
      </div>
      <DataTable headers={['Name', 'Class', 'Adm. No.', 'Gender', 'Status']}
        rows={students.map(s => [
          s.name,
          s.class_info ? `${s.class_info.name}-${s.class_info.section}` : 'N/A',
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>{s.admission_number || 'N/A'}</span>,
          s.gender || 'N/A',
          <Badge text={s.status} color={s.status === 'active' ? 'green' : 'gray'} />,
        ])}
        emptyMsg={loading ? 'Loading...' : 'No students found'}
      />
      {total > 20 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 12 }}>
          <ActionBtn label="Prev" variant="secondary" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} />
          <span style={{ color: '#64748B', fontSize: 12, alignSelf: 'center' }}>Page {page} of {Math.ceil(total / 20)}</span>
          <ActionBtn label="Next" variant="secondary" onClick={() => setPage(p => p + 1)} disabled={students.length < 20} />
        </div>
      )}
    </ToolPage>
  );
}

// 2. Fee Tracker & Reminder
export function FeeTracker() {
  const { currentUser } = useUser();
  const [txns, setTxns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ student_id: '', fee_type: 'tuition', amount: '', payment_mode: 'cash' });
  const f = k => v => setForm(p => ({ ...p, [k]: v }));
  const [filter, setFilter] = useState('');

  useEffect(() => { load(); getStudents(currentUser).then(r => { if (r.success) setStudents(r.data || []); }); }, []);

  const load = async () => {

  const load = async () => {
    setLoading(true);
    try {
      const params = filter ? { status: filter } : {};
      const r = await getFeeTransactions(currentUser, params);
      if (r.success) setTxns(r.data || []);
    } catch {}
    setLoading(false);
  };

  const handleRecord = async (e) => {
    e.preventDefault();
    await recordFeePayment(currentUser, { ...form, amount: parseFloat(form.amount) });
    setShowForm(false); setForm({ student_id: '', fee_type: 'tuition', amount: '', payment_mode: 'cash' }); load();
  };

  const statusColors = { paid: 'green', pending: 'yellow', overdue: 'red', waived: 'gray', partial: 'blue' };

  return (
    <ToolPage title="Fee Tracker" subtitle="Payments, dues & reminders" onRefresh={load} loading={loading}
      actions={<ActionBtn label="Record Payment" onClick={() => setShowForm(true)} icon={<Plus size={11} />} />}>
      {showForm && (
        <div style={{ background: '#161622', border: '1px solid #222230', borderRadius: 11, padding: 20, marginBottom: 16 }}>
          <h3 style={{ fontFamily: 'Outfit, sans-serif', color: '#E2E8F0', fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Record Fee Payment</h3>
          <form onSubmit={handleRecord}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <FormField label="Student" type="select" value={form.student_id} onChange={f('student_id')} options={students.map(s => ({ value: s.id, label: s.name }))} required />
              <FormField label="Fee Type" type="select" value={form.fee_type} onChange={f('fee_type')} options={['tuition', 'transport', 'exam', 'sports', 'other'].map(v => ({ value: v, label: v }))} />
              <FormField label="Amount (₹)" type="number" value={form.amount} onChange={f('amount')} placeholder="0.00" required />
              <FormField label="Payment Mode" type="select" value={form.payment_mode} onChange={f('payment_mode')} options={[{ value: 'cash', label: 'Cash' }, { value: 'upi', label: 'UPI' }, { value: 'cheque', label: 'Cheque' }, { value: 'online', label: 'Online' }]} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}><ActionBtn label="Record" /><ActionBtn label="Cancel" variant="secondary" onClick={() => setShowForm(false)} /></div>
          </form>
        </div>
      )}
      <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
        {['', 'paid', 'pending', 'overdue'].map(s => (
          <button key={s} onClick={() => { setFilter(s); setLoading(true); }} style={{ background: filter === s ? '#3B82F6' : '#161622', border: `1px solid ${filter === s ? '#3B82F6' : '#222230'}`, borderRadius: 6, padding: '5px 12px', color: filter === s ? '#fff' : '#94A3B8', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
            {s || 'All'}
          </button>
        ))}
      </div>
      <DataTable headers={['Student', 'Fee Type', 'Amount', 'Due Date', 'Paid Date', 'Status']}
        rows={txns.map(t => [t.student_name || 'N/A', t.fee_type, `₹${(t.amount || 0).toLocaleString('en-IN')}`, t.due_date || 'N/A', t.paid_date || '—', <Badge text={t.status} color={statusColors[t.status] || 'gray'} />])}
        emptyMsg="No transactions found"
      />
    </ToolPage>
  );
}

// 3. Attendance Recorder
export function AttendanceRecorder() {
  const { currentUser } = useUser();
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { getAllClasses(currentUser).then(r => { if (r.success && r.data.length > 0) { setClasses(r.data); setSelectedClass(r.data[0].id); } }); }, []);
  useEffect(() => { if (selectedClass) loadStudents(); }, [selectedClass, date]);

  const loadStudents = async () => {
    setLoading(true);
    try { const r = await getTodayAttendance(selectedClass, currentUser); if (r.success) setRecords(r.data || []); } catch {}
    setLoading(false);
  };

  const markAll = status => setRecords(prev => prev.map(s => ({ ...s, status })));

  const handleSave = async () => {
    setSaving(true);
    try {
      await bulkMarkAttendance({ class_id: selectedClass, date, records: records.map(s => ({ student_id: s.student_id, status: s.status })) }, currentUser);
      setSaved(true); setTimeout(() => setSaved(false), 3000);
    } catch {}
    setSaving(false);
  };

  const statusOpts = ['present', 'absent', 'late', 'holiday'];
  const presentCount = records.filter(r => r.status === 'present').length;

  return (
    <ToolPage title="Attendance Recorder" subtitle="Mark class attendance">
      <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap', alignItems: 'center' }}>
        <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} data-testid="class-select" style={{ background: '#161622', border: '1px solid #222230', borderRadius: 7, padding: '8px 12px', color: '#E2E8F0', fontSize: 12, outline: 'none' }}>
          {classes.map(c => <option key={c.id} value={c.id}>{c.name}-{c.section}</option>)}
        </select>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} data-testid="date-picker" style={{ background: '#161622', border: '1px solid #222230', borderRadius: 7, padding: '8px 12px', color: '#E2E8F0', fontSize: 12, outline: 'none' }} />
        <ActionBtn label="All Present" variant="success" onClick={() => markAll('present')} data-testid="mark-all-present" />
        <ActionBtn label="All Absent" variant="danger" onClick={() => markAll('absent')} data-testid="mark-all-absent" />
      </div>
      {records.length > 0 && (
        <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
          {[{ label: 'Present', val: presentCount, color: '#10B981' }, { label: 'Absent', val: records.filter(r => r.status === 'absent').length, color: '#EF4444' }, { label: 'Late', val: records.filter(r => r.status === 'late').length, color: '#F59E0B' }, { label: 'Total', val: records.length, color: '#E2E8F0' }].map(s => (
            <StatCard key={s.label} value={s.val} label={s.label} color={s.color} small />
          ))}
        </div>
      )}
      <div style={{ background: '#161622', border: '1px solid #222230', borderRadius: 11, overflow: 'hidden', marginBottom: 14 }}>
        {loading ? <div style={{ padding: 32, textAlign: 'center', color: '#64748B', fontSize: 12 }}>Loading students...</div> : records.length === 0 ? <div style={{ padding: 32, textAlign: 'center', color: '#64748B', fontSize: 12 }}>No students or no class selected</div> : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr>
              {['Roll', 'Student Name', 'Status', 'Quick Mark'].map(h => <th key={h} style={{ padding: '8px 14px', textAlign: 'left', fontSize: 9.5, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', background: '#0F0F1A', borderBottom: '1px solid #222230' }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {records.map((s, i) => {
                const statusOpt = { present: { color: '#10B981' }, absent: { color: '#EF4444' }, late: { color: '#F59E0B' }, holiday: { color: '#64748B' } };
                const sc = statusOpt[s.status] || { color: '#64748B' };
                return (
                  <tr key={s.student_id || i} style={{ borderBottom: i < records.length - 1 ? '1px solid #1A1A24' : 'none' }}>
                    <td style={{ padding: '8px 14px', fontSize: 11, color: '#64748B', fontFamily: 'JetBrains Mono, monospace' }}>{s.roll_number || '-'}</td>
                    <td style={{ padding: '8px 14px', fontSize: 13, color: '#E2E8F0', fontWeight: 500 }}>{s.name}</td>
                    <td style={{ padding: '8px 14px' }}><span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 5, background: `${sc.color}15`, color: sc.color }}>{s.status}</span></td>
                    <td style={{ padding: '8px 14px' }}>
                      <div style={{ display: 'flex', gap: 3 }}>
                        {['P', 'A', 'L'].map((lbl, li) => {
                          const vals = ['present', 'absent', 'late'];
                          const c = [{ color: '#10B981' }, { color: '#EF4444' }, { color: '#F59E0B' }][li];
                          return <button key={lbl} onClick={() => setRecords(prev => prev.map(st => st.student_id === s.student_id ? { ...st, status: vals[li] } : st))}
                            style={{ background: s.status === vals[li] ? `${c.color}20` : 'transparent', border: `1px solid ${s.status === vals[li] ? c.color + '50' : '#222230'}`, borderRadius: 4, padding: '3px 7px', color: s.status === vals[li] ? c.color : '#64748B', fontSize: 10, cursor: 'pointer', fontWeight: 700 }}>{lbl}</button>;
                        })}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      {records.length > 0 && <button data-testid="save-attendance-btn" onClick={handleSave} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: 7, background: saved ? '#10B981' : saving ? '#1E3A5F' : '#3B82F6', border: 'none', borderRadius: 8, padding: '10px 20px', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
        {saved ? <CheckCircle size={14} /> : <Save size={14} />}
        {saved ? 'Saved!' : saving ? 'Saving...' : 'Save Attendance'}
      </button>}
    </ToolPage>
  );
}

// 4. Certificate Generator - FIXED
export function CertificateGenerator() {
  const { currentUser } = useUser();
  const [students, setStudents] = useState([]);
  const [certs, setCerts] = useState([]);
  const [form, setForm] = useState({ student_id: '', cert_type: 'bonafide' });
  const f = k => v => setForm(p => ({ ...p, [k]: v }));
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(null);

  const loadCerts = async () => {
    const r = await fetch(`${API}/ops/certificates`, { headers: h(currentUser) }).then(r => r.json());
    if (r.success) setCerts(r.data || []);
  };

  useEffect(() => {
    Promise.all([
      getStudents(currentUser).then(r => { if (r.success) setStudents(r.data || []); }),
      loadCerts()
    ]).finally(() => setLoading(false));
  }, []);

  const generate = async () => {
    if (!form.student_id) return;
    setGenerating(true);
    try {
      const student = students.find(s => s.id === form.student_id);
      const r = await fetch(`${API}/ops/certificates`, {
        method: 'POST', headers: h(currentUser),
        body: JSON.stringify({
          student_id: form.student_id,
          cert_type: form.cert_type,
          content_data: {
            student_name: student?.name || 'Student',
            class: student?.class_info ? `${student.class_info.name}-${student.class_info.section}` : 'N/A',
            issued_by: 'The Aaryans School',
            issued_date: new Date().toISOString().slice(0, 10),
            academic_year: '2025-26',
          }
        })
      }).then(r => r.json());
      if (r.success) {
        setGenerated(r.data);
        await loadCerts();
      }
    } catch {}
    setGenerating(false);
  };

  const certTypeLabels = { transfer: 'Transfer Certificate', bonafide: 'Bonafide Certificate', character: 'Character Certificate', sports: 'Sports Certificate', participation: 'Participation Certificate', migration: 'Migration Certificate' };

  return (
    <ToolPage title="Certificate Generator" subtitle="Generate TC, Bonafide, Character certificates" loading={loading}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, maxWidth: 900 }}>
        {/* Generator form */}
        <div style={{ background: '#161622', border: '1px solid #222230', borderRadius: 11, padding: 20 }}>
          <h3 style={{ fontFamily: 'Outfit, sans-serif', color: '#E2E8F0', fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Generate Certificate</h3>
          <FormField label="Student" type="select" value={form.student_id} onChange={f('student_id')}
            options={students.map(s => ({ value: s.id, label: s.name }))} required />
          <FormField label="Certificate Type" type="select" value={form.cert_type} onChange={f('cert_type')}
            options={Object.entries(certTypeLabels).map(([v, l]) => ({ value: v, label: l }))} />
          <ActionBtn label={generating ? 'Generating...' : 'Generate Certificate'} onClick={generate} disabled={generating || !form.student_id} />

          {/* Preview */}
          {generated && (
            <div style={{ marginTop: 16, background: '#0F0F1A', border: '1px solid #222230', borderRadius: 8, padding: 16 }}>
              <div style={{ fontSize: 11, color: '#10B981', fontWeight: 700, marginBottom: 8 }}>Certificate Generated!</div>
              <div style={{ fontSize: 12, color: '#94A3B8' }}>
                <div><b>Type:</b> {certTypeLabels[generated.cert_type]}</div>
                <div><b>Serial:</b> {generated.serial_number}</div>
                <div><b>Student:</b> {generated.content_data?.student_name}</div>
                <div><b>Date:</b> {generated.issued_date}</div>
              </div>
              <div style={{ marginTop: 10, padding: '8px', background: '#161622', borderRadius: 6, fontSize: 11, color: '#64748B' }}>
                PDF generation available in Phase 2. Certificate is saved and can be printed.
              </div>
            </div>
          )}
        </div>

        {/* History */}
        <div>
          <DataTable title={`Generated Certificates (${certs.length})`} headers={['Student', 'Type', 'Serial No.', 'Date']}
            rows={certs.map(c => [c.student_name, certTypeLabels[c.cert_type] || c.cert_type, <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10 }}>{c.serial_number}</span>, c.issued_date])}
            emptyMsg="No certificates generated yet"
          />
        </div>
      </div>
    </ToolPage>
  );
}

// 5. Circular & Notice Sender
export function CircularSender() {
  return <AnnouncementBroadcasterAdmin />;
}

function AnnouncementBroadcasterAdmin() {
  const { currentUser } = useUser();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', content: '', audience_type: 'all' });
  const f = k => v => setForm(p => ({ ...p, [k]: v }));

  useEffect(() => { fetch(`${API}/ops/announcements`, { headers: h(currentUser) }).then(r => r.json()).then(r => { if (r.success) setAnnouncements(r.data || []); }).finally(() => setLoading(false)); }, []);

  const send = async (e) => {
    e.preventDefault();
    await fetch(`${API}/ops/announcements`, { method: 'POST', headers: h(currentUser), body: JSON.stringify({ ...form, is_draft: false }) });
    setForm({ title: '', content: '', audience_type: 'all' });
    const r = await fetch(`${API}/ops/announcements`, { headers: h(currentUser) }).then(r => r.json());
    if (r.success) setAnnouncements(r.data || []);
  };

  return (
    <ToolPage title="Circular & Notice Sender" subtitle="Send notices and circulars" loading={loading}>
      <div style={{ background: '#161622', border: '1px solid #222230', borderRadius: 11, padding: 20, marginBottom: 16, maxWidth: 600 }}>
        <h3 style={{ fontFamily: 'Outfit, sans-serif', color: '#E2E8F0', fontSize: 14, fontWeight: 600, marginBottom: 14 }}>New Circular</h3>
        <form onSubmit={send}>
          <FormField label="Title" value={form.title} onChange={f('title')} placeholder="Circular title" required />
          <FormField label="Content" type="textarea" value={form.content} onChange={f('content')} placeholder="Write the circular..." required />
          <FormField label="Audience" type="select" value={form.audience_type} onChange={f('audience_type')} options={[{ value: 'all', label: 'All' }, { value: 'role', label: 'By Role' }, { value: 'class', label: 'By Class' }]} />
          <ActionBtn label="Send Circular" />
        </form>
      </div>
      <DataTable title="Recent Circulars" headers={['Title', 'Audience', 'Date']}
        rows={announcements.map(a => [a.title, a.audience_type, a.created_at?.slice(0, 10)])}
      />
    </ToolPage>
  );
}

// 6. Enquiry Register
export function EnquiryRegister() {
  const { currentUser } = useUser();
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ student_name: '', parent_name: '', phone: '', class_applying: '', source: 'walk_in' });
  const f = k => v => setForm(p => ({ ...p, [k]: v }));

  useEffect(() => { load(); }, []);
  const load = async () => { setLoading(true); try { const r = await fetch(`${API}/ops/enquiries`, { headers: h(currentUser) }).then(r => r.json()); if (r.success) setEnquiries(r.data || []); } catch {} setLoading(false); };

  const handleAdd = async (e) => {
    e.preventDefault();
    await fetch(`${API}/ops/enquiries`, { method: 'POST', headers: h(currentUser), body: JSON.stringify(form) });
    setShowForm(false); setForm({ student_name: '', parent_name: '', phone: '', class_applying: '', source: 'walk_in' }); load();
  };

  const updateStatus = async (id, status) => {
    await fetch(`${API}/ops/enquiries/${id}`, { method: 'PATCH', headers: h(currentUser), body: JSON.stringify({ status }) });
    load();
  };

  const statusColors = { new: 'blue', contacted: 'yellow', visit_scheduled: 'purple', visited: 'purple', documents_submitted: 'yellow', fee_paid: 'green', enrolled: 'green', lost: 'red' };

  return (
    <ToolPage title="Enquiry Register" subtitle="Track admission leads" onRefresh={load} loading={loading}
      actions={<ActionBtn label="New Enquiry" onClick={() => setShowForm(true)} icon={<Plus size={11} />} />}>
      {showForm && (
        <div style={{ background: '#161622', border: '1px solid #222230', borderRadius: 11, padding: 20, marginBottom: 16 }}>
          <form onSubmit={handleAdd}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <FormField label="Student Name" value={form.student_name} onChange={f('student_name')} placeholder="Enquiry student" required />
              <FormField label="Parent Name" value={form.parent_name} onChange={f('parent_name')} placeholder="Parent/guardian" required />
              <FormField label="Phone" type="tel" value={form.phone} onChange={f('phone')} placeholder="Mobile number" required />
              <FormField label="Class Applying" value={form.class_applying} onChange={f('class_applying')} placeholder="e.g. Class 9" />
              <FormField label="Source" type="select" value={form.source} onChange={f('source')} options={['walk_in', 'phone', 'referral', 'online', 'ad'].map(v => ({ value: v, label: v.replace('_', ' ') }))} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}><ActionBtn label="Add Enquiry" /><ActionBtn label="Cancel" variant="secondary" onClick={() => setShowForm(false)} /></div>
          </form>
        </div>
      )}
      <DataTable headers={['Student', 'Parent', 'Class', 'Status', 'Source', 'Date']}
        rows={enquiries.map(e => [
          e.student_name, e.parent_name, e.class_applying,
          <Badge text={e.status} color={statusColors[e.status] || 'blue'} />,
          e.source, e.created_at?.slice(0, 10)
        ])}
        emptyMsg="No enquiries yet"
      />
    </ToolPage>
  );
}

// 7-19: Remaining Admin Tools (some skeleton, some functional)
export function DocumentScanner() { return <ComingSoon toolName="Document Scanner & Extractor (Phase 2)" />; }
export function SmartFeeDefaulter() {
  const { currentUser } = useUser();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { import('../../lib/api').then(({ executeTool }) => { executeTool('get_fee_summary', {}, currentUser).then(r => { if (r.success) setData(r.data); setLoading(false); }); }); }, []);
  const defaulters = data?.defaulters || [];
  return (
    <ToolPage title="Smart Fee Defaulter Manager" subtitle="Intelligent reminders for overdue fees" onRefresh={() => window.location.reload()} loading={loading}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16, maxWidth: 600 }}>
        <StatCard value={data?.stats?.total_overdue || '₹0'} label="TOTAL OVERDUE" color="#EF4444" />
        <StatCard value={data?.stats?.students_with_dues || 0} label="STUDENTS" color="#F59E0B" />
        <StatCard value={data?.stats?.collection_rate || '0%'} label="COLLECTION RATE" color="#10B981" />
      </div>
      <DataTable headers={['Student', 'Class', 'Amount Due', 'Days Overdue', 'Action']}
        rows={defaulters.map(d => [d.student_name, d.class, <span style={{ color: '#EF4444', fontWeight: 600 }}>{d.amount_overdue_fmt}</span>, `${d.days_overdue} days`, <button style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 5, padding: '3px 8px', color: '#93C5FD', fontSize: 10, cursor: 'pointer' }}>Send Reminder</button>])}
      />
    </ToolPage>
  );
}
export function AdmissionPipeline() { return <AdmissionFunnelAdmin />; }
function AdmissionFunnelAdmin() {
  const { currentUser } = useUser();
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetch(`${API}/ops/enquiries`, { headers: h(currentUser) }).then(r => r.json()).then(r => { if (r.success) setEnquiries(r.data || []); }).finally(() => setLoading(false)); }, []);
  const stages = ['new', 'contacted', 'visit_scheduled', 'visited', 'documents_submitted', 'fee_paid', 'enrolled', 'lost'];
  const counts = stages.reduce((acc, s) => { acc[s] = enquiries.filter(e => e.status === s).length; return acc; }, {});
  return (
    <ToolPage title="Admission Pipeline" subtitle="Track conversion funnel" loading={loading}>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18 }}>
        {stages.map(s => <div key={s} style={{ background: '#161622', border: '1px solid #222230', borderRadius: 8, padding: '8px 12px', textAlign: 'center', minWidth: 85 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: s === 'enrolled' ? '#10B981' : s === 'lost' ? '#EF4444' : '#E2E8F0', fontFamily: 'Outfit, sans-serif' }}>{counts[s] || 0}</div>
          <div style={{ fontSize: 9, color: '#64748B', textTransform: 'capitalize', fontWeight: 600 }}>{s.replace('_', ' ')}</div>
        </div>)}
      </div>
    </ToolPage>
  );
}
export function ParentMessage() { return <ComingSoon toolName="Parent Message Composer (WhatsApp - Phase 2)" />; }
export function StudentTransfer() { return <ComingSoon toolName="Student Transfer / Withdrawal" />; }
export function IdCardGenerator() { return <ComingSoon toolName="ID Card Generator (Phase 2)" />; }
export function TimetableBuilder() {
  const { currentUser } = useUser();
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getAllClasses(currentUser).then(r => { if (r.success && r.data.length > 0) { setClasses(r.data); setSelectedClass(r.data[0].id); } }).finally(() => setLoading(false)); }, []);
  useEffect(() => { if (selectedClass) fetch(`${API}/academics/timetable/${selectedClass}`, { headers: h(currentUser) }).then(r => r.json()).then(r => { if (r.success) setSlots(r.data || []); }); }, [selectedClass]);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return (
    <ToolPage title="Timetable Builder" subtitle="Build and manage class timetables" loading={loading}>
      <div style={{ marginBottom: 14 }}>
        <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} style={{ background: '#161622', border: '1px solid #222230', borderRadius: 7, padding: '8px 12px', color: '#E2E8F0', fontSize: 12, outline: 'none' }}>
          {classes.map(c => <option key={c.id} value={c.id}>{c.name}-{c.section}</option>)}
        </select>
      </div>
      <DataTable title="Current Timetable" headers={['Day', 'Period', 'Subject', 'Time', 'Room']}
        rows={slots.map(s => [days[s.day_of_week - 1] || 'N/A', s.period_number, s.subject_name, `${s.start_time} – ${s.end_time}`, s.room || 'N/A'])}
        emptyMsg="No timetable slots configured"
      />
    </ToolPage>
  );
}
export function AssetTracker() {
  const { currentUser } = useUser();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', category: '', quantity: 1, location: '', status: 'good' });
  const [showForm, setShowForm] = useState(false);
  const f = k => v => setForm(p => ({ ...p, [k]: v }));
  useEffect(() => { load(); }, []);
  const load = async () => { setLoading(true); try { const r = await fetch(`${API}/ops/assets`, { headers: h(currentUser) }).then(r => r.json()); if (r.success) setAssets(r.data || []); } catch {} setLoading(false); };
  const handleAdd = async (e) => { e.preventDefault(); await fetch(`${API}/ops/assets`, { method: 'POST', headers: h(currentUser), body: JSON.stringify(form) }); setShowForm(false); load(); };
  return (
    <ToolPage title="Asset Tracker" subtitle="Track school inventory & assets" onRefresh={load} loading={loading} actions={<ActionBtn label="Add Asset" onClick={() => setShowForm(true)} icon={<Plus size={11} />} />}>
      {showForm && (
        <div style={{ background: '#161622', border: '1px solid #222230', borderRadius: 11, padding: 20, marginBottom: 16 }}>
          <form onSubmit={handleAdd}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <FormField label="Name" value={form.name} onChange={f('name')} placeholder="Item name" required />
              <FormField label="Category" type="select" value={form.category} onChange={f('category')} options={['furniture', 'electronics', 'lab', 'sports', 'library', 'other'].map(v => ({ value: v, label: v }))} />
              <FormField label="Quantity" type="number" value={form.quantity} onChange={f('quantity')} />
              <FormField label="Location" value={form.location} onChange={f('location')} placeholder="e.g. Room 12" />
            </div>
            <div style={{ display: 'flex', gap: 8 }}><ActionBtn label="Add" /><ActionBtn label="Cancel" variant="secondary" onClick={() => setShowForm(false)} /></div>
          </form>
        </div>
      )}
      <DataTable headers={['Name', 'Category', 'Quantity', 'Location', 'Status']}
        rows={assets.map(a => [a.name, a.category, a.quantity, a.location || 'N/A', <Badge text={a.status} color={a.status === 'good' ? 'green' : a.status === 'needs_repair' ? 'yellow' : 'red'} />])}
        emptyMsg="No assets logged"
      />
    </ToolPage>
  );
}
export function VisitorLog() {
  const { currentUser } = useUser();
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ visitor_name: '', phone: '', purpose: '', whom_to_meet: '' });
  const [showForm, setShowForm] = useState(false);
  const f = k => v => setForm(p => ({ ...p, [k]: v }));
  useEffect(() => { load(); }, []);
  const load = async () => { setLoading(true); try { const r = await fetch(`${API}/ops/visitors`, { headers: h(currentUser) }).then(r => r.json()); if (r.success) setVisitors(r.data || []); } catch {} setLoading(false); };
  const handleLog = async (e) => { e.preventDefault(); await fetch(`${API}/ops/visitors`, { method: 'POST', headers: h(currentUser), body: JSON.stringify(form) }); setShowForm(false); setForm({ visitor_name: '', phone: '', purpose: '', whom_to_meet: '' }); load(); };
  const checkout = async (id) => { await fetch(`${API}/ops/visitors/${id}/checkout`, { method: 'PATCH', headers: h(currentUser) }); load(); };
  return (
    <ToolPage title="Visitor Log" subtitle="Track school entry & exit" onRefresh={load} loading={loading} actions={<ActionBtn label="Log Visitor" onClick={() => setShowForm(true)} icon={<Plus size={11} />} />}>
      {showForm && (
        <div style={{ background: '#161622', border: '1px solid #222230', borderRadius: 11, padding: 20, marginBottom: 16 }}>
          <form onSubmit={handleLog}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <FormField label="Visitor Name" value={form.visitor_name} onChange={f('visitor_name')} placeholder="Full name" required />
              <FormField label="Phone" type="tel" value={form.phone} onChange={f('phone')} placeholder="Mobile number" />
              <FormField label="Purpose" value={form.purpose} onChange={f('purpose')} placeholder="Reason for visit" required />
              <FormField label="Whom to Meet" value={form.whom_to_meet} onChange={f('whom_to_meet')} placeholder="Staff/department" />
            </div>
            <div style={{ display: 'flex', gap: 8 }}><ActionBtn label="Log Entry" /><ActionBtn label="Cancel" variant="secondary" onClick={() => setShowForm(false)} /></div>
          </form>
        </div>
      )}
      <DataTable headers={['Visitor', 'Purpose', 'Meet', 'Time In', 'Time Out', 'Action']}
        rows={visitors.map(v => [v.visitor_name, v.purpose, v.whom_to_meet || 'N/A', v.time_in?.slice(11, 16) || 'N/A', v.time_out ? v.time_out.slice(11, 16) : <Badge text="In" color="yellow" />, !v.time_out ? <button onClick={() => checkout(v.id)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 5, padding: '3px 8px', color: '#EF4444', fontSize: 10, cursor: 'pointer' }}>Check Out</button> : null])}
      />
    </ToolPage>
  );
}
export function TransportManager() {
  const { currentUser } = useUser();
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ route_name: '', driver_name: '', vehicle_no: '' });
  const [showForm, setShowForm] = useState(false);
  const f = k => v => setForm(p => ({ ...p, [k]: v }));
  useEffect(() => { fetch(`${API}/ops/transport`, { headers: h(currentUser) }).then(r => r.json()).then(r => { if (r.success) setRoutes(r.data || []); }).finally(() => setLoading(false)); }, []);
  const handleAdd = async (e) => { e.preventDefault(); await fetch(`${API}/ops/transport`, { method: 'POST', headers: h(currentUser), body: JSON.stringify(form) }); setShowForm(false); window.location.reload(); };
  return (
    <ToolPage title="Transport Manager" subtitle="Manage bus routes & vehicles" loading={loading} actions={<ActionBtn label="Add Route" onClick={() => setShowForm(true)} icon={<Plus size={11} />} />}>
      {showForm && (
        <div style={{ background: '#161622', border: '1px solid #222230', borderRadius: 11, padding: 20, marginBottom: 16 }}>
          <form onSubmit={handleAdd}>
            <FormField label="Route Name" value={form.route_name} onChange={f('route_name')} placeholder="e.g. Route 1 - City Center" required />
            <FormField label="Driver Name" value={form.driver_name} onChange={f('driver_name')} />
            <FormField label="Vehicle No." value={form.vehicle_no} onChange={f('vehicle_no')} placeholder="UP32 XXXX" />
            <div style={{ display: 'flex', gap: 8 }}><ActionBtn label="Add Route" /><ActionBtn label="Cancel" variant="secondary" onClick={() => setShowForm(false)} /></div>
          </form>
        </div>
      )}
      <DataTable headers={['Route Name', 'Driver', 'Vehicle', 'Status']}
        rows={routes.map(r => [r.route_name, r.driver_name || 'N/A', r.vehicle_no || 'N/A', <Badge text={r.is_active ? 'Active' : 'Inactive'} color={r.is_active ? 'green' : 'gray'} />])}
        emptyMsg="No transport routes configured"
      />
    </ToolPage>
  );
}
export function AutomatedReport() { return <ComingSoon toolName="Automated Report Generator (Phase 3)" />; }
export function CustomFormBuilder() { return <ComingSoon toolName="Custom Form Builder (Phase 4)" />; }
export function PayrollPreparer() { return <ComingSoon toolName="Payroll Data Preparer (Phase 4)" />; }
