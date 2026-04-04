# EduFlow — Product Requirements Document

## Product Overview
EduFlow is a chat-first AI-powered school management platform for The Aaryans (CBSE, Lucknow, UP). Primary interface is a Claude.ai-like chat window where an AI orchestrator calls school management tools. Tools are available as standalone form interfaces in the sidebar.

**Version:** 1.1.0 | **Last Updated:** April 2026

## Architecture
- **Frontend**: React + Tailwind + shadcn/ui (dark + light theme)
- **Backend**: FastAPI (Python)
- **Database**: MongoDB (motor/async)
- **LLM**: OpenAI GPT-4o via Emergent LLM key + Gemini 2.5 Flash fallback
- **Deployment**: https://classroom-ai-hub-4.preview.emergentagent.com

## What's Been Implemented

### Session 1 (Phase 1 Foundation)
- Full-stack chat-first UI (Claude.ai style)
- Role-scoped LLM (owner/admin/teacher/student with strict privacy rules)
- SSE streaming chat with tool orchestration
- Keyword + LLM tool routing
- 5 core tools: School Pulse, Fee Collection, Staff Tracker, Student DB, Attendance Recorder
- 52 students, 8 staff, 30 days seed data

### Session 2 (Full Tool Suite)
**Critical Bug Fixes:**
- Fixed raw JSON tool calls appearing in chat (stripped from LLM response, action buttons execute directly via API)
- Fixed chat profile isolation (conversations reset on role switch)
- Fixed duplicate messages in chat
- Quick Actions in School Pulse now functional (navigate to tools)

**All 56 Tools Built:**
| Role | Tools |
|------|-------|
| Owner (16) | School Pulse, Fee Collection, Student Strength, Attendance Overview, Staff Tracker, Financial Reports, Announcements, Admission Funnel, Leave Manager, Staff Performance, AI Health Report, Smart Alerts, Expense Tracker, Complaint Tracker, Custom Report Builder (skeleton), Board Report (skeleton) |
| Admin (19) | Student DB, Fee Tracker, Attendance Recorder, Certificate Generator, Circular Sender, Enquiry Register, Doc Scanner (skeleton), Smart Fee Defaulter, Admission Pipeline, Parent Messages (skeleton), Student Transfer (skeleton), ID Cards (skeleton), Timetable Builder, Asset Tracker, Visitor Log, Transport Manager, Automated Report (skeleton), Custom Form Builder (skeleton), Payroll Preparer (skeleton) |
| Teacher (12) | Class Attendance, Assignment Generator, Question Paper Creator, Report Card Builder, Student Performance, Leave Application, Lesson Plan Generator, Worksheet Creator (skeleton), Class Analytics, Substitution Viewer (skeleton), PTM Notes, Curriculum Tracker |
| Student (10) | AI Tutor, Doubt Solver, Homework Viewer, Attendance Self-Check, Result Viewer, Practice Test (skeleton), Study Planner, Career Guidance, Fee Status, PTM Summary |

**New Features:**
- Dark/light mode toggle (ThemeContext, persisted to localStorage)
- Profile modal (view user info)
- Settings modal (theme, language info, notifications, privacy, about)
- Conversation context menu (right-click: rename, pin, star, delete)
- Conversation rename inline editing
- Responsive design (mobile sidebar toggle)
- New backend routes: /api/academics (assignments, exams, results, timetable, PTM, curriculum)
- New backend routes: /api/ops (certificates, expenses, complaints, visitors, assets, transport, announcements, enquiries, leaves)
- Data privacy: comprehensive system prompt with role boundaries, no phone/salary/address in chat
- Assignment protection (is_ai_blocked flag enforced)

## Key Files
- `/app/backend/server.py` — Main FastAPI app
- `/app/backend/routes/chat.py` — SSE streaming + action button execution
- `/app/backend/routes/academics.py` — Academic data routes
- `/app/backend/routes/operations.py` — Operational routes
- `/app/backend/ai/tool_functions.py` — All tool implementations
- `/app/backend/ai/prompts.py` — Privacy-focused role-scoped prompts
- `/app/frontend/src/components/tools/OwnerTools.js` — 16 owner tools
- `/app/frontend/src/components/tools/AdminTools.js` — 19 admin tools
- `/app/frontend/src/components/tools/TeacherTools.js` — 12 teacher tools
- `/app/frontend/src/components/tools/StudentTools.js` — 10 student tools

## Prioritized Backlog

### P0 — Next Session
- [ ] File upload system (PDF, images, DOCX for all roles)
- [ ] Light theme refinement (some components still dark-only)
- [ ] Phone-responsive testing + sidebar overlay fix
- [ ] Lesson plans API route (/api/academics/lesson-plans is missing)
- [ ] More seed data for assets, expenses, complaints

### P1 — Phase 2
- [ ] JWT Authentication (phone OTP login for all roles)
- [ ] WhatsApp/Twilio notifications
- [ ] Assignment PDF generation
- [ ] Question paper PDF export
- [ ] Report card PDF bulk generation
- [ ] Certificate PDF generation
- [ ] Parent notification on attendance absence

### P2 — Phase 3
- [ ] AI Tutor with full NCERT curriculum knowledge
- [ ] Smart Alerts background jobs
- [ ] Analytics charts (recharts integration)
- [ ] Staff biometric/QR attendance
- [ ] Payroll data preparer full implementation
- [ ] Custom form builder full implementation

### P3 — Phase 4
- [ ] Practice test generator with AI
- [ ] Custom report builder (NL to MongoDB query)
- [ ] Data export (ZIP) for owner
- [ ] Career guidance AI full implementation
- [ ] School Health Score dashboard

## Environment Variables
```
MONGO_URL, DB_NAME, CORS_ORIGINS (protected)
EMERGENT_LLM_KEY=sk-emergent-cF2E90dFaB30fBe29B
LLM_PROVIDER=openai, LLM_MODEL=gpt-4o
LLM_FALLBACK_PROVIDER=gemini, LLM_FALLBACK_MODEL=gemini-2.5-flash
SCHOOL_NAME=The Aaryans, SCHOOL_BOARD=CBSE, SCHOOL_CITY=Lucknow, SCHOOL_STATE=Uttar Pradesh
```
