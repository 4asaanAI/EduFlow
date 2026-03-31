# EduFlow - School Management AI Dashboard

## Original Problem Statement
Build a fully functional, responsive frontend-only app for the POV of a school owner. The app is an AI-powered school management dashboard with a chat-first interface where the AI acts as a "waiter" handling tasks inline with rich widgets (tables, charts, stats).

## Architecture
- **Frontend Only** - React + Custom CSS (Tailwind-like utility via CSS variables)
- **No Backend** - All data is static/mock from `/app/frontend/src/data/mockData.js`
- **Components**: Sidebar, ChatMessage, InputBar, ToolView, NotificationPanel, SearchModal

## What's Been Implemented
- Base UI layout (Sidebar with tools + chat history, main chat area)
- Slash commands (`/`) and `@` student mentions in input
- Light/Dark mode toggle
- Editable chat names, star, pin, delete
- Tool-specific dedicated views via Sidebar
- Chat-first smart routing (tools handled inline in chat)
- General knowledge detection + notification bell + Cmd+K search bar
- No trailing periods on any UI text (user rule)
- Hyperlinked `/tool` mentions in chat messages (clickable, navigate to tool view)
- Input draft preservation on view switch
- AI disclaimer merged into input hint line
- Widened & centered search bar in top bar
- Person search (students + staff) in search modal

## Key User Rules
- **No trailing periods** at end of any sentence across the product
- Owner name is "Aman"
- School name is "Shakti Shanti Academy"

## Completed Tasks (Feb 2026)
- All features listed above are complete and tested

## Backlog
- None currently — all user-requested features have been implemented
