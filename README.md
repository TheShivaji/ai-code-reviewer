<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f0c29,30:1a1040,60:302b63,100:24243e&height=200&section=header&text=AI%20Code%20Reviewer&fontSize=52&fontAlign=50&animation=fadeIn&fontAlignY=40&desc=8-Agent%20LangGraph%20Pipeline%20%7C%20Auto%20GitLab%20MR%20Comments&descAlign=50&descAlignY=62&fontColor=ffffff&descColor=a78bfa" />

<br/>

[![Live](https://img.shields.io/badge/◉%20LIVE-ai--code--reviewer-7c3aed?style=for-the-badge)](https://ai-code-reviewer.theshivaji.in/)
![LangGraph](https://img.shields.io/badge/LangGraph-1.3.2-a855f7?style=flat-square)
![Agents](https://img.shields.io/badge/Agents-8-7c3aed?style=flat-square)
![Stack](https://img.shields.io/badge/MERN-PostgreSQL-0077B5?style=flat-square)
![Deploy](https://img.shields.io/badge/Render-Vercel-22c55e?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-f59e0b?style=flat-square)

> **8 specialized AI agents. One unified pipeline. Auto-posts review comments on GitLab MRs.**

</div>

---

## ⚡ What is this?

Not another "ask ChatGPT to review my code" wrapper.

This is a **stateful LangGraph pipeline** — 4 agents run in parallel, feed their results into a decision layer, which triggers a fix generator, then an action agent formats a PR comment table, and finally a staff-level reviewer produces a complete engineering report.

You paste code, drop a GitHub URL, link a PR, or give a GitLab MR URL — the agents handle the rest, and the review **automatically posts as a comment on your GitLab MR**.

---

## 🧠 Agent Pipeline

```mermaid
flowchart TD

A[🚀 GitLab Merge Request]

A --> B[📥 Fetcher Agent]

B --> C1[🔒 Security Review]
B --> C2[🐛 Bug Detection]
B --> C3[⚡ Performance Analysis]
B --> C4[✅ Best Practices Check]

C1 --> D[⚖️ Decision Layer]
C2 --> D
C3 --> D
C4 --> D

D --> E[🔧 Fix Generator]

E --> F[💬 Action Agent]

F --> G[🎯 Final Reviewer]

G --> H[📊 Score & Verdict]

H --> I[📝 Auto GitLab Comment]

```

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔒 **Security Scan** | SQL injection, XSS, hardcoded secrets, CORS issues |
| 🐛 **Bug Detection** | Logic errors, edge cases, null risks, bad error handling |
| ⚡ **Performance** | Big-O analysis, memory leaks, blocking operations |
| ✅ **Best Practices** | SOLID principles, clean code, naming conventions |
| ⚖️ **Severity Rating** | Critical / Warning / Low per category |
| 🔧 **Fix Generator** | Full corrected code with `// FIXED:` comments |
| 💬 **PR Comment** | Markdown table format — auto-posted to GitLab MR |
| 🎯 **Final Report** | Score /10, strengths, production readiness verdict |
| 🌐 **4 Input Types** | Paste / GitHub file URL / PR diff / GitLab MR URL |
| 🔗 **Share Links** | Unique URL per review — no auth to view |
| 📊 **Score History** | Track code quality over time |
| 🧠 **isDiff Mode** | Analyze only changed lines — saves tokens |
| 🔍 **Auto Detect** | Language detection from code patterns |

---

## 🛠️ Tech Stack

```
Frontend                 Backend                  Database
──────────────           ──────────────           ──────────
React 19                 Node.js                  PostgreSQL
Redux Toolkit            Express 5                Neon (cloud)
Framer Motion            LangGraph 1.3.2          pg driver
Tailwind CSS v4          LangChain
Lucide Icons             JWT + bcrypt
React Markdown           HTTP-only cookies

AI Models                Deploy
──────────────           ──────────────
Mistral Large            Render (Backend)
Llama 3.3 70B            Vercel (Frontend)
Gemini 2.0 Flash         Neon PostgreSQL
Groq inference           Docker ready
```

---

## 📁 Project Structure

```
ai-code-reviewer/
├── Backend/
│   ├── Dockerfile
│   ├── server.js
│   └── src/
│       ├── ai/
│       │   ├── model.js              ← Mistral + Groq + Gemini
│       │   ├── langraph.js           ← StateGraph pipeline
│       │   ├── fetcher.agent.js      ← GitHub + GitLab + PR fetch
│       │   │                           + postGitLabComment()
│       │   ├── security.agent.js     ← Mistral security scan
│       │   ├── decision.agent.js     ← severity classification
│       │   ├── fixgenerator.agent.js ← corrected code
│       │   └── action.agent.js       ← PR comment table format
│       ├── controllers/
│       │   ├── auth.controller.js
│       │   └── review.controller.js  ← handles all 4 input types
│       ├── db/
│       │   ├── database.js           ← pg Pool (Neon + local)
│       │   └── Schema.js             ← CREATE TABLE + ALTER
│       ├── middleware/auth.middleware.js
│       ├── routes/
│       │   ├── auth.routes.js
│       │   └── review.routes.js
│       └── utils/
│           ├── detectlanguage.js
│           └── extractScore.js
│
└── Frontend/
    └── src/
        ├── app/                       ← store + routes
        └── features/
            ├── auth/                  ← slice + pages + hooks
            └── chat/
                ├── reviewSlice.js
                ├── pages/             ← Dashboard, History, SharedReview
                ├── components/        ← Navbar, AgentLoader, ReviewResult, ReviewTabs
                └── services/api.js
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL (local) or Neon account
- API keys: Mistral, Groq, Gemini

### Installation

```bash
git clone https://github.com/TheShivaji/ai-code-reviewer.git
cd ai-code-reviewer

cd Backend && npm install
cd ../Frontend && npm install
```

### Environment — `Backend/.env`

```env
PORT=3000

# Database
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
# OR local
DB_HOST=localhost
DB_PORT=5432
DB_NAME=code_reviewer
DB_USER=postgres
DB_PASSWORD=your_password

# Auth
JWT_SECRET=your_secret
FRONTEND_URL=http://localhost:5173

# AI Keys
MISTRAL_API_KEY=your_key
GROQ_API_KEY=your_key
GEMINI_API_KEY=your_key

# GitLab (for auto-comment on MRs)
GITLAB_TOKEN=your_personal_access_token
```

### Run

```bash
cd Backend && npm run dev
cd Frontend && npm run dev
```

```
Frontend → http://localhost:5173
Backend  → http://localhost:3000
```

---

## 🔌 API

```
POST  /api/auth/register
POST  /api/auth/login
POST  /api/auth/logout
GET   /api/auth/me

POST  /api/review/create        ← triggers 8-agent pipeline
GET   /api/review/reviews        ← history
GET   /api/review/score-history  ← score trend
GET   /api/review/share/:token   ← public shared review
```

---

## 📌 Roadmap

- [x] Auth — JWT + HTTP-only cookies
- [x] PostgreSQL schema — 14 columns per review
- [x] Fetcher Agent — GitHub + PR diff + GitLab MR
- [x] 4 parallel agents — Security, Bug, Performance, Practices
- [x] Decision Layer — severity classification
- [x] Fix Generator — corrected code with comments
- [x] Action Agent — markdown table PR comment
- [x] Final Reviewer — score /10 + production verdict
- [x] isDiff mode — diff-only token optimization
- [x] Language auto-detection
- [x] Score history tracking
- [x] Shareable review links
- [x] Redux Toolkit + Framer Motion UI
- [x] GitLab MCP — auto-post review comment on MR
- [x] Deployed — Render + Vercel + Neon PostgreSQL
- [x] Docker support
- [ ] Webhook — auto-trigger on MR create
- [ ] Apply Fix — commit corrected code to GitLab

---

<div align="center">

**Built by [Shivaji Jagdale](https://github.com/TheShivaji)**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/prathamesh-jagdale-48817330b)
[![GitHub](https://img.shields.io/badge/GitHub-171515?style=for-the-badge&logo=github&logoColor=white)](https://github.com/TheShivaji)
[![Portfolio](https://img.shields.io/badge/Portfolio-7c3aed?style=for-the-badge&logo=safari&logoColor=white)](https://theshivaji.in)

*⭐ Star this repo if you find it useful*

</div>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:24243e,50:302b63,100:0f0c29&height=100&section=footer" />
ENDOFFILE
