# EduFlow — PRD v1.2.0
**Last Updated:** April 2026 | School: The Aaryans, CBSE, Lucknow, UP

## Architecture
- Frontend: React + Tailwind + shadcn/ui, dark/light theme
- Backend: FastAPI (Python)
- Database: MongoDB (motor/async)
- LLM: OpenAI GPT-4o (Emergent key) + Gemini 2.5 Flash fallback
- URL: https://classroom-ai-hub-4.preview.emergentagent.com

## Session 1 (Phase 1 Foundation)
- Full chat-first UI, SSE streaming, 5 core tools, 52 students seed data

## Session 2 (Full Tool Suite)
- All 56 tools built across 4 roles
- Dark/light mode, Profile, Settings modals, Conversation context menu
- Backend: /api/academics, /api/ops routes

## Session 3 (Bug Fixes + Enhancements)
**Critical Bug Fixes:**
- Double reply fixed (ref-based final message pattern, avoids React Strict Mode double-fire)
- First user message now stays visible (justCreated ref skips message reload on new conv)
- Leave Application crash fixed (uses /api/staff/leaves/my endpoint)
- Lesson Plan not saving fixed (proper loading + saving with reload)
- Study Planner saves to MongoDB (/api/ops/study-plan endpoint)
- Attendance date parameter passed correctly to backend
- Fee payment filters working (useEffect on filter change)
- Certificate Generator properly generates and shows preview

**UX Improvements:**
- Sidebar restructured: Chat history on top, Tools (N) collapsible dropdown below
- Header: compact role display (name + role tag stacked), no theme toggle in header
- / and @ work mid-sentence anywhere in input text
- / shows role-specific tool list (scrollable, keyboard nav)
- @ fetches persons from DB (role-scoped)
- Working notifications panel (real data from DB)
- Working search panel (tools, students, staff, announcements)
- Token usage metric in Profile modal
- Emergent watermark hidden via CSS
- School Health Score widget on chat welcome (owner/admin)
- "E" logo removed from chat (replaced with "AI" avatar)
- Remove conversation starters (only greeting + health score)
- Settings notifications toggles working with Save button
- Conversation title shown below header when chat is open

**New Backend Routes:**
- /api/search - role-scoped global search
- /api/notifications - role-scoped notification list
- /api/staff/leaves/my - teacher's own leave history
- /api/ops/study-plan (GET/POST) - student study planner persistence
- /api/ops/leaves - fixed to work for teacher role without crashing

**Seed Data Added:**
- 6 expense records (utilities, maintenance, stationery, events, transport, salary)
- 6 asset records (smart boards, lab equipment, library books, computers, desks)
- 3 complaint records

## Data Workflows
- **Homework**: Teacher creates in Assignment Generator → `assignments` collection → displayed in Student Homework Viewer, AI Tutor (checks is_ai_blocked)
- **My Attendance**: Marked by Teacher/Admin in Attendance Recorder → `student_attendance` → shown in Student Attendance Self-Check, Teacher Class View, Owner/Admin Attendance Overview
- **My Result**: Teacher enters in Report Card Builder → `exam_results` → Student Result Viewer, Teacher Student Performance Viewer, Class Analytics
- **My Fees**: Admin records in Fee Tracker → `fee_transactions` → Student Fee Status Viewer, Admin Fee Tracker, Owner Fee Collection Summary
- **PTM Summary**: Teacher creates in PTM Notes → `ptm_notes` → Student PTM Summary Viewer (read-only)
- **Report Card**: Marks in `exam_results` → Report Card Builder (teacher), Student Result Viewer

## Prioritized Backlog

### P0 — Next Session
- [ ] File upload system (PDF, images, DOCX)
- [ ] Light theme refinement in tool components
- [ ] Recharts integration for better analytics/charts
- [ ] Add evaluation metrics/charts to Class Performance Analytics

### P1 — Phase 2
- [ ] JWT phone OTP authentication
- [ ] WhatsApp/Twilio integration (absence alerts, fee reminders)
- [ ] PDF generation (certificates, report cards, question papers)
- [ ] Assignment PDF export

### P2 — Phase 3
- [ ] AI Tutor NCERT curriculum integration
- [ ] Smart Alerts background jobs
- [ ] Payroll preparer, custom form builder full implementation
- [ ] Data export ZIP for owner

## Environment Variables
MONGO_URL, DB_NAME, CORS_ORIGINS (protected)
EMERGENT_LLM_KEY=sk-emergent-cF2E90dFaB30fBe29B
LLM_PROVIDER=openai, LLM_MODEL=gpt-4o
LLM_FALLBACK_PROVIDER=gemini, LLM_FALLBACK_MODEL=gemini-2.5-flash
SCHOOL_NAME=The Aaryans, SCHOOL_BOARD=CBSE, SCHOOL_CITY=Lucknow
