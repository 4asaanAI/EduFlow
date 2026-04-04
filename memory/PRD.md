# EduFlow — Product Requirements Document

## Product Overview
EduFlow is a chat-first AI-powered school management platform for The Aaryans (CBSE, Lucknow, UP). The primary interface is a Claude.ai-like chat window where an AI orchestrator calls school management tools, reads DB data, and responds with rich UI. Tools are also available as standalone form interfaces in the sidebar.

## Architecture
- **Frontend**: React + Tailwind + shadcn/ui (dark theme)
- **Backend**: FastAPI (Python)
- **Database**: MongoDB (motor/async)
- **LLM**: OpenAI GPT-4o via Emergent LLM key + Gemini fallback
- **Deployment**: Emergent platform (https://classroom-ai-hub-4.preview.emergentagent.com)

## Core Principles (from architecture v3.1)
1. Single-tenant (one deployment = one school, no school_id)
2. Chat-first, tools-second
3. AI as orchestrator (calls backend tools, returns rich responses)
4. Multi-LLM abstraction (provider-agnostic via .env)
5. Bilingual auto-detect (Hindi/English based on input)
6. Role-scoped knowledge (owner/admin/teacher/student)
7. No parent app role (WhatsApp only - Phase 2)
8. Assignment protection (is_ai_blocked flag)
9. Strict role-based access

## What's Been Implemented (Phase 1 — April 2026)

### Backend
- FastAPI with MongoDB (Motor async)
- Multi-LLM abstraction (OpenAI primary, Gemini fallback) via emergentintegrations
- Keyword-based + LLM-based tool routing
- Hindi/English language detection (Devanagari Unicode range check)
- SSE streaming chat endpoint
- Rich content parsing (<<<RICH_CONTENT>>> blocks + markdown tables)
- Role-scoped system prompts per user type
- All Phase 1 CRUD APIs:
  - /api/chat (conversations + streaming messages)
  - /api/students (CRUD)
  - /api/staff (list, leave management)
  - /api/fees (structures, transactions, summary)
  - /api/attendance (bulk mark, query)
  - /api/tools (direct tool execution)
  - /api/settings (school info, classes, user prefs)

### AI Tool Functions
- get_school_pulse — full school overview
- get_fee_summary — defaulters and collection stats
- get_staff_status — staff attendance + leave requests
- get_attendance_overview — trends and class-wise stats
- get_smart_alerts — exceptions and flags
- get_financial_report — revenue breakdown
- search_students — search by name/class
- get_fee_transactions — payment history
- approve_leave — approve/reject leave requests
- get_enquiries — admission funnel
- get_my_attendance / get_my_fees / get_my_results (student tools)

### Frontend
- Dark-theme Claude.ai-like layout (120px sidebar)
- Role-switcher in header (dev mode: owner/admin/teacher/student)
- Chat interface with SSE streaming
- Typing indicator + tool call badge
- Rich message rendering:
  - Stat grid cards
  - Markdown tables (rendered as HTML)
  - Alert items with color coding
  - Action buttons
- Slash command suggestions (/) 
- Chat history in sidebar (pinned, starred support)
- New Chat creation
- Suggested prompts on welcome screen

### Tool Views (form-based, non-chat)
- School Pulse — quick actions, today's snapshot, alerts
- Fee Collection — stats + defaulters table
- Staff Tracker — attendance list + leave approval
- Student Database — searchable list + add student modal
- Attendance Recorder — class-wise daily marking with bulk actions

### Seed Data (The Aaryans, 2025-26)
- 6 classes (Class 9A, 9B, 10A, 10B, 11A, 12A)
- 52 students with guardians
- 8 staff members
- 30 days of attendance records
- Fee transactions (paid/overdue/pending)
- Leave requests, enquiries, announcements
- 3 sample conversation history items

## Roles Implemented
| Role | Tools Available | Data Access |
|------|----------------|-------------|
| Owner | All 10 owner tools | All except salaries via chat |
| Admin | 7 admin tools | Operational data |
| Teacher | 4 teacher tools | Own class only |
| Student | 4 student tools | Own data only |

## Key Files
- `/app/backend/server.py` — Main FastAPI app
- `/app/backend/routes/chat.py` — SSE streaming chat with tool routing
- `/app/backend/ai/tool_functions.py` — All tool implementations
- `/app/backend/ai/prompts.py` — Role-scoped system prompts
- `/app/backend/seed.py` — Demo data seeder
- `/app/frontend/src/components/ChatInterface.js` — Chat UI
- `/app/frontend/src/components/MessageRenderer.js` — Rich content rendering
- `/app/frontend/src/components/Sidebar.js` — Tool list + chat history

## Prioritized Backlog

### P0 — Critical for next session
- [ ] Conversation rename/pin/star/delete via right-click menu
- [ ] Message history loading when clicking existing conversations
- [ ] File upload system (PDF, DOCX, images)
- [ ] Hindi AI response quality improvement

### P1 — Phase 2 Features
- [ ] Authentication (JWT-based login, no auth currently)
- [ ] WhatsApp/Twilio integration (absence alerts, fee reminders)
- [ ] Assignment Generator tool (teacher)
- [ ] Question Paper Creator (teacher)
- [ ] Report Card Builder
- [ ] Leave Management form (teacher can apply)
- [ ] Certificate Generator (TC, Bonafide)
- [ ] Enquiry manager with status pipeline

### P2 — Phase 3 Features
- [ ] AI Tutor with assignment protection (student)
- [ ] Doubt Solver with photo upload
- [ ] Smart Alerts background jobs
- [ ] AI Health Report (weekly auto-generation)
- [ ] Timetable Builder
- [ ] Staff Performance Overview

### P3 — Phase 4 Features
- [ ] Complete analytics suite
- [ ] Custom report builder
- [ ] Data export (ZIP)
- [ ] Mobile PWA optimization
- [ ] Real-time notifications (push)
- [ ] Board/trust meeting report

## Environment Variables Required
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=eduflow_db
EMERGENT_LLM_KEY=sk-emergent-cF2E90dFaB30fBe29B
LLM_PROVIDER=openai
LLM_MODEL=gpt-4o
LLM_FALLBACK_PROVIDER=gemini
LLM_FALLBACK_MODEL=gemini-2.5-flash
SCHOOL_NAME=The Aaryans
SCHOOL_BOARD=CBSE
SCHOOL_CITY=Lucknow
SCHOOL_STATE=Uttar Pradesh
```
