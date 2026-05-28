<div align="center">

```
█████╗ ██╗     ██████╗ ██████╗ ██████╗ ███████╗    ██████╗ ███████╗██╗   ██╗██╗███████╗██╗    ██╗███████╗██████╗
██╔══██╗██║    ██╔════╝██╔═══██╗██╔══██╗██╔════╝    ██╔══██╗██╔════╝██║   ██║██║██╔════╝██║    ██║██╔════╝██╔══██╗
███████║██║    ██║     ██║   ██║██║  ██║█████╗      ██████╔╝█████╗  ██║   ██║██║█████╗  ██║ █╗ ██║█████╗  ██████╔╝
██╔══██║██║    ██║     ██║   ██║██║  ██║██╔══╝      ██╔══██╗██╔══╝  ╚██╗ ██╔╝██║██╔══╝  ██║███╗██║██╔══╝  ██╔══██╗
██║  ██║██║    ╚██████╗╚██████╔╝██████╔╝███████╗    ██║  ██║███████╗ ╚████╔╝ ██║███████╗╚███╔███╔╝███████╗██║  ██║
╚═╝  ╚═╝╚═╝     ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝    ╚═╝  ╚═╝╚══════╝  ╚═══╝  ╚═╝╚══════╝ ╚══╝╚══╝ ╚══════╝╚═╝  ╚═╝
```

**8 specialized AI agents. One unified pipeline. Zero tolerance for bad code.**

[![Live](https://img.shields.io/badge/LIVE-ai--code--reviewer.theshivaji.in-a78bfa?style=flat-square&logo=vercel)](https://ai-code-reviewer.theshivaji.in)
![LangGraph](https://img.shields.io/badge/LangGraph-1.3.2-7c3aed?style=flat-square)
![Stack](https://img.shields.io/badge/MERN-PostgreSQL-0077B5?style=flat-square)
![Deploy](https://img.shields.io/badge/Render-Vercel-22c55e?style=flat-square)

</div>

---

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          HOW IT WORKS                                       │
│                                                                             │
│   paste code                                                                │
│   github url    ──►  FETCHER  ──►  ┌──────────────────────────────────┐   │
│   PR diff                          │         PARALLEL AGENTS           │   │
│                                    │                                    │   │
│                                    │  🔒 Security     (Mistral Large)  │   │
│                                    │  🐛 Bug Detect   (Llama 3.3 70B)  │   │
│                                    │  ⚡ Performance  (Groq/Llama)     │   │
│                                    │  ✅ Best Practic (Groq/Llama)     │   │
│                                    └──────────────┬───────────────────┘   │
│                                                   │                        │
│                                    ⚖️  Decision Layer  (Gemini)            │
│                                    Critical / Warning / Low                │
│                                                   │                        │
│                                    🔧 Fix Generator   (Gemini)            │
│                                    corrected code with // FIXED: comments  │
│                                                   │                        │
│                                    💬 Action Agent    (Gemini)            │
│                                    PR comment format + severity table      │
│                                                   │                        │
│                                    🎯 Final Reviewer  (Gemini)            │
│                                    score /10 + production readiness        │
│                                                   │                        │
│                                              JSON Response                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Features

```
INPUT                          OUTPUT
─────────────────────          ──────────────────────────────────────────
✦ Paste code directly          ✦ Security vulnerabilities (SQL injection,
✦ GitHub file URL                XSS, hardcoded secrets, CORS issues)
✦ PR diff URL                  ✦ Bug report with severity levels
✦ Auto language detection      ✦ Performance bottlenecks + Big-O
✦ isDiff mode (tokens saved)   ✦ Best practices (SOLID, clean code)
                               ✦ Severity: Critical / Warning / Low
                               ✦ Fixed code with FIXED: comments
                               ✦ PR comment (markdown table format)
                               ✦ Final score /10 + verdict
                               ✦ Shareable review link (no auth needed)
                               ✦ Score history tracking
```

---

## Stack

```
┌─────────────────┬──────────────────────────────────────────────┐
│ Layer           │ Technology                                    │
├─────────────────┼──────────────────────────────────────────────┤
│ Frontend        │ React 19 + Redux Toolkit + Framer Motion      │
│                 │ Tailwind CSS v4 + Lucide + React Markdown      │
├─────────────────┼──────────────────────────────────────────────┤
│ Backend         │ Node.js + Express 5                           │
├─────────────────┼──────────────────────────────────────────────┤
│ Database        │ PostgreSQL (Neon) + pg                        │
├─────────────────┼──────────────────────────────────────────────┤
│ AI Framework    │ LangGraph 1.3.2 + LangChain                  │
├─────────────────┼──────────────────────────────────────────────┤
│ Security Agent  │ Mistral Large                                 │
│ Bug + Perf      │ Llama 3.3 70B via Groq                       │
│ Decision + Fix  │ Gemini 2.0 Flash                             │
├─────────────────┼──────────────────────────────────────────────┤
│ Auth            │ JWT + bcrypt + HTTP-only cookies              │
├─────────────────┼──────────────────────────────────────────────┤
│ Deploy          │ Render (Backend) + Vercel (Frontend)         │
│                 │ Neon PostgreSQL + Docker ready               │
└─────────────────┴──────────────────────────────────────────────┘
```

---

## Project Structure

```
ai-code-reviewer/
│
├── Backend/
│   ├── Dockerfile
│   ├── server.js
│   └── src/
│       ├── ai/
│       │   ├── model.js              → Mistral + Groq + Gemini init
│       │   ├── langraph.js           → StateGraph pipeline
│       │   ├── fetcher.agent.js      → GitHub URL + PR diff fetch
│       │   ├── security.agent.js     → Mistral security scan
│       │   ├── decision.agent.js     → Severity classification
│       │   ├── fixgenerator.agent.js → Code correction
│       │   └── action.agent.js       → PR comment generation
│       ├── controllers/
│       │   ├── auth.controller.js    → register / login / logout
│       │   └── review.controller.js  → create / get / share
│       ├── db/
│       │   ├── database.js           → pg Pool (Neon + local)
│       │   └── Schema.js             → CREATE TABLE + ALTER
│       ├── middleware/
│       │   └── auth.middleware.js    → JWT protectRoute
│       ├── routes/
│       │   ├── auth.routes.js
│       │   └── review.routes.js
│       └── utils/
│           ├── detectlanguage.js     → pattern-based auto detect
│           └── extractScore.js       → regex score extraction
│
└── Frontend/
    └── src/
        ├── app/
        │   ├── App.jsx
        │   ├── app.routes.jsx        → Protected + Public guards
        │   └── app.store.js          → Redux store
        └── features/
            ├── auth/
            │   ├── auth.slice.js
            │   ├── pages/            → Login, Register
            │   ├── hook/useAuth.js
            │   └── services/api.js
            └── chat/
                ├── reviewSlice.js
                ├── pages/            → Dashboard, History, SharedReview
                ├── components/       → Navbar, AgentLoader, ReviewResult, ReviewTabs
                └── services/api.js
```

---

## Setup

```bash
# Clone
git clone https://github.com/TheShivaji/ai-code-reviewer.git
cd ai-code-reviewer

# Backend
cd Backend && npm install

# Frontend
cd ../Frontend && npm install
```

**Backend `.env`:**
```env
PORT=3000
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require

JWT_SECRET=your_secret
MISTRAL_API_KEY=your_key
GROQ_API_KEY=your_key
GEMINI_API_KEY=your_key
GITLAB_TOKEN=your_token        # optional — for private GitLab repos
FRONTEND_URL=http://localhost:5173
```

```bash
# Run backend
cd Backend && npm run dev

# Run frontend
cd Frontend && npm run dev
```

---

## API

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me

POST   /api/review/create          → triggers 8-agent pipeline
GET    /api/review/reviews          → history
GET    /api/review/score-history    → score trend
GET    /api/review/share/:token     → public shared review
```

---

## Roadmap

```
✅ Auth — register, login, JWT + HTTP-only cookies
✅ PostgreSQL schema — 14 columns per review
✅ Fetcher Agent — GitHub file + PR diff + paste
✅ Security Agent — Mistral Large
✅ Bug Detector — Llama 3.3 70B
✅ Performance Analyzer — Groq
✅ Best Practices Agent — Groq
✅ Decision Layer — Critical / Warning / Low
✅ Fix Generator — corrected code
✅ Action Agent — PR comment markdown table
✅ Final Reviewer — score + production verdict
✅ isDiff mode — analyze only changed lines
✅ Language auto-detection
✅ Score extraction + history
✅ Shareable review links
✅ Redux Toolkit + Framer Motion UI
✅ Dashboard — paste / GitHub URL / PR diff tabs
✅ History + Shared review pages
✅ Deployed — Render + Vercel + Neon PostgreSQL
✅ Docker ready
⬜ GitLab MCP integration
⬜ Webhook — auto-trigger on MR create
⬜ Voice review summary
```

---

<div align="center">

**Built by [Shivaji Jagdale](https://github.com/TheShivaji)**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat-square&logo=linkedin&logoColor=white)](https://linkedin.com/in/prathamesh-jagdale-48817330b)
[![GitHub](https://img.shields.io/badge/GitHub-171515?style=flat-square&logo=github&logoColor=white)](https://github.com/TheShivaji)
[![Portfolio](https://img.shields.io/badge/Portfolio-theshivaji.in-a78bfa?style=flat-square)](https://theshivaji.in)

*⭐ Star this repo if you find it useful*

</div>
