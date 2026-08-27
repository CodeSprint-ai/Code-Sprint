# CodeSprint

AI-powered competitive programming and learning platform — built as a Final Year Project at Sir Syed University of Engineering & Technology.

CodeSprint helps students practice algorithmic problem-solving with real-time code execution, AI-assisted feedback, and live contest tracking across major competitive programming platforms.

## Features

- **In-browser code execution** — Judge0 CE integration for compiling and running submissions against test cases
- **AI-assisted learning** — Google Gemini API (via LangChain) for post-submission analysis, hints, and personalized guidance
- **Live contest aggregator** — real-time tracking of ongoing and upcoming contests from Codeforces, LeetCode, AtCoder, CodeChef, HackerRank and more (via CLIST.by, with Kontests.net fallback)
- **Real-time features** — Socket.IO for live updates during contests and submissions
- **Background job processing** — BullMQ (Redis-backed queues) for asynchronous judging and notifications
- **Authentication** — Google, GitHub, and email/password login via Passport + JWT
- **In-browser editor** — Monaco Editor (the engine behind VS Code) for a full IDE-like coding experience

## Tech Stack

**Backend:** NestJS, TypeScript, PostgreSQL (TypeORM), MongoDB (Mongoose), Redis/BullMQ, Socket.IO, LangChain + Google Gemini API, Passport (JWT/Google/GitHub OAuth), Cloudinary, Resend

**Frontend:** Next.js, React, TypeScript, Tailwind CSS, shadcn/ui (Radix), TanStack Query, Zustand, Monaco Editor, Framer Motion, Socket.IO client

## Project Structure

```
Code-Sprint/
├── backend/     # NestJS API — auth, problems, submissions, contests, AI analysis
└── frontend/    # Next.js client — editor, dashboards, contest tracker
```

See `backend/README.md` and `frontend/README.md` for setup instructions for each service.

## Team

Built by a 4-person team under faculty supervision, following a full SDLC with system architecture, database design, and a Technical Requirements Document. Selected as a finalist at the ASPIRE Pakistan Startup Hub after being pitched as a National Idea Bank IV startup application.
