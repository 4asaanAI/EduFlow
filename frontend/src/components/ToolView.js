import { useState } from 'react';
import {
  Clock, IndianRupee, Users, BarChart3, AlertTriangle, FileText, Activity,
  Megaphone, ClipboardList, UserPlus, Upload, Send, Download, Filter,
  Bell, Sliders, ChevronDown, Search, Calendar, Check, X, Plus, Eye
} from 'lucide-react';
import { toast } from 'sonner';

const iconMap = { Clock, IndianRupee, Users, BarChart3, AlertTriangle, FileText, Activity, Megaphone, ClipboardList, UserPlus };

function ToolCard({ children, className = '' }) {
  return <div className={`ef-tool-card ${className}`}>{children}</div>;
}

function EmptyState({ icon: Icon, text }) {
  return (
    <div className="ef-empty-state">
      <Icon size={40} strokeWidth={1} />
      <p>{text}</p>
    </div>
  );
}

function SchoolPulse() {
  return (
    <div className="ef-tool-grid">
      <ToolCard>
        <h3 className="ef-tc-title font-heading">Quick Actions</h3>
        <div className="ef-tc-actions-grid">
          <button className="ef-tc-action-card" data-testid="pulse-mark-attendance" onClick={() => toast.success('Attendance marked for today')}>
            <Users size={20} /> <span>Mark Today's Attendance</span>
          </button>
          <button className="ef-tc-action-card" data-testid="pulse-send-reminder" onClick={() => toast.success('Fee reminders sent')}>
            <Bell size={20} /> <span>Send Fee Reminders</span>
          </button>
          <button className="ef-tc-action-card" data-testid="pulse-view-alerts" onClick={() => toast.info('3 critical alerts active')}>
            <AlertTriangle size={20} /> <span>View Active Alerts</span>
          </button>
          <button className="ef-tc-action-card" data-testid="pulse-gen-report" onClick={() => toast.success('Report generation started')}>
            <FileText size={20} /> <span>Generate Daily Report</span>
          </button>
        </div>
        <div className="ef-tc-field">
          <label>Set Attendance Alert Threshold</label>
          <div className="ef-tc-threshold">
            <input type="range" min="50" max="100" defaultValue="85" className="ef-tc-slider" data-testid="pulse-threshold" />
            <span className="ef-tc-threshold-val">85%</span>
          </div>
        </div>
        <button className="ef-tc-primary-btn" data-testid="pulse-submit" onClick={() => toast.success('Settings saved')}>Save Settings</button>
      </ToolCard>
      <ToolCard>
        <h3 className="ef-tc-title font-heading">Today's Snapshot</h3>
        <div className="ef-tc-mini-stats">
          <div className="ef-tc-mini-stat"><span className="ef-tc-ms-val" style={{color:'var(--green)'}}>91%</span><span className="ef-tc-ms-label">Attendance</span></div>
          <div className="ef-tc-mini-stat"><span className="ef-tc-ms-val">438</span><span className="ef-tc-ms-label">Enrolled</span></div>
          <div className="ef-tc-mini-stat"><span className="ef-tc-ms-val" style={{color:'var(--green)'}}>₹2.8L</span><span className="ef-tc-ms-label">Fees (Mar)</span></div>
          <div className="ef-tc-mini-stat"><span className="ef-tc-ms-val" style={{color:'var(--red)'}}>₹1.4L</span><span className="ef-tc-ms-label">Overdue</span></div>
        </div>
        <div className="ef-tc-alert-list">
          <div className="ef-tc-alert-item critical"><AlertTriangle size={14}/> 3 teachers absent today</div>
          <div className="ef-tc-alert-item warning"><AlertTriangle size={14}/> 12 students absent 3+ days</div>
          <div className="ef-tc-alert-item success"><Check size={14}/> Fee collection up 8% vs Feb</div>
        </div>
      </ToolCard>
    </div>
  );
}

function FeeCollection() {
  return (
    <div className="ef-tool-grid">
      <ToolCard>
        <h3 className="ef-tc-title font-heading">Fee Collection Manager</h3>
        <div className="ef-tc-field"><label>Select Class</label>
          <select className="ef-tc-select" data-testid="fee-class-select"><option>All Classes</option><option>Class 10</option><option>Class 9</option><option>Class 8</option><option>Class 7</option><option>Class 6</option></select>
        </div>
        <div className="ef-tc-field"><label>Fee Period</label>
          <select className="ef-tc-select" data-testid="fee-period-select"><option>March 2026</option><option>February 2026</option><option>January 2026</option></select>
        </div>
        <div className="ef-tc-field"><label>Filter</label>
          <select className="ef-tc-select" data-testid="fee-filter"><option>All Students</option><option>Defaulters Only</option><option>Paid</option><option>Partial Payment</option></select>
        </div>
        <button className="ef-tc-primary-btn" data-testid="fee-send-reminders" onClick={() => toast.success('Payment reminders sent to 34 defaulters')}><Send size={16}/> Send Payment Reminders</button>
        <button className="ef-tc-secondary-btn" data-testid="fee-download" onClick={() => toast.success('Report downloaded')}><Download size={16}/> Download Report</button>
      </ToolCard>
      <ToolCard>
        <h3 className="ef-tc-title font-heading">Fee Status Summary</h3>
        <div className="ef-tc-mini-stats">
          <div className="ef-tc-mini-stat"><span className="ef-tc-ms-val" style={{color:'var(--green)'}}>₹3.12L</span><span className="ef-tc-ms-label">Collected</span></div>
          <div className="ef-tc-mini-stat"><span className="ef-tc-ms-val" style={{color:'var(--red)'}}>₹1.42L</span><span className="ef-tc-ms-label">Overdue</span></div>
          <div className="ef-tc-mini-stat"><span className="ef-tc-ms-val">86%</span><span className="ef-tc-ms-label">Collection Rate</span></div>
          <div className="ef-tc-mini-stat"><span className="ef-tc-ms-val" style={{color:'var(--orange)'}}>34</span><span className="ef-tc-ms-label">Defaulters</span></div>
        </div>
        <div className="ef-tc-table-wrap">
          <table className="ef-table"><thead><tr><th>Student</th><th>Class</th><th>Overdue</th><th>Days</th></tr></thead>
          <tbody>
            <tr><td>Rahul Gupta</td><td>10A</td><td style={{color:'var(--red)'}}>₹18,500</td><td>92</td></tr>
            <tr><td>Sneha Kumari</td><td>8B</td><td style={{color:'var(--red)'}}>₹15,000</td><td>78</td></tr>
            <tr><td>Amit Singh</td><td>9A</td><td style={{color:'var(--orange)'}}>₹12,000</td><td>65</td></tr>
            <tr><td>Pooja Yadav</td><td>7C</td><td style={{color:'var(--orange)'}}>₹11,500</td><td>45</td></tr>
          </tbody></table>
        </div>
      </ToolCard>
    </div>
  );
}

function StaffTracker() {
  return (
    <div className="ef-tool-grid">
      <ToolCard>
        <h3 className="ef-tc-title font-heading">Staff Attendance Manager</h3>
        <div className="ef-tc-upload-zone" data-testid="staff-upload">
          <Upload size={32} strokeWidth={1.2} />
          <p>Upload Attendance Sheet</p>
          <span>CSV, Excel or PDF supported</span>
        </div>
        <div className="ef-tc-field"><label>Select Date</label>
          <input type="date" className="ef-tc-input" defaultValue="2026-03-30" data-testid="staff-date" />
        </div>
        <div className="ef-tc-field"><label>Department</label>
          <select className="ef-tc-select" data-testid="staff-dept"><option>All Departments</option><option>Teaching Staff</option><option>Admin Staff</option><option>Support Staff</option></select>
        </div>
        <button className="ef-tc-primary-btn" data-testid="staff-submit" onClick={() => toast.success('Attendance report generated')}>Generate Report</button>
      </ToolCard>
      <ToolCard>
        <h3 className="ef-tc-title font-heading">Staff Status</h3>
        <div className="ef-tc-mini-stats">
          <div className="ef-tc-mini-stat"><span className="ef-tc-ms-val">28</span><span className="ef-tc-ms-label">Total Staff</span></div>
          <div className="ef-tc-mini-stat"><span className="ef-tc-ms-val" style={{color:'var(--green)'}}>89%</span><span className="ef-tc-ms-label">Present</span></div>
          <div className="ef-tc-mini-stat"><span className="ef-tc-ms-val" style={{color:'var(--red)'}}>4</span><span className="ef-tc-ms-label">Late 3+ Times</span></div>
          <div className="ef-tc-mini-stat"><span className="ef-tc-ms-val" style={{color:'var(--orange)'}}>2</span><span className="ef-tc-ms-label">Pending Leaves</span></div>
        </div>
        <div className="ef-tc-table-wrap">
          <table className="ef-table"><thead><tr><th>Staff</th><th>Role</th><th>Status</th></tr></thead>
          <tbody>
            <tr><td>Sunita Devi</td><td>Teacher (Hindi)</td><td style={{color:'var(--red)'}}>Absent - No Leave</td></tr>
            <tr><td>Manoj Kumar</td><td>Teacher (Math)</td><td style={{color:'var(--orange)'}}>Late Arrival</td></tr>
            <tr><td>Ankit Sharma</td><td>Lab Assistant</td><td style={{color:'var(--orange)'}}>Late Arrival</td></tr>
            <tr><td>Priya Verma</td><td>Teacher (Sci)</td><td style={{color:'var(--green)'}}>Present</td></tr>
          </tbody></table>
        </div>
      </ToolCard>
    </div>
  );
}

function SmartAnalytics() {
  return (
    <div className="ef-tool-grid">
      <ToolCard>
        <h3 className="ef-tc-title font-heading">Analytics Generator</h3>
        <div className="ef-tc-field"><label>Select Metric</label>
          <select className="ef-tc-select" data-testid="analytics-metric"><option>Enrollment Trends</option><option>Attendance Patterns</option><option>Academic Performance</option><option>Fee Collection Trends</option><option>Staff Attendance</option></select>
        </div>
        <div className="ef-tc-field"><label>Time Period</label>
          <select className="ef-tc-select" data-testid="analytics-period"><option>Last 6 Months</option><option>Last 3 Months</option><option>This Year</option><option>Custom Range</option></select>
        </div>
        <div className="ef-tc-field"><label>Class / Section</label>
          <input type="text" className="ef-tc-input" placeholder="e.g., Grade 10-A" data-testid="analytics-class" />
        </div>
        <button className="ef-tc-primary-btn" data-testid="analytics-generate" onClick={() => toast.success('Analytics report generated')}><BarChart3 size={16}/> Generate Analytics</button>
      </ToolCard>
      <ToolCard>
        <h3 className="ef-tc-title font-heading">Preview</h3>
        <EmptyState icon={BarChart3} text="Generate analytics to see charts" />
      </ToolCard>
    </div>
  );
}

function SmartAlerts() {
  return (
    <div className="ef-tool-grid">
      <ToolCard>
        <h3 className="ef-tc-title font-heading">Alert Configuration</h3>
        <div className="ef-tc-field"><label>Attendance Alert Threshold</label>
          <div className="ef-tc-threshold"><input type="range" min="50" max="100" defaultValue="75" className="ef-tc-slider" /><span className="ef-tc-threshold-val">75%</span></div>
        </div>
        <div className="ef-tc-field"><label>Fee Overdue Alert (days)</label>
          <div className="ef-tc-threshold"><input type="range" min="7" max="120" defaultValue="30" className="ef-tc-slider" /><span className="ef-tc-threshold-val">30 days</span></div>
        </div>
        <div className="ef-tc-field"><label>Notification Channels</label>
          <div className="ef-tc-check-group">
            <label className="ef-tc-check"><input type="checkbox" defaultChecked /> WhatsApp</label>
            <label className="ef-tc-check"><input type="checkbox" defaultChecked /> SMS</label>
            <label className="ef-tc-check"><input type="checkbox" /> Email</label>
          </div>
        </div>
        <button className="ef-tc-primary-btn" data-testid="alerts-save" onClick={() => toast.success('Alert settings saved')}><Sliders size={16}/> Save Configuration</button>
      </ToolCard>
      <ToolCard>
        <h3 className="ef-tc-title font-heading">Active Alerts</h3>
        <div className="ef-tc-alert-list">
          <div className="ef-tc-alert-item critical"><AlertTriangle size={14}/> Sunita Devi — 3rd unauthorized absence</div>
          <div className="ef-tc-alert-item critical"><AlertTriangle size={14}/> Rahul Gupta — ₹18,500 overdue (92 days)</div>
          <div className="ef-tc-alert-item critical"><AlertTriangle size={14}/> Class 6B math scores dropped 12%</div>
          <div className="ef-tc-alert-item warning"><AlertTriangle size={14}/> Manoj Kumar late 4 days this week</div>
          <div className="ef-tc-alert-item warning"><AlertTriangle size={14}/> 8 students 60+ days overdue</div>
          <div className="ef-tc-alert-item warning"><AlertTriangle size={14}/> Science lab maintenance due</div>
          <div className="ef-tc-alert-item info"><Bell size={14}/> Board exam schedule released</div>
          <div className="ef-tc-alert-item info"><Bell size={14}/> Annual day planning deadline next week</div>
        </div>
      </ToolCard>
    </div>
  );
}

function FinancialReports() {
  return (
    <div className="ef-tool-grid">
      <ToolCard>
        <h3 className="ef-tc-title font-heading">Report Generator</h3>
        <div className="ef-tc-field"><label>Select Report Type</label>
          <select className="ef-tc-select" data-testid="finance-type"><option>Profit & Loss Statement</option><option>Income Summary</option><option>Expense Breakdown</option><option>Budget vs Actual</option><option>Cash Flow Report</option></select>
        </div>
        <div className="ef-tc-field"><label>Period</label>
          <select className="ef-tc-select" data-testid="finance-period"><option>Q4 (Jan-Mar 2026)</option><option>Q3 (Oct-Dec 2025)</option><option>FY 2025-26</option><option>Custom Range</option></select>
        </div>
        <div className="ef-tc-field"><label>Export As</label>
          <div className="ef-tc-export-btns">
            <button className="ef-tc-export-btn active" data-testid="finance-pdf"><FileText size={14}/> PDF</button>
            <button className="ef-tc-export-btn" data-testid="finance-excel"><FileText size={14}/> Excel</button>
          </div>
        </div>
        <button className="ef-tc-primary-btn" data-testid="finance-generate" onClick={() => toast.success('Financial report generated')}><Activity size={16}/> Generate Report</button>
      </ToolCard>
      <ToolCard>
        <h3 className="ef-tc-title font-heading">Preview</h3>
        <EmptyState icon={FileText} text="Generate a report to see preview" />
      </ToolCard>
    </div>
  );
}

function AIHealthReport() {
  return (
    <div className="ef-tool-grid">
      <ToolCard>
        <h3 className="ef-tc-title font-heading">Health Report Generator</h3>
        <div className="ef-tc-field"><label>Report Period</label>
          <select className="ef-tc-select" data-testid="health-period"><option>This Week (24-30 Mar)</option><option>Last Week</option><option>This Month</option><option>Custom Range</option></select>
        </div>
        <div className="ef-tc-field"><label>Include Sections</label>
          <div className="ef-tc-check-group">
            <label className="ef-tc-check"><input type="checkbox" defaultChecked /> Attendance Analysis</label>
            <label className="ef-tc-check"><input type="checkbox" defaultChecked /> Academic Performance</label>
            <label className="ef-tc-check"><input type="checkbox" defaultChecked /> Financial Health</label>
            <label className="ef-tc-check"><input type="checkbox" defaultChecked /> Staff Reliability</label>
            <label className="ef-tc-check"><input type="checkbox" defaultChecked /> Parent Engagement</label>
          </div>
        </div>
        <button className="ef-tc-primary-btn" data-testid="health-generate" onClick={() => toast.success('AI health report generating...')}><Activity size={16}/> Generate AI Report</button>
      </ToolCard>
      <ToolCard>
        <h3 className="ef-tc-title font-heading">Health Score</h3>
        <div className="ef-tc-health-score">
          <div className="ef-tc-score-circle"><span className="ef-tc-score-num font-heading">84</span><span className="ef-tc-score-max">/100</span></div>
          <p className="ef-tc-score-label">Overall School Health</p>
        </div>
        <div className="ef-tc-alert-list">
          <div className="ef-tc-alert-item success"><Check size={14}/> Attendance: 88/100 (+2%)</div>
          <div className="ef-tc-alert-item warning"><AlertTriangle size={14}/> Academics: 76/100 (-1%)</div>
          <div className="ef-tc-alert-item critical"><AlertTriangle size={14}/> Staff: 80/100 (-3%)</div>
          <div className="ef-tc-alert-item success"><Check size={14}/> Finance: 85/100 (+4%)</div>
          <div className="ef-tc-alert-item success"><Check size={14}/> Parents: 82/100 (+1%)</div>
        </div>
      </ToolCard>
    </div>
  );
}

function Announcements() {
  return (
    <div className="ef-tool-grid">
      <ToolCard>
        <h3 className="ef-tc-title font-heading">Create Announcement</h3>
        <div className="ef-tc-field"><label>Message</label>
          <textarea className="ef-tc-textarea" placeholder="Type your announcement here..." rows={4} data-testid="announce-message" />
        </div>
        <div className="ef-tc-field"><label>Target Audience</label>
          <select className="ef-tc-select" data-testid="announce-audience"><option>All Parents</option><option>Class 10 Parents</option><option>Defaulters Only</option><option>Staff Only</option><option>Custom Group</option></select>
        </div>
        <div className="ef-tc-field"><label>Channel</label>
          <div className="ef-tc-check-group">
            <label className="ef-tc-check"><input type="checkbox" defaultChecked /> WhatsApp</label>
            <label className="ef-tc-check"><input type="checkbox" /> SMS</label>
            <label className="ef-tc-check"><input type="checkbox" /> App Notification</label>
          </div>
        </div>
        <button className="ef-tc-primary-btn" data-testid="announce-send" onClick={() => toast.success('Announcement sent to 438 recipients')}><Send size={16}/> Send Announcement</button>
      </ToolCard>
      <ToolCard>
        <h3 className="ef-tc-title font-heading">Recent Announcements</h3>
        <div className="ef-tc-table-wrap">
          <table className="ef-table"><thead><tr><th>Announcement</th><th>Sent</th><th>Read</th></tr></thead>
          <tbody>
            <tr><td>Annual Day — April 15</td><td>28 Mar</td><td style={{color:'var(--green)'}}>92%</td></tr>
            <tr><td>Board exam timetable</td><td>27 Mar</td><td style={{color:'var(--green)'}}>95%</td></tr>
            <tr><td>Fee reminder — March</td><td>25 Mar</td><td style={{color:'var(--orange)'}}>78%</td></tr>
          </tbody></table>
        </div>
      </ToolCard>
    </div>
  );
}

function LeaveManager() {
  const [requests] = useState([
    { name: 'Ramesh (Peon)', type: 'Casual', dates: '1-3 Apr', reason: 'Family wedding', days: 3 },
    { name: 'Deepa Sinha', type: 'Medical', dates: '2-4 Apr', reason: 'Doctor appointment', days: 3 },
    { name: 'Ravi Tiwari', type: 'Casual', dates: '3 Apr', reason: 'Personal work', days: 1 },
    { name: 'Meera Joshi', type: 'Earned', dates: '7-11 Apr', reason: 'Family travel', days: 5 },
    { name: 'Rajesh Pandey', type: 'Medical', dates: '4-5 Apr', reason: 'Surgery follow-up', days: 2 },
  ]);

  return (
    <div className="ef-tool-grid">
      <ToolCard>
        <h3 className="ef-tc-title font-heading">Leave Approval Queue</h3>
        <div className="ef-tc-field"><label>Filter</label>
          <select className="ef-tc-select" data-testid="leave-filter"><option>Pending Only</option><option>All Requests</option><option>Approved</option><option>Rejected</option></select>
        </div>
        <div className="ef-tc-leave-list">
          {requests.map((r, i) => (
            <div key={i} className="ef-tc-leave-item">
              <div className="ef-tc-leave-info">
                <strong>{r.name}</strong>
                <span>{r.type} · {r.dates} · {r.reason}</span>
              </div>
              <div className="ef-tc-leave-actions">
                <button className="ef-tc-approve-btn" data-testid={`leave-approve-${i}`} onClick={() => toast.success(`${r.name}'s leave approved`)}><Check size={14}/></button>
                <button className="ef-tc-reject-btn" data-testid={`leave-reject-${i}`} onClick={() => toast.error(`${r.name}'s leave rejected`)}><X size={14}/></button>
              </div>
            </div>
          ))}
        </div>
      </ToolCard>
      <ToolCard>
        <h3 className="ef-tc-title font-heading">Leave Summary</h3>
        <div className="ef-tc-mini-stats">
          <div className="ef-tc-mini-stat"><span className="ef-tc-ms-val" style={{color:'var(--orange)'}}>5</span><span className="ef-tc-ms-label">Pending</span></div>
          <div className="ef-tc-mini-stat"><span className="ef-tc-ms-val" style={{color:'var(--green)'}}>12</span><span className="ef-tc-ms-label">Approved (Mar)</span></div>
          <div className="ef-tc-mini-stat"><span className="ef-tc-ms-val" style={{color:'var(--red)'}}>3</span><span className="ef-tc-ms-label">Rejected (Mar)</span></div>
          <div className="ef-tc-mini-stat"><span className="ef-tc-ms-val">22</span><span className="ef-tc-ms-label">Total (Mar)</span></div>
        </div>
        <button className="ef-tc-secondary-btn" onClick={() => toast.success('Approved all short leaves')}><Check size={16}/> Approve All Short Leaves (≤2 days)</button>
      </ToolCard>
    </div>
  );
}

function AdmissionFunnel() {
  return (
    <div className="ef-tool-grid">
      <ToolCard>
        <h3 className="ef-tc-title font-heading">New Enquiry</h3>
        <div className="ef-tc-field"><label>Student Name</label>
          <input type="text" className="ef-tc-input" placeholder="Enter student name" data-testid="admission-name" />
        </div>
        <div className="ef-tc-field"><label>Class Applying For</label>
          <select className="ef-tc-select" data-testid="admission-class"><option>Nursery</option><option>LKG</option><option>Class 1</option><option>Class 6</option><option>Class 9</option></select>
        </div>
        <div className="ef-tc-field"><label>Parent Contact</label>
          <input type="text" className="ef-tc-input" placeholder="Phone number" data-testid="admission-phone" />
        </div>
        <div className="ef-tc-field"><label>Source</label>
          <select className="ef-tc-select" data-testid="admission-source"><option>Walk-in</option><option>Referral</option><option>Online</option><option>Social Media</option></select>
        </div>
        <button className="ef-tc-primary-btn" data-testid="admission-add" onClick={() => toast.success('Enquiry added to pipeline')}><Plus size={16}/> Add Enquiry</button>
      </ToolCard>
      <ToolCard>
        <h3 className="ef-tc-title font-heading">Admission Pipeline</h3>
        <div className="ef-tc-mini-stats">
          <div className="ef-tc-mini-stat"><span className="ef-tc-ms-val">85</span><span className="ef-tc-ms-label">Enquiries</span></div>
          <div className="ef-tc-mini-stat"><span className="ef-tc-ms-val" style={{color:'var(--blue)'}}>52</span><span className="ef-tc-ms-label">Applied</span></div>
          <div className="ef-tc-mini-stat"><span className="ef-tc-ms-val" style={{color:'var(--green)'}}>38</span><span className="ef-tc-ms-label">Admitted</span></div>
          <div className="ef-tc-mini-stat"><span className="ef-tc-ms-val" style={{color:'var(--green)'}}>62%</span><span className="ef-tc-ms-label">Conversion</span></div>
        </div>
        <div className="ef-tc-table-wrap">
          <table className="ef-table"><thead><tr><th>Class</th><th>Enquiries</th><th>Admitted</th><th>Seats Left</th></tr></thead>
          <tbody>
            <tr><td>Nursery</td><td>22</td><td>12</td><td style={{color:'var(--orange)'}}>8</td></tr>
            <tr><td>LKG</td><td>18</td><td>10</td><td style={{color:'var(--green)'}}>10</td></tr>
            <tr><td>Class 1</td><td>15</td><td>8</td><td style={{color:'var(--green)'}}>12</td></tr>
            <tr><td>Class 6</td><td>12</td><td>5</td><td style={{color:'var(--orange)'}}>5</td></tr>
            <tr><td>Class 9</td><td>10</td><td>2</td><td style={{color:'var(--red)'}}>3</td></tr>
          </tbody></table>
        </div>
      </ToolCard>
    </div>
  );
}

const toolComponents = {
  school_pulse: SchoolPulse,
  fee_collection: FeeCollection,
  staff_tracker: StaffTracker,
  smart_analytics: SmartAnalytics,
  smart_alerts: SmartAlerts,
  financial_reports: FinancialReports,
  ai_health_report: AIHealthReport,
  announcements: Announcements,
  leave_manager: LeaveManager,
  admission_funnel: AdmissionFunnel,
};

export default function ToolView({ toolId, toolName }) {
  const Component = toolComponents[toolId];
  if (!Component) return null;
  return (
    <div className="ef-tool-view" data-testid={`tool-view-${toolId}`}>
      <h1 className="ef-tool-heading font-heading" data-testid="tool-heading">{toolName}</h1>
      <Component />
    </div>
  );
}
