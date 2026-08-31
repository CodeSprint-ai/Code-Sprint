# ⚡ CodeSprint — AI-Powered Competitive Programming & Learning Platform

<p align="center">
  <img src="https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript_5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript 5" />
  <img src="https://img.shields.io/badge/NestJS_11-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS 11" />
  <img src="https://img.shields.io/badge/PostgreSQL_16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Redis_&_BullMQ-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis BullMQ" />
  <img src="https://img.shields.io/badge/Google_Gemini-4E75F8?style=for-the-badge&logo=googlegemini&logoColor=white" alt="Google Gemini" />
  <img src="https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socketdotio&logoColor=white" alt="Socket.IO" />
  <img src="https://img.shields.io/badge/Monaco_Editor-1E1E1E?style=for-the-badge&logo=visualstudiocode&logoColor=007ACC" alt="Monaco Editor" />
</p>

<p align="center">
  <strong>An enterprise-grade competitive programming and algorithmic learning ecosystem featuring asynchronous sandboxed code execution, Google Gemini 2.5 Flash AI code reviews, pgvector RAG context retrieval, progressive hint engines, and automated multi-platform contest aggregation.</strong>
</p>

<p align="center">
  <a href="#-project-overview">Project Overview</a> •
  <a href="#-key-features">Key Features</a> •
  <a href="#️-architecture--data-flow">Architecture & Data Flow</a> •
  <a href="#️-tech-stack-matrix">Tech Stack</a> •
  <a href="#-project-structure">Project Structure</a> •
  <a href="#-getting-started--installation">Getting Started</a> •
  <a href="#-available-scripts">Available Scripts</a> •
  <a href="#-live-demo--deployment">Deployment</a> •
  <a href="#-author--attribution">Author & Attribution</a> •
  <a href="#-license">License</a>
</p>

---

> [!IMPORTANT]
> **Academic & Innovation Pedigree**: CodeSprint was engineered as a flagship **Final Year Project (Batch 2022F CS)** at **Sir Syed University of Engineering & Technology (SSUET)** by a 4-person engineering team under faculty mentorship. Built strictly adhering to industry standard Software Development Life Cycle (SDLC) processes, comprehensive database schemas, and rigorous Technical Requirements Specifications.
>
> Selected as an **Official Finalist at the ASPIRE Pakistan Startup Hub** after being pitched as an innovative educational technology solution under the **National Idea Bank (NIB) IV** startup program.

---

## 🎯 Project Overview

Mastering Data Structures and Algorithms (DSA) and preparing for high-stakes programming competitions (ICPC, LeetCode contests, Codeforces rounds) often presents steep barriers for computer science students. Traditional platforms suffer from three major shortcomings:
1. **Opaque Feedback Loops**: Submissions are often rejected with cryptic "Wrong Answer" verdicts without actionable hints or asymptotic complexity explanations.
2. **Fragmented Ecosystems**: Learners must juggle disparate external contest schedule trackers, offline editors, and scattered video explanations.
3. **Static Learning Paths**: Generic problem lists fail to adapt dynamically to a learner's strengths, weaknesses, and mastery levels across algorithmic domains.

**CodeSprint** solves these challenges by uniting an end-to-end coding workspace with cutting-edge artificial intelligence, real-time background queues, and live contest synchronization.

### Core Architectural Philosophy
- **Decoupled Modular Monolith**: High-cohesion backend domain modules (Auth, Problem, Submission, Judge, AI, Sprint, Roadmap, Contest, Profile) paired with a feature-driven Next.js 16 frontend.
- **Asynchronous Non-Blocking Execution**: High-throughput submission pipelines managed by Redis-backed BullMQ queues and Judge0 sandboxes, preventing compute thread starvation.
- **Cognitive AI & Vector Retrieval**: LangChain + Google Gemini 2.5 Flash structured output combined with PostgreSQL `pgvector` embeddings for precise algorithmic code reviews and progressive non-spoiler hints.
- **Resilient External Integrations**: Multi-source contest aggregation with in-memory LRU caching, rate-limit backoffs, and automated fallback engines (CLIST.by ➔ Kontests.net).
- **Sub-Second Real-Time Telemetry**: Bi-directional Socket.IO gateways providing live progress updates as code transitions from compilation to multi-test verdict evaluation.

---

## 🚀 Key Features

### 🧠 1. AI-Powered Code Intelligence & Mentorship
* **Post-Submission Deep Code Analysis**: Powered by Google Gemini 2.5 Flash via LangChain with strict Zod structured output validation. Evaluates:
  * **Approach Classification**: Algorithmic paradigm detection (e.g., Two-Pointer, Dynamic Programming, Greedy, BFS/DFS).
  * **Asymptotic Complexity**: Formal $O(\text{Time})$ and $O(\text{Space})$ derivation with clear explanations.
  * **Edge Case Diagnostics**: Highlights edge inputs (empty arrays, integer overflow, duplicate keys) that the code might fail on.
  * **Actionable Optimizations**: Concrete code refactoring proposals for optimal runtime/memory efficiency.
  * **Constructive Feedback & Optimality Flag**: Encouraging mentorship feedback and a boolean `isOptimal` flag.
* **Retrieval-Augmented Generation (RAG)**: Built with `pgvector` (`DocumentEmbedding`), indexing problem statements and edge-case patterns to inject relevant context into AI prompts.
* **Tiered Progressive Hint Engine**: Delivers step-by-step conceptual hints without spoiling full solutions, tracking user hint consumption and engagement.
* **AI Cost & Reliability Controls**: 30-day Redis caching (`analysis:v1:<submissionId>`), prompt token guardrails (capped at ~8,000 tokens / 32,000 characters), and automatic retries with strict JSON fallback instructions.

### ⚡ 2. Real-Time Sandboxed Code Execution
* **Asynchronous BullMQ Queue**: Offloads compilation and test evaluation to background Redis worker jobs, guaranteeing responsiveness during high-traffic spikes.
* **Single-Invocation Test Bundling (`RunnerFactory`)**: Bundles all problem test cases into a unified execution payload passed via `stdin` to Judge0 CE, dramatically reducing round-trip network overhead.
* **Granular Verdict Reporting**: Emits instant WebSocket status events for `QUEUED`, `PROCESSING`, `ACCEPTED`, `WRONG_ANSWER`, `TIME_LIMIT_EXCEEDED`, `COMPILATION_ERROR`, `RUNTIME_ERROR`, and `INTERNAL_ERROR`.
* **Execution Telemetry**: Accurate runtime capture (seconds/milliseconds), memory allocation tracking (KB/MB), compiler outputs, and masked evaluation for hidden test cases.

### 📅 3. Multi-Platform Live Contest Aggregator
* **Global Contest Coverage**: Real-time tracking of active and upcoming contests across **Codeforces, LeetCode, AtCoder, CodeChef, HackerRank, TopCoder**, and more.
* **Dual-Tier Resiliency & Failover**: Primary integration with **CLIST.by API** with automated graceful fallback to **Kontests.net** during upstream outages or rate limits.
* **Smart LRU Caching & Rate Limiter**: 5-minute TTL in-memory LRU cache adhering strictly to CLIST's 10 req/min limit with exponential backoff handling.
* **1-Click Calendar Sync**: Instant one-click export to standard `.ics` iCalendar files and direct Google Calendar event generation.
* **Interactive Views**: Filterable by timeframe (`ongoing`, `upcoming`, `next24h`), search query, and platform, accompanied by real-time countdown tickers.

### 🏆 4. Gamified Sprints, Roadmaps & Skill Trees
* **Speed Coding Sprints**: Timed, high-intensity problem solving sessions (`SprintSession`, `SprintProblem`) designed for rapid algorithmic drills and live challenges.
* **Topic Mastery Engine**: Automated background aggregation (`MasteryAggregatorService`) computing proficiency percentages across DSA topics (Arrays, Trees, Graphs, Dynamic Programming, Strings, Sorting).
* **Milestone Badges & Rating System**: Dynamic user rating recalculation on submission outcomes, leveling algorithms, and milestone achievement badge collection (`UserBadge`, `RoadmapBadge`).

### 💻 5. Monaco-Powered In-Browser IDE
* **Full VS Code Engine**: Integrated `@monaco-editor/react` with IntelliSense, bracket matching, syntax highlighting, and customizable themes.
* **Multi-Language Support**: Seamless execution configurations for **Python, JavaScript, TypeScript, C++, and Java**.
* **Responsive Split Workspace**: Flexible split-pane layout (`react-split`) with collapsable problem descriptions, custom testcase runners, console tabs, and submission history.

### 🔒 6. Enterprise-Grade Security & Authentication
* **Multi-Provider Authentication**: Local email/password login (salted bcrypt hashing) alongside **Google OAuth 2.0** and **GitHub OAuth 2.0** via Passport strategies.
* **Dual-Token Architecture**: Short-lived JWT access tokens + HTTP-only secure refresh tokens (`cookie-parser`), with automatic token rotation.
* **Active Session Management**: Comprehensive multi-device session tracking (`UserSession`), allowing users to inspect active logins by IP/device and revoke sessions remotely.
* **Transactional Email System**: Cryptographic time-limited tokens for email verification and password reset workflows powered by **Resend** and SMTP.
* **Audit & Security Logging**: `SecurityLog` tracking authentication events, IP addresses, and user-agent fingerprints.
* **Role-Based Access Control (RBAC)**: Fine-grained `@Roles()` decorators and `RolesGuard` protecting administration and problem-authoring endpoints.

### 📊 7. Visual Analytics & User Dashboards
* **Daily Activity Heatmap**: Interactive GitHub-style contribution heatmaps tracking daily problem solving consistency and current/longest streak metrics.
* **Performance Charts**: Dynamic SVG data visualizations built with **Recharts** displaying problem difficulty breakdown (Easy, Medium, Hard), submission verdict ratios, and rating history.
* **Public Profiles & Bookmarks**: Custom user handle public showcases, bookmarked problem libraries (`SavedProblem`), and customizable editor/theme preferences.

---

## 🏗️ Architecture & Data Flow

### High-Level System Architecture

```mermaid
flowchart TB
    subgraph Client ["Client Tier (Next.js 16 + React 19)"]
        UI["Modern Web Client\n(Tailwind CSS v4 + Radix UI)"]
        Monaco["Monaco Code Editor\n(Multi-language IDE)"]
        QueryState["TanStack Query v5\n& Zustand Stores"]
    end

    subgraph Gateway ["API Gateway & Routing (NestJS 11)"]
        HTTP["Express HTTP Server\n(CORS, Cookie Parser, Validation)"]
        Guard["Guards & Middleware\n(JwtAuthGuard, RolesGuard, RateLimiter)"]
        SocketGateway["Socket.IO Gateway\n(SubmissionGateway)"]
    end

    subgraph CoreServices ["Core Backend Domain Modules"]
        AuthMod["Auth Module\n(OAuth2, JWT, Sessions)"]
        ProbMod["Problem Module\n(Catalog, TestCases)"]
        SubMod["Submission Module\n(Orchestration & Stats)"]
        SprintMod["Sprint Module\n(Realtime Battles)"]
        RoadmapMod["Roadmap Module\n(Mastery Aggregator)"]
        ContestMod["Contest Module\n(LRU Cache, Proxy)"]
        AIMod["AI & RAG Module\n(LangChain + Gemini 2.5)"]
    end

    subgraph Infra ["Data & Infrastructure Layer"]
        Postgres[(PostgreSQL 16\nTypeORM + pgvector)]
        Redis[(Redis Cache\n& BullMQ)]
        Judge0[("Judge0 CE Sandbox\n(Remote Code Execution)")]
        ExternalAPIs[("External APIs\nCLIST.by | Kontests.net | Resend | Cloudinary")]
    end

    UI --> HTTP
    Monaco --> HTTP
    UI <--> SocketGateway
    HTTP --> Guard
    Guard --> CoreServices

    SubMod -->|Enqueues Job| Redis
    Redis -->|Processes Execution| SubMod
    SubMod -->|Bundled Payload| Judge0
    SubMod -->|Emits Verdict| SocketGateway
    AIMod -->|Retrieves Vectors & Entities| Postgres
    AIMod -->|Prompts with RAG Context| ExternalAPIs
    ContestMod -->|Caches / Proxies| ExternalAPIs
    CoreServices --> Postgres
```

---

### End-to-End Code Submission & AI Analysis Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as Developer / Student
    participant Frontend as Next.js Client
    participant Controller as Submission Controller
    participant Service as Submission Service
    participant Queue as Redis (BullMQ Queue)
    participant Worker as Submission Processor
    participant Runner as Runner Factory
    participant Judge0 as Judge0 CE Sandbox
    participant Socket as Socket.IO Gateway
    participant AI as PostSubmission AI Service
    participant Gemini as Google Gemini 2.5 Flash

    User->>Frontend: Clicks "Submit Code"
    Frontend->>Controller: POST /submissions { problemId, code, language }
    Controller->>Service: createSubmission()
    Service->>Queue: Add job to 'submissions' queue (status: QUEUED)
    Service-->>Frontend: 201 Created { submissionUuid, status: "QUEUED" }
    
    Queue->>Worker: Consume submission job
    Worker->>Socket: Emit "PROCESSING" status
    Socket-->>Frontend: Live status update: Processing...
    
    Worker->>Runner: Build bundled runner payload (code + all test cases)
    Runner-->>Worker: Final wrapped code + stdin JSON
    Worker->>Judge0: POST /submissions/batch (Single execution invocation)
    Judge0-->>Worker: Execution result (stdout, stderr, executionTime, memory)
    
    Worker->>Worker: Parse runner JSON verdicts & map test case outcomes
    Worker->>Socket: Emit final verdict (ACCEPTED / WRONG_ANSWER, time, memory)
    Socket-->>Frontend: Render Test Case Matrix & Confetti
    
    opt User clicks "Request AI Code Review"
        Frontend->>AI: POST /ai/post-submission/analyze { submissionId }
        AI->>AI: Check Redis Cache (analysis:v1:<id>)
        alt Cache Miss
            AI->>AI: Retrieve Problem & Edge Case Embeddings (pgvector RAG)
            AI->>Gemini: LangChain structured prompt invoke(analysisSchema)
            Gemini-->>AI: Structured JSON (approach, O(N), edge cases, optimizations)
            AI->>AI: Cache result in Redis (TTL: 30 days) & persist to DB
        end
        AI-->>Frontend: Return AI Review Analysis JSON
        Frontend-->>User: Display AI Mentor Review Drawer
    end
```

---

## 🛠️ Tech Stack Matrix

| Layer | Technology | Purpose / Role |
| :--- | :--- | :--- |
| **Frontend Framework** | [Next.js 16](https://nextjs.org/) (App Router) | Server-Side Rendering (SSR), Static Generation (SSG), Client Components & SEO optimization |
| **UI Library & Core** | [React 19](https://react.dev/) & [TypeScript 5](https://www.typescriptlang.org/) | Type-safe declarative UI components and reactive user interfaces |
| **Styling & Design System** | [Tailwind CSS v4](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/) | Modern design tokens, dark mode theming, glassmorphism, and accessible Radix UI primitives |
| **Client State & Caching** | [TanStack React Query v5](https://tanstack.com/query/latest) & [Zustand](https://zustand-demo.pmnd.rs/) | Server-state caching, automatic refetching, and lightweight global client stores |
| **Code Editor Engine** | [Monaco Editor](https://microsoft.github.io/monaco-editor/) (`@monaco-editor/react`) | In-browser VS Code editing experience with syntax highlighting and multi-language support |
| **Animations & Visuals** | [Framer Motion](https://www.framer.com/motion/) & [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti) | Micro-interactions, smooth page transitions, and gamified celebration effects |
| **Data Visualization** | [Recharts](https://recharts.org/) | Performance analytics, submission frequency distribution, and topic mastery charts |
| **Backend Framework** | [NestJS 11](https://nestjs.com/) | Scalable, enterprise TypeScript architecture (Modules, Controllers, Services, Dependency Injection) |
| **Database & ORM** | [PostgreSQL 16](https://www.postgresql.org/) & [TypeORM 0.3](https://typeorm.io/) | Relational database modeling, automated schema migrations, and entity relationships |
| **Vector Store (RAG)** | [pgvector](https://github.com/pgvector/pgvector) | Vector embeddings indexing for problem statements and edge-case similarity search |
| **Background Queues** | [BullMQ](https://bullmq.io/) & [Redis](https://redis.io/) (`ioredis`) | High-concurrency asynchronous submission job scheduling and distributed rate-limiting |
| **Sandboxed Code Judge** | [Judge0 CE](https://judge0.com/) | Remote compilation and execution sandbox across multiple target programming languages |
| **Artificial Intelligence** | [Google Gemini 2.5 Flash](https://ai.google.dev/) & [LangChain](https://js.langchain.com/) | Algorithmic code review, asymptotic analysis, edge-case diagnosis, and structured JSON output |
| **Real-Time WebSockets** | [Socket.IO](https://socket.io/) (`@nestjs/websockets`) | Bi-directional streaming for live submission verdicts and sprint challenges |
| **Authentication & RBAC** | [Passport.js](http://www.passportjs.org/) & [JWT](https://jwt.io/) | Multi-strategy authentication (Local, Google OAuth 2.0, GitHub OAuth 2.0) and Role Guards |
| **Transactional Email** | [Resend](https://resend.com/) & Nodemailer SMTP | Transactional email delivery for account verification and password recovery |
| **Media Storage** | [Cloudinary](https://cloudinary.com/) | Cloud storage and CDN optimization for user avatars and platform media assets |

---

## 📂 Project Structure

```bash
Code-Sprint/
├── backend/                             # NestJS Backend Application
│   ├── src/
│   │   ├── ai/                          # AI Capabilities & LLM Workflows
│   │   │   ├── hints/                   # Multi-tier progressive hint generation service & usage tracking
│   │   │   └── post-submission/         # Google Gemini 2.5 LangChain structured analysis & caching
│   │   ├── auth/                        # Authentication & Security Module
│   │   │   ├── entities/                # SecurityLog, OAuthProvider entities
│   │   │   ├── guard/                   # JwtAuthGuard, RolesGuard, LocalAuthGuard
│   │   │   └── strategies/              # JWT, Google OAuth2, GitHub OAuth2, Local strategies
│   │   ├── common/                      # Shared Cross-Cutting Utilities
│   │   │   ├── cloudinary/              # Media upload service
│   │   │   ├── exceptions/              # GlobalExceptionFilter and HTTP handlers
│   │   │   ├── redis/                   # Redis client module & connection providers
│   │   │   └── utils/                   # Socket.IO SubmissionGateway & helper functions
│   │   ├── contest/                     # External Contest Aggregator
│   │   │   ├── dto/                     # Request query and response DTO validation
│   │   │   ├── utils/                   # In-memory LRU cache and rate limiter
│   │   │   ├── contest.controller.ts    # GET /api/contests endpoints (filtering, pagination)
│   │   │   └── contest.service.ts       # CLIST.by proxy with Kontests.net fallback
│   │   ├── judge/                       # Judge0 Integration & Execution Runners
│   │   │   ├── enums/                   # LanguageId and normalized language enums
│   │   │   ├── runners/                 # RunnerFactory & language-specific template wrappers
│   │   │   └── judge.service.ts         # Judge0 batch submission and polling client
│   │   ├── problem/                     # Problem Catalog & Test Cases
│   │   │   ├── entities/                # Problem and TestCase TypeORM models
│   │   │   ├── problem.controller.ts    # Problem CRUD & search endpoints
│   │   │   └── problem.service.ts       # Problem management, test case verification, slug generation
│   │   ├── profile/                     # User Profiles, Preferences & Gamification
│   │   │   ├── entities/                # UserStats, Badge, UserBadge, SavedProblem, UserSession
│   │   │   └── user-stats.service.ts    # Rating calculation, streak updates, and statistics
│   │   ├── rag/                         # Retrieval-Augmented Generation (RAG)
│   │   │   ├── embedding.service.ts     # Vector embedding generation via Gemini
│   │   │   └── rag.service.ts           # pgvector similarity search over problem documents
│   │   ├── roadmap/                     # Adaptive Learning & Topic Mastery
│   │   │   ├── entities/                # UserTopicMastery, UserRoadmap, RoadmapBadge
│   │   │   ├── mastery-aggregator.service.ts # Background topic mastery percentage recalculation
│   │   │   └── roadmap.service.ts       # Learning path generation and milestone progression
│   │   ├── sprint/                      # Timed Speed Coding Sprints
│   │   │   ├── entities/                # SprintSession and SprintProblem models
│   │   │   └── sprint.service.ts        # Sprint lobby matchmaking, problem sets, and scoring
│   │   ├── submission/                  # Submission Lifecycle & Queue Processing
│   │   │   ├── entities/                # Submission TypeORM entity
│   │   │   ├── processor/               # BullMQ SubmissionProcessor (Judge0 orchestration)
│   │   │   └── submission.service.ts    # Submission ingestion and status polling
│   │   ├── user/                        # User Management Domain
│   │   ├── data-sourse.ts               # TypeORM DataSource configuration & entity registry
│   │   ├── app.module.ts                # Root NestJS application module
│   │   └── main.ts                      # Backend entry point (CORS, Pipes, Filters, Bootstrap)
│   ├── test/                            # Unit and E2E Test Suites
│   ├── .env.example                     # Environment configuration blueprint
│   └── package.json                     # Backend scripts and dependencies
│
├── frontend/                            # Next.js 16 Client Application
│   ├── src/
│   │   ├── app/                         # Next.js App Router
│   │   │   ├── (protected)/             # Authenticated Routes (Dashboard, Problems, Contests, Roadmap)
│   │   │   ├── auth/                    # Login, Signup, Verify Email, Reset Password routes
│   │   │   ├── globals.css              # Global styles, Tailwind directives & CSS variable tokens
│   │   │   ├── layout.tsx               # Root Layout with JSON-LD, Fonts, and Theme Providers
│   │   │   ├── providers.tsx            # TanStack Query, ThemeProvider, Toaster wrappers
│   │   │   ├── robots.ts                # Dynamic search engine crawler instructions
│   │   │   └── sitemap.ts               # Automated XML sitemap generator
│   │   └── features/                    # Feature-Driven Architecture Modules
│   │       ├── auth/                    # Auth forms, validation schemas, stores, and hooks
│   │       ├── contests/                # Contest cards, filter tabs, countdowns, ICS export
│   │       ├── dashboard/               # Activity heatmaps, performance charts, metrics widgets
│   │       ├── landing/                 # Hero, interactive showcases, gamification section, CTA
│   │       ├── problems/                # Monaco workspace, hint drawer, test runner, problem catalog
│   │       ├── profile/                 # Profile analytics, badge showcase, multi-device sessions
│   │       ├── roadmap/                 # Interactive topic roadmap nodes and mastery indicators
│   │       ├── shared/                  # Reusable UI components (Dialogs, Buttons, Dropdowns, Navbars)
│   │       ├── sprints/                 # Speed coding battle arena and real-time sprint timers
│   │       └── submissions/             # Verdict tabs, AI analysis review drawer, diff viewer
│   ├── public/                          # Static assets, icons, logos, and OpenGraph images
│   ├── middleware.ts                    # Edge route protection & authentication token validation
│   ├── tailwind.config.js               # Tailwind design system tokens & animation keyframes
│   └── package.json                     # Frontend scripts and dependencies
│
├── codeSprint.postman_collection.json   # Comprehensive Postman API collection & environment
├── README.md                            # Comprehensive project technical documentation
└── README-CONTESTS.md                   # Dedicated contest aggregator implementation guide
```

---

## 💻 Getting Started & Installation

### 1. Prerequisites
Ensure you have the following runtimes and databases installed locally or provisioned in the cloud:
* **Node.js**: `v20.x` or higher
* **npm**: `v10.x` or higher (or `pnpm` / `yarn`)
* **PostgreSQL**: `v15.x` or higher (with `pgvector` extension enabled for AI RAG features)
* **Redis**: `v6.x` or higher (for BullMQ queue processing and caching)

---

### 2. Clone the Repository

```bash
git clone https://github.com/CodeSprint-ai/Code-Sprint.git
cd Code-Sprint
```

---

### 3. Backend Setup

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the `backend/` directory by copying `.env.example`:
   ```bash
   cp .env.example .env
   ```

   Fill in the required configuration keys:
   ```env
   # Database (PostgreSQL with pgvector)
   DATABASE_URL=postgresql://postgres:password@localhost:5432/codesprint?sslmode=disable

   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Authentication & JWT Secrets
   JWT_ACCESS_SECRET=your_super_secret_jwt_access_key_here
   JWT_REFRESH_SECRET=your_super_secret_jwt_refresh_key_here
   EMAIL_TOKEN_SECRET=your_email_verification_secret_here
   RESET_TOKEN_SECRET=your_password_reset_secret_here

   # OAuth 2.0 Credentials
   GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret

   # Email Service (Resend / SMTP)
   RESEND_API_KEY=re_your_resend_api_key
   MAIL_FROM=CodeSprint AI <noreply@yourdomain.com>
   SMTP_USER=your_smtp_email@example.com
   SMTP_PASS=your_smtp_password

   # Redis Configuration (BullMQ & Caching)
   REDIS_HOST=localhost
   REDIS_PORT=6379
   REDIS_PASSWORD=

   # Judge0 Code Execution Engine
   JUDGE0_BASE_URL=https://judge0-ce.p.rapidapi.com
   JUDGE0_RAPID_API_KEY=your_rapidapi_judge0_key
   JUDGE0_BASE64=true

   # CLIST.by Contest Aggregator API
   CLIST_API_USERNAME=your_clist_username
   CLIST_API_KEY=your_clist_api_key
   CLIST_CACHE_TTL_SECONDS=300
   CLIST_RATE_LIMIT_PER_MINUTE=10

   # Google Gemini AI Integration
   GEMINI_API_KEY=your_google_gemini_api_key
   ```

4. **Run Database Migrations**:
   ```bash
   npm run migration:run
   ```

5. **Start the Backend Development Server**:
   ```bash
   npm run start:dev
   ```
   *The NestJS API will boot up on `http://localhost:5000` (or your configured `PORT`).*

---

### 4. Frontend Setup

1. **Open a new terminal and navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Frontend Environment Variables**:
   Create a `.env.local` file in `frontend/`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   NEXT_PUBLIC_WS_URL=http://localhost:5000
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Start the Next.js Development Server**:
   ```bash
   npm run dev
   ```
   *The frontend client will be accessible at `http://localhost:3000`.*

---

## 📜 Available Scripts

### Backend (`/backend`)

| Command | Description |
| :--- | :--- |
| `npm run start:dev` | Starts the NestJS server in watch mode with automatic hot reload |
| `npm run build` | Compiles TypeScript source files into the production `dist/` bundle |
| `npm run start:prod` | Launches the compiled production build from `dist/main` |
| `npm run start:debug` | Runs the server in debug mode with an active V8 inspector |
| `npm run test` | Executes unit tests using Jest |
| `npm run test:watch` | Runs unit tests in interactive watch mode |
| `npm run test:cov` | Runs tests and generates a test coverage report in `coverage/` |
| `npm run test:e2e` | Executes End-to-End integration tests via Supertest |
| `npm run lint` | Runs ESLint across all TypeScript files with auto-fix enabled |
| `npm run format` | Formats all source and test files using Prettier |
| `npm run migration:generate` | Automatically generates a TypeORM migration based on entity diffs |
| `npm run migration:run` | Applies all pending database migrations against PostgreSQL |
| `npm run migration:revert` | Reverts the last applied TypeORM database migration |
| `npm run migration:show` | Displays the status of all available migrations |

### Frontend (`/frontend`)

| Command | Description |
| :--- | :--- |
| `npm run dev` | Launches the Next.js development server with Turbopack acceleration |
| `npm run build` | Generates the optimized Next.js production build |
| `npm run start` | Starts the Next.js production server |
| `npm run lint` | Analyzes code quality using Next.js ESLint configuration |

---

## 🌐 Live Demo & Deployment

### Production Deployments

* **Frontend Application**: Deployed natively on **Vercel** with global Edge CDN caching and dynamic App Router rendering.
* **Backend API & Queue Workers**: Suitable for deployment on **Render**, **Railway**, **Fly.io**, or containerized on **AWS ECS / DigitalOcean Kubernetes**.
* **Database & Vector Storage**: Provisioned on **Neon Serverless PostgreSQL** / **Supabase** with the `pgvector` extension enabled.
* **Redis Queue & Cache**: Provisioned via **Upstash Redis** or **Redis Cloud**.

### Environment Deployment Checklist
- [x] Configure production CORS whitelist (`https://code-sprint.com`) in `main.ts`.
- [x] Configure SSL mode `rejectUnauthorized: false` for managed PostgreSQL instances (e.g., Neon).
- [x] Store all API keys (`GEMINI_API_KEY`, `JUDGE0_RAPID_API_KEY`, `CLIST_API_KEY`) securely in backend environment variables.
- [x] Enable HTTP-only secure cookie attributes for production JWT handling behind reverse proxies (`trust proxy: 1`).

---

## 👨‍💻 Author & Attribution

### Engineering Lead
* **Jamal Nadeem** — *Full Stack Engineer & System Architect*
  * **GitHub**: [@Jamal-Nadeem](https://github.com/Jamal-Nadeem)
  * **Email**: [jamalnadeem2004@gmail.com](mailto:jamalnadeem2004@gmail.com)

### Academic & Institutional Recognition
* **Final Year Project (Batch 2022F Computer Science)**
  * **Institution**: *Sir Syed University of Engineering & Technology (SSUET), Karachi, Pakistan*
  * Developed by a 4-person engineering team following comprehensive systems engineering, database architecture, and project documentation standards under faculty supervision.
* **Startup Venture Finalist**:
  * Pitched under the **National Idea Bank (NIB) IV** initiative.
  * Selected as a **Finalist at the ASPIRE Pakistan Startup Hub**.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

<p align="center">
  <sub>Built with ❤️ for algorithmic learners, competitive programmers, and computer science students worldwide.</sub>
</p>
