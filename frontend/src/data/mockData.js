export const tools = [
  { id: 'school_pulse', name: 'School pulse', desc: "Today's overview", icon: 'Clock', color: 'blue' },
  { id: 'fee_collection', name: 'Fee collection', desc: 'Revenue & defaulters', icon: 'IndianRupee', color: 'orange' },
  { id: 'staff_tracker', name: 'Staff tracker', desc: 'Attendance & leaves', icon: 'Users', color: 'green' },
  { id: 'smart_analytics', name: 'Smart analytics', desc: 'Trends & insights', icon: 'BarChart3', color: 'purple' },
  { id: 'smart_alerts', name: 'Smart alerts', desc: 'Exceptions & flags', icon: 'AlertTriangle', color: 'red' },
  { id: 'financial_reports', name: 'Financial reports', desc: 'Revenue & expenses', icon: 'FileText', color: 'blue' },
  { id: 'ai_health_report', name: 'AI health report', desc: 'Weekly auto-summary', icon: 'Activity', color: 'orange' },
  { id: 'announcements', name: 'Announcements', desc: 'Broadcast messages', icon: 'Megaphone', color: 'purple' },
  { id: 'leave_manager', name: 'Leave manager', desc: 'Approve / reject', icon: 'ClipboardList', color: 'green' },
  { id: 'admission_funnel', name: 'Admission funnel', desc: 'Enquiries & conversions', icon: 'UserPlus', color: 'blue' },
];

export const conversations = {
  morning_briefing: {
    id: 'morning_briefing',
    title: "Show me today's school status",
    time: 'Just now',
    messages: [
      {
        role: 'ai',
        text: 'Good morning, Aman. Here\'s your <b>Monday briefing</b> for Shakti Shanti Academy.',
        widgets: [
          {
            title: 'School pulse \u2014 Monday, 30 March 2026',
            icon: 'Clock',
            stats: [
              { value: '91%', label: 'Attendance today', color: 'green' },
              { value: '\u20B92.8L', label: 'Fees collected (Mar)', color: '' },
              { value: '\u20B91.4L', label: 'Fees overdue', color: 'orange' },
              { value: '438', label: 'Students enrolled', color: '' },
            ],
            table: {
              headers: ['Alert', 'Status'],
              rows: [
                [{ text: '3 teachers absent today', color: 'red' }, { text: 'Substitutions assigned' }],
                [{ text: '12 students absent 3+ days this week', color: 'orange' }, { text: 'Parents notified via WhatsApp' }],
                [{ text: 'Fee collection up 8% vs Feb', color: 'green' }, { text: 'On track for \u20B93.5L target' }],
              ],
            },
          },
        ],
        followUp: 'Two things need your attention: <b>Ramesh (peon) has a pending leave request</b> for 3 days, and <b>Class 6B\'s math scores dropped 12%</b> in the last unit test. Want me to dig into either?',
      },
      {
        role: 'user',
        text: 'Show me which staff were late or absent this week. Also check who has pending leave requests.',
      },
      {
        role: 'ai',
        text: 'Pulling',
        tags: [
          { name: 'Staff attendance tracker', icon: 'Users' },
          { name: 'Leave manager', icon: 'ClipboardList' },
        ],
        widgets: [
          {
            title: 'Staff report \u2014 week of 24\u201330 March',
            icon: 'Users',
            stats: [
              { value: '28', label: 'Total staff', color: '' },
              { value: '89%', label: 'Avg attendance', color: 'green' },
              { value: '4', label: 'Late 3+ times', color: 'red' },
              { value: '2', label: 'Pending leaves', color: 'orange' },
            ],
            table: {
              headers: ['Staff', 'Role', 'Issue', 'Days'],
              rows: [
                [{ text: 'Sunita Devi' }, { text: 'Teacher (Hindi)' }, { text: 'Absent 2 days, no leave filed', color: 'red' }, { text: 'Tue, Thu' }],
                [{ text: 'Manoj Kumar' }, { text: 'Teacher (Math)' }, { text: 'Late arrival 4 days', color: 'orange' }, { text: 'Mon\u2013Thu' }],
                [{ text: 'Ankit Sharma' }, { text: 'Lab assistant' }, { text: 'Late arrival 3 days', color: 'orange' }, { text: 'Mon, Wed, Fri' }],
                [{ text: 'Priya Verma' }, { text: 'Teacher (Science)' }, { text: 'Absent 1 day (approved)' }, { text: 'Wed' }],
              ],
            },
            subSection: {
              title: 'PENDING LEAVE REQUESTS',
              table: {
                headers: ['Staff', 'Type', 'Dates', 'Reason'],
                rows: [
                  [{ text: 'Ramesh (Peon)' }, { text: 'Casual' }, { text: '1\u20133 Apr' }, { text: 'Family wedding' }],
                  [{ text: 'Deepa Sinha (Admin)' }, { text: 'Medical' }, { text: '2\u20134 Apr' }, { text: 'Doctor appointment' }],
                ],
              },
            },
          },
        ],
        followUp: '<b>Sunita Devi</b> missed 2 days without filing leave \u2014 this is the third time in 2 months. Manoj Kumar has been consistently late since mid-March.',
        actions: ["Approve Ramesh's leave", "Approve Deepa's leave", 'Send warning to Sunita', 'Full punctuality report'],
      },
      {
        role: 'user',
        text: "Approve both leaves. And show me the fee defaulters list \u2014 who owes the most?",
      },
      {
        role: 'ai',
        text: 'Done \u2014 both leaves approved. Ramesh and Deepa have been notified on WhatsApp. Now checking',
        tags: [{ name: 'Fee collection summary', icon: 'IndianRupee' }],
        widgets: [
          {
            title: 'Fee defaulters \u2014 March 2026',
            icon: 'IndianRupee',
            stats: [
              { value: '\u20B91.42L', label: 'Total overdue', color: 'red' },
              { value: '34', label: 'Students with dues', color: '' },
              { value: '8', label: 'Overdue 60+ days', color: 'orange' },
              { value: '86%', label: 'Collection rate', color: 'green' },
            ],
            table: {
              headers: ['Student', 'Class', 'Overdue', 'Days'],
              rows: [
                [{ text: 'Rahul Gupta' }, { text: '10A' }, { text: '\u20B918,500', color: 'red' }, { text: '92 days' }],
                [{ text: 'Sneha Kumari' }, { text: '8B' }, { text: '\u20B915,000', color: 'red' }, { text: '78 days' }],
                [{ text: 'Amit Singh' }, { text: '9A' }, { text: '\u20B912,000', color: 'orange' }, { text: '65 days' }],
                [{ text: 'Pooja Yadav' }, { text: '7C' }, { text: '\u20B911,500', color: 'orange' }, { text: '45 days' }],
                [{ text: 'Vikram Raj' }, { text: '6B' }, { text: '\u20B99,800' }, { text: '30 days' }],
              ],
            },
            footer: '+ 29 more students with pending dues',
          },
        ],
        followUp: 'Top 5 defaulters owe \u20B966,800 combined. <b>Rahul Gupta (Class 10A)</b> is the biggest at \u20B918,500 overdue for 92 days \u2014 3 WhatsApp reminders sent, no response. Want me to send an escalated reminder to his parents, or generate a formal notice?',
        actions: ['Send escalated reminders (top 5)', 'Generate formal notice', 'Full defaulter report (PDF)'],
      },
    ],
  },

  school_pulse: {
    id: 'school_pulse',
    title: "Today's school overview",
    time: '2 hrs ago',
    messages: [
      { role: 'user', text: "Show me today's school overview." },
      {
        role: 'ai',
        text: "Here's your <b>daily school pulse</b> for Shakti Shanti Academy.",
        widgets: [
          {
            title: 'School pulse \u2014 Monday, 30 March 2026',
            icon: 'Clock',
            stats: [
              { value: '91%', label: 'Attendance today', color: 'green' },
              { value: '\u20B92.8L', label: 'Fees collected (Mar)', color: '' },
              { value: '\u20B91.4L', label: 'Fees overdue', color: 'orange' },
              { value: '438', label: 'Students enrolled', color: '' },
            ],
            table: {
              headers: ['Alert', 'Status'],
              rows: [
                [{ text: '3 teachers absent today', color: 'red' }, { text: 'Substitutions assigned' }],
                [{ text: '12 students absent 3+ days', color: 'orange' }, { text: 'Parents notified via WhatsApp' }],
                [{ text: 'Fee collection up 8% vs Feb', color: 'green' }, { text: 'On track for \u20B93.5L target' }],
                [{ text: 'Class 10 board prep on schedule' }, { text: 'Mock test next week' }],
              ],
            },
          },
        ],
        followUp: 'Overall a healthy day. Two items flagged: <b>Ramesh\'s leave request</b> (pending) and <b>Class 6B math scores</b> dropped 12% last unit test.',
        actions: ['Detailed attendance', 'Fee breakdown', 'Academic summary'],
      },
    ],
  },

  fee_collection: {
    id: 'fee_collection',
    title: 'Fee collection report for March',
    time: 'Yesterday',
    messages: [
      { role: 'user', text: 'Show me the fee collection report for March.' },
      {
        role: 'ai',
        text: 'Here\'s the complete <b>fee collection summary</b> for March 2026.',
        tags: [{ name: 'Fee collection summary', icon: 'IndianRupee' }],
        widgets: [
          {
            title: 'Fee collection \u2014 March 2026',
            icon: 'IndianRupee',
            stats: [
              { value: '\u20B93.12L', label: 'Total collected', color: 'green' },
              { value: '\u20B91.42L', label: 'Total overdue', color: 'red' },
              { value: '86%', label: 'Collection rate', color: '' },
              { value: '\u20B93.5L', label: 'Target', color: 'blue' },
            ],
            table: {
              headers: ['Class', 'Students', 'Collected', 'Pending', 'Rate'],
              rows: [
                [{ text: 'Class 10' }, { text: '52' }, { text: '\u20B968,000', color: 'green' }, { text: '\u20B912,000' }, { text: '85%' }],
                [{ text: 'Class 9' }, { text: '48' }, { text: '\u20B955,200', color: 'green' }, { text: '\u20B918,800' }, { text: '75%' }],
                [{ text: 'Class 8' }, { text: '55' }, { text: '\u20B965,000', color: 'green' }, { text: '\u20B99,000' }, { text: '88%' }],
                [{ text: 'Class 7' }, { text: '50' }, { text: '\u20B958,000', color: 'green' }, { text: '\u20B911,500' }, { text: '83%' }],
                [{ text: 'Class 6' }, { text: '45' }, { text: '\u20B952,000', color: 'green' }, { text: '\u20B97,200' }, { text: '88%' }],
              ],
            },
            footer: 'View all classes (1\u201312)',
          },
        ],
        followUp: 'Class 9 has the lowest collection rate at 75%. <b>8 students</b> have overdue fees exceeding 60 days. Shall I generate a detailed defaulter list or send payment reminders?',
        actions: ['View top defaulters', 'Send payment reminders', 'Download report (PDF)', 'Compare with Feb'],
      },
    ],
  },

  staff_tracker: {
    id: 'staff_tracker',
    title: 'Which staff were absent this week?',
    time: '2 hrs ago',
    messages: [
      { role: 'user', text: 'Which staff were absent or late this week?' },
      {
        role: 'ai',
        text: 'Here\'s the <b>staff attendance report</b> for this week.',
        tags: [{ name: 'Staff attendance tracker', icon: 'Users' }],
        widgets: [
          {
            title: 'Staff report \u2014 week of 24\u201330 March',
            icon: 'Users',
            stats: [
              { value: '28', label: 'Total staff', color: '' },
              { value: '89%', label: 'Avg attendance', color: 'green' },
              { value: '4', label: 'Late 3+ times', color: 'red' },
              { value: '2', label: 'Pending leaves', color: 'orange' },
            ],
            table: {
              headers: ['Staff', 'Role', 'Issue', 'Days'],
              rows: [
                [{ text: 'Sunita Devi' }, { text: 'Teacher (Hindi)' }, { text: 'Absent 2 days, no leave filed', color: 'red' }, { text: 'Tue, Thu' }],
                [{ text: 'Manoj Kumar' }, { text: 'Teacher (Math)' }, { text: 'Late arrival 4 days', color: 'orange' }, { text: 'Mon\u2013Thu' }],
                [{ text: 'Ankit Sharma' }, { text: 'Lab assistant' }, { text: 'Late arrival 3 days', color: 'orange' }, { text: 'Mon, Wed, Fri' }],
                [{ text: 'Priya Verma' }, { text: 'Teacher (Science)' }, { text: 'Absent 1 day (approved)' }, { text: 'Wed' }],
              ],
            },
          },
        ],
        followUp: '<b>Sunita Devi</b> has been flagged \u2014 2 absences without leave, third time in 2 months. <b>Manoj Kumar</b> consistently late since mid-March.',
        actions: ['Send warning to Sunita', 'View Manoj\'s history', 'Full punctuality report', 'Staff schedule overview'],
      },
    ],
  },

  smart_analytics: {
    id: 'smart_analytics',
    title: 'Analytics and trends',
    time: '3 days ago',
    messages: [
      { role: 'user', text: 'Show me school analytics and performance trends.' },
      {
        role: 'ai',
        text: 'Here are the <b>key analytics</b> for Shakti Shanti Academy this quarter.',
        tags: [{ name: 'Smart analytics', icon: 'BarChart3' }],
        widgets: [
          {
            title: 'Performance analytics \u2014 Q4 FY2025-26',
            icon: 'BarChart3',
            stats: [
              { value: '438', label: 'Total enrolled', color: '' },
              { value: '+12', label: 'New this month', color: 'green' },
              { value: '91%', label: 'Avg attendance', color: 'green' },
              { value: '78%', label: 'Avg score', color: 'blue' },
            ],
            chart: {
              type: 'line',
              data: [
                { month: 'Oct', students: 412, attendance: 88 },
                { month: 'Nov', students: 418, attendance: 90 },
                { month: 'Dec', students: 425, attendance: 87 },
                { month: 'Jan', students: 430, attendance: 92 },
                { month: 'Feb', students: 435, attendance: 89 },
                { month: 'Mar', students: 438, attendance: 91 },
              ],
            },
            table: {
              headers: ['Subject', 'Avg Score', 'Change', 'Top Class'],
              rows: [
                [{ text: 'Mathematics' }, { text: '76%' }, { text: '-2%', color: 'red' }, { text: '10A (84%)' }],
                [{ text: 'Science' }, { text: '81%' }, { text: '+3%', color: 'green' }, { text: '9A (88%)' }],
                [{ text: 'English' }, { text: '79%' }, { text: '+1%', color: 'green' }, { text: '8B (85%)' }],
                [{ text: 'Hindi' }, { text: '74%' }, { text: '-1%', color: 'orange' }, { text: '7C (80%)' }],
                [{ text: 'Social Studies' }, { text: '77%' }, { text: '+2%', color: 'green' }, { text: '10A (83%)' }],
              ],
            },
          },
        ],
        followUp: '<b>Mathematics</b> scores dropped 2% \u2014 Class 6B and 7C need attention. <b>Science</b> is trending up with a strong 3% improvement. Enrollment is steady with 12 new admissions this month.',
        actions: ['Class-wise breakdown', 'Subject deep-dive', 'Parent report cards', 'Trend comparison'],
      },
    ],
  },

  smart_alerts: {
    id: 'smart_alerts',
    title: 'Urgent alerts and flags',
    time: '4 hrs ago',
    messages: [
      { role: 'user', text: 'Are there any urgent alerts or flags I should know about?' },
      {
        role: 'ai',
        text: 'Here are the <b>active alerts</b> that need your attention.',
        tags: [{ name: 'Smart alerts', icon: 'AlertTriangle' }],
        widgets: [
          {
            title: 'Active alerts \u2014 30 March 2026',
            icon: 'AlertTriangle',
            stats: [
              { value: '3', label: 'Critical', color: 'red' },
              { value: '5', label: 'Warnings', color: 'orange' },
              { value: '2', label: 'Informational', color: 'blue' },
              { value: '10', label: 'Total active', color: '' },
            ],
            table: {
              headers: ['Priority', 'Alert', 'Module', 'Since'],
              rows: [
                [{ text: 'CRITICAL', color: 'red' }, { text: 'Sunita Devi \u2014 3rd unauthorized absence in 2 months' }, { text: 'Staff' }, { text: 'Today' }],
                [{ text: 'CRITICAL', color: 'red' }, { text: 'Rahul Gupta \u2014 \u20B918,500 overdue (92 days)' }, { text: 'Fees' }, { text: '3 days' }],
                [{ text: 'CRITICAL', color: 'red' }, { text: 'Class 6B math scores dropped 12%' }, { text: 'Academic' }, { text: '1 week' }],
                [{ text: 'WARNING', color: 'orange' }, { text: 'Manoj Kumar late 4 days this week' }, { text: 'Staff' }, { text: 'Today' }],
                [{ text: 'WARNING', color: 'orange' }, { text: '8 students with 60+ days fee overdue' }, { text: 'Fees' }, { text: '2 weeks' }],
                [{ text: 'WARNING', color: 'orange' }, { text: 'Science lab equipment maintenance due' }, { text: 'Infra' }, { text: '5 days' }],
                [{ text: 'WARNING', color: 'orange' }, { text: 'Bus #3 insurance renewal in 7 days' }, { text: 'Admin' }, { text: '3 days' }],
                [{ text: 'WARNING', color: 'orange' }, { text: '12 students absent 3+ days this week' }, { text: 'Attendance' }, { text: 'Today' }],
                [{ text: 'INFO', color: 'blue' }, { text: 'Board exam schedule released' }, { text: 'Academic' }, { text: '2 days' }],
                [{ text: 'INFO', color: 'blue' }, { text: 'Annual day planning deadline next week' }, { text: 'Events' }, { text: '1 week' }],
              ],
            },
          },
        ],
        followUp: 'The 3 critical items need immediate action. <b>Sunita Devi</b> has a pattern of unauthorized absences. <b>Rahul Gupta\'s</b> fee situation needs escalation. <b>Class 6B</b> may need additional math support.',
        actions: ['Address staff issue', 'Escalate fee defaulter', 'Review Class 6B', 'Dismiss info alerts'],
      },
    ],
  },

  financial_reports: {
    id: 'financial_reports',
    title: 'Financial summary Q4',
    time: '3 days ago',
    messages: [
      { role: 'user', text: 'Show me the financial summary for this quarter.' },
      {
        role: 'ai',
        text: 'Here\'s the <b>financial overview</b> for Q4 FY2025-26.',
        tags: [{ name: 'Financial reports', icon: 'FileText' }],
        widgets: [
          {
            title: 'Financial summary \u2014 Q4 (Jan\u2013Mar 2026)',
            icon: 'FileText',
            stats: [
              { value: '\u20B912.4L', label: 'Total income', color: 'green' },
              { value: '\u20B98.7L', label: 'Total expenses', color: 'red' },
              { value: '\u20B93.7L', label: 'Surplus', color: 'green' },
              { value: '92%', label: 'Budget utilization', color: 'blue' },
            ],
            table: {
              headers: ['Category', 'Amount', '% of Total', 'vs Last Q'],
              rows: [
                [{ text: 'Tuition fees' }, { text: '\u20B99.8L', color: 'green' }, { text: '79%' }, { text: '+8%', color: 'green' }],
                [{ text: 'Transport fees' }, { text: '\u20B91.2L' }, { text: '10%' }, { text: '+2%', color: 'green' }],
                [{ text: 'Activity fees' }, { text: '\u20B90.8L' }, { text: '6%' }, { text: '-1%', color: 'red' }],
                [{ text: 'Other income' }, { text: '\u20B90.6L' }, { text: '5%' }, { text: '+5%', color: 'green' }],
              ],
            },
            subSection: {
              title: 'TOP EXPENSES',
              table: {
                headers: ['Category', 'Amount', '% of Budget', 'Status'],
                rows: [
                  [{ text: 'Staff salaries' }, { text: '\u20B95.4L' }, { text: '62%' }, { text: 'On budget', color: 'green' }],
                  [{ text: 'Utilities & maintenance' }, { text: '\u20B91.2L' }, { text: '14%' }, { text: 'On budget', color: 'green' }],
                  [{ text: 'Teaching materials' }, { text: '\u20B90.8L' }, { text: '9%' }, { text: 'Slightly over', color: 'orange' }],
                  [{ text: 'Transport ops' }, { text: '\u20B90.7L' }, { text: '8%' }, { text: 'On budget', color: 'green' }],
                  [{ text: 'Miscellaneous' }, { text: '\u20B90.6L' }, { text: '7%' }, { text: 'On budget', color: 'green' }],
                ],
              },
            },
          },
        ],
        followUp: 'Healthy surplus of <b>\u20B93.7L</b> this quarter. Teaching materials budget slightly exceeded \u2014 due to new science lab equipment purchase. Overall budget utilization is strong at 92%.',
        actions: ['Monthly breakdown', 'Expense forecast', 'Download P&L statement', 'Budget vs actual chart'],
      },
    ],
  },

  ai_health_report: {
    id: 'ai_health_report',
    title: 'Weekly health report',
    time: '5 days ago',
    messages: [
      { role: 'user', text: 'Generate the weekly school health report.' },
      {
        role: 'ai',
        text: 'Here\'s the <b>AI-generated weekly health report</b> for Shakti Shanti Academy.',
        tags: [{ name: 'AI health report', icon: 'Activity' }],
        widgets: [
          {
            title: 'School health report \u2014 Week 13 (24\u201330 Mar)',
            icon: 'Activity',
            stats: [
              { value: '84/100', label: 'Health score', color: 'green' },
              { value: '+2%', label: 'Attendance trend', color: 'green' },
              { value: '86%', label: 'Fee compliance', color: 'orange' },
              { value: '91%', label: 'Staff satisfaction', color: 'green' },
            ],
            table: {
              headers: ['Area', 'Score', 'Trend', 'Observation'],
              rows: [
                [{ text: 'Student attendance' }, { text: '88/100', color: 'green' }, { text: '\u2191 +2%', color: 'green' }, { text: 'Improving steadily' }],
                [{ text: 'Academic performance' }, { text: '76/100' }, { text: '\u2193 -1%', color: 'orange' }, { text: 'Math scores need focus' }],
                [{ text: 'Staff reliability' }, { text: '80/100' }, { text: '\u2193 -3%', color: 'red' }, { text: '2 repeated offenders' }],
                [{ text: 'Financial health' }, { text: '85/100', color: 'green' }, { text: '\u2191 +4%', color: 'green' }, { text: 'Collection improving' }],
                [{ text: 'Parent engagement' }, { text: '82/100' }, { text: '\u2191 +1%', color: 'green' }, { text: 'PTM attendance up' }],
                [{ text: 'Infrastructure' }, { text: '90/100', color: 'green' }, { text: '\u2192 0%' }, { text: 'All systems operational' }],
              ],
            },
          },
        ],
        followUp: 'Overall health score is <b>84/100</b> \u2014 a slight improvement from last week (82). Key concerns: <b>staff reliability</b> dropped 3% due to Sunita Devi and Manoj Kumar. <b>Math academic performance</b> continues its downward trend.',
        actions: ['Share with management', 'Drill into staff issues', 'Academic improvement plan', 'Historical comparison'],
      },
    ],
  },

  announcements: {
    id: 'announcements',
    title: 'Recent announcements',
    time: '2 days ago',
    messages: [
      { role: 'user', text: 'Show me recent and upcoming announcements.' },
      {
        role: 'ai',
        text: 'Here are the <b>announcements</b> for Shakti Shanti Academy.',
        tags: [{ name: 'Announcements', icon: 'Megaphone' }],
        widgets: [
          {
            title: 'Announcements \u2014 Active & Scheduled',
            icon: 'Megaphone',
            stats: [
              { value: '3', label: 'Active', color: 'green' },
              { value: '2', label: 'Scheduled', color: 'blue' },
              { value: '438', label: 'Total reach', color: '' },
              { value: '89%', label: 'Read rate', color: 'green' },
            ],
            table: {
              headers: ['Announcement', 'Audience', 'Sent', 'Read Rate'],
              rows: [
                [{ text: 'Annual Day \u2014 April 15 (save the date)' }, { text: 'All parents' }, { text: '28 Mar' }, { text: '92%', color: 'green' }],
                [{ text: 'Class 10 board exam timetable released' }, { text: 'Class 10 parents' }, { text: '27 Mar' }, { text: '95%', color: 'green' }],
                [{ text: 'Fee payment reminder \u2014 March dues' }, { text: 'Defaulters (34)' }, { text: '25 Mar' }, { text: '78%', color: 'orange' }],
              ],
            },
            subSection: {
              title: 'SCHEDULED',
              table: {
                headers: ['Announcement', 'Audience', 'Scheduled For', 'Channel'],
                rows: [
                  [{ text: 'PTM notice \u2014 April 5' }, { text: 'All parents' }, { text: '1 Apr' }, { text: 'WhatsApp + SMS' }],
                  [{ text: 'Summer uniform switch reminder' }, { text: 'All parents' }, { text: '3 Apr' }, { text: 'WhatsApp' }],
                ],
              },
            },
          },
        ],
        followUp: 'All active announcements have good read rates. The fee payment reminder to defaulters has a lower rate (78%) \u2014 consider following up with a phone call for the 34 students.',
        actions: ['Create new announcement', 'Resend to unread', 'Schedule broadcast', 'View all past'],
      },
    ],
  },

  leave_manager: {
    id: 'leave_manager',
    title: 'Pending leave requests',
    time: '1 day ago',
    messages: [
      { role: 'user', text: 'Show me all pending leave requests.' },
      {
        role: 'ai',
        text: 'Here are all <b>pending leave requests</b> awaiting your approval.',
        tags: [{ name: 'Leave manager', icon: 'ClipboardList' }],
        widgets: [
          {
            title: 'Leave requests \u2014 Pending approval',
            icon: 'ClipboardList',
            stats: [
              { value: '5', label: 'Pending', color: 'orange' },
              { value: '2', label: 'Urgent', color: 'red' },
              { value: '12', label: 'Approved (Mar)', color: 'green' },
              { value: '3', label: 'Rejected (Mar)', color: '' },
            ],
            table: {
              headers: ['Staff', 'Role', 'Type', 'Dates', 'Reason', 'Days'],
              rows: [
                [{ text: 'Ramesh (Peon)' }, { text: 'Support' }, { text: 'Casual' }, { text: '1\u20133 Apr' }, { text: 'Family wedding' }, { text: '3' }],
                [{ text: 'Deepa Sinha' }, { text: 'Admin' }, { text: 'Medical' }, { text: '2\u20134 Apr' }, { text: 'Doctor appointment' }, { text: '3' }],
                [{ text: 'Ravi Tiwari' }, { text: 'Teacher (PE)' }, { text: 'Casual' }, { text: '3 Apr' }, { text: 'Personal work' }, { text: '1' }],
                [{ text: 'Meera Joshi' }, { text: 'Teacher (Art)' }, { text: 'Earned' }, { text: '7\u201311 Apr' }, { text: 'Family travel' }, { text: '5' }],
                [{ text: 'Rajesh Pandey' }, { text: 'Accountant' }, { text: 'Medical' }, { text: '4\u20135 Apr' }, { text: 'Surgery follow-up' }, { text: '2' }],
              ],
            },
          },
        ],
        followUp: '<b>Ramesh</b> and <b>Deepa</b> are urgent \u2014 their leaves start in 2 days. <b>Meera Joshi\'s</b> 5-day request overlaps with the Annual Day planning week. Consider approving the short leaves first.',
        actions: ['Approve all short leaves', 'Approve Ramesh', 'Approve Deepa', 'Reject Meera (conflict)', 'View leave balance'],
      },
    ],
  },

  admission_funnel: {
    id: 'admission_funnel',
    title: 'Admission status 2026-27',
    time: '1 week ago',
    messages: [
      { role: 'user', text: 'Show me the admission funnel for the upcoming session.' },
      {
        role: 'ai',
        text: 'Here\'s the <b>admission pipeline</b> for session 2026-27.',
        tags: [{ name: 'Admission funnel', icon: 'UserPlus' }],
        widgets: [
          {
            title: 'Admission funnel \u2014 Session 2026-27',
            icon: 'UserPlus',
            stats: [
              { value: '85', label: 'Total enquiries', color: '' },
              { value: '52', label: 'Applications', color: 'blue' },
              { value: '38', label: 'Admitted', color: 'green' },
              { value: '62%', label: 'Conversion rate', color: 'green' },
            ],
            table: {
              headers: ['Class', 'Enquiries', 'Applied', 'Admitted', 'Seats Left'],
              rows: [
                [{ text: 'Nursery' }, { text: '22' }, { text: '15' }, { text: '12' }, { text: '8', color: 'orange' }],
                [{ text: 'LKG' }, { text: '18' }, { text: '12' }, { text: '10' }, { text: '10', color: 'green' }],
                [{ text: 'Class 1' }, { text: '15' }, { text: '10' }, { text: '8' }, { text: '12', color: 'green' }],
                [{ text: 'Class 6' }, { text: '12' }, { text: '8' }, { text: '5' }, { text: '5', color: 'orange' }],
                [{ text: 'Class 9' }, { text: '10' }, { text: '5' }, { text: '2' }, { text: '3', color: 'red' }],
                [{ text: 'Others' }, { text: '8' }, { text: '2' }, { text: '1' }, { text: 'Varies' }],
              ],
            },
          },
        ],
        followUp: 'Strong enrollment so far with <b>38 admissions</b> confirmed. <b>Nursery</b> and <b>Class 6</b> seats are filling up fast. <b>Class 9</b> has low conversion \u2014 only 2 out of 10 enquiries converted. Consider targeted outreach.',
        actions: ['View pending applications', 'Send follow-up to enquiries', 'Seat availability report', 'Admission revenue forecast'],
      },
    ],
  },
};

export const defaultHistory = [
  { id: 'morning_briefing', title: "Show me today's school status", time: 'Just now' },
  { id: 'staff_tracker', title: 'Which staff were absent this week?', time: '2 hrs ago' },
  { id: 'fee_collection', title: 'Fee collection report for March', time: 'Yesterday' },
];

export const keywordMap = {
  fee: 'fee_collection', payment: 'fee_collection', dues: 'fee_collection', defaulter: 'fee_collection',
  staff: 'staff_tracker', teacher: 'staff_tracker', absent: 'staff_tracker', late: 'staff_tracker', attendance: 'staff_tracker',
  analytics: 'smart_analytics', trend: 'smart_analytics', performance: 'smart_analytics', score: 'smart_analytics', grade: 'smart_analytics',
  alert: 'smart_alerts', warning: 'smart_alerts', urgent: 'smart_alerts', flag: 'smart_alerts',
  finance: 'financial_reports', budget: 'financial_reports', income: 'financial_reports', expense: 'financial_reports', revenue: 'financial_reports',
  health: 'ai_health_report', weekly: 'ai_health_report', summary: 'ai_health_report',
  announce: 'announcements', broadcast: 'announcements', notice: 'announcements',
  leave: 'leave_manager', approve: 'leave_manager', reject: 'leave_manager',
  admission: 'admission_funnel', enroll: 'admission_funnel', enquir: 'admission_funnel', funnel: 'admission_funnel',
  pulse: 'school_pulse', overview: 'school_pulse', status: 'school_pulse', school: 'school_pulse',
};

export const students = [
  { name: 'Rahul Gupta', class: '10A' },
  { name: 'Sneha Kumari', class: '8B' },
  { name: 'Amit Singh', class: '9A' },
  { name: 'Pooja Yadav', class: '7C' },
  { name: 'Vikram Raj', class: '6B' },
  { name: 'Arjun Patel', class: '10B' },
  { name: 'Priya Sharma', class: '9B' },
  { name: 'Neha Verma', class: '8A' },
  { name: 'Rohan Mehta', class: '7A' },
  { name: 'Ananya Joshi', class: '6A' },
  { name: 'Karan Thakur', class: '10A' },
  { name: 'Divya Nair', class: '9A' },
];

export const toolFollowUps = {
  smart_analytics: {
    question: "Which metric would you like to analyze?",
    options: ["Enrollment Trends", "Attendance Patterns", "Academic Performance", "Fee Collection Trends"],
  },
  financial_reports: {
    question: "Which type of report do you need?",
    options: ["Profit & Loss Statement", "Income Summary", "Expense Breakdown", "Budget vs Actual"],
  },
  announcements: {
    question: "Would you like to create a new announcement or view existing ones?",
    options: ["Create new announcement", "View recent announcements", "View scheduled"],
  },
};

export const toolIntros = {
  school_pulse: "Pulling up today's school pulse.",
  fee_collection: "Checking fee collection data.",
  staff_tracker: "Pulling staff attendance records.",
  smart_analytics: "Running analytics.",
  smart_alerts: "Checking active alerts.",
  financial_reports: "Generating financial summary.",
  ai_health_report: "Computing health report.",
  announcements: "Checking announcements.",
  leave_manager: "Looking at leave requests.",
  admission_funnel: "Pulling admission pipeline.",
};

export const paramKeywords = {
  smart_analytics: ['enrollment', 'attendance', 'academic', 'performance', 'fee', 'staff', 'trend', 'score', 'grade'],
  financial_reports: ['p&l', 'profit', 'income', 'expense', 'budget', 'loss', 'cash'],
  announcements: ['create', 'new', 'send', 'view', 'recent', 'schedule', 'broadcast'],
};

export const clarifyResponse = "I'd be happy to help! Could you tell me more about what you need? I can assist with:\n\n\u2022 <b>School overview</b> \u2014 today's pulse and snapshot\n\u2022 <b>Fee collection</b> \u2014 defaulters, reminders, reports\n\u2022 <b>Staff tracking</b> \u2014 attendance, late arrivals, absences\n\u2022 <b>Analytics</b> \u2014 enrollment trends, performance data\n\u2022 <b>Alerts</b> \u2014 exceptions and urgent flags\n\u2022 <b>Finances</b> \u2014 income, expenses, budget reports\n\u2022 <b>Health report</b> \u2014 weekly school health score\n\u2022 <b>Announcements</b> \u2014 create or view broadcasts\n\u2022 <b>Leave management</b> \u2014 approve or reject requests\n\u2022 <b>Admissions</b> \u2014 enquiry pipeline and conversions\n\nDescribe what you need, or type <b>/</b> to pick a specific tool.";

export const genericResponses = [
  "I'll look into that for you. Could you be more specific about which module you'd like me to pull up? You can try asking about fees, staff, analytics, alerts, finances, announcements, leaves, or admissions.",
  "I understand your query. Let me suggest: try using one of the tools on the left panel for detailed reports. You can ask about school pulse, fee collection, staff tracking, or any other module.",
  "I'm here to help! For the best results, try asking about specific areas like attendance, fee collection, staff performance, or academic analytics.",
];
