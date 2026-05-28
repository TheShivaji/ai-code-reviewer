<div align="center">

<img src="https://capsule-render.vercel.app/api?type=venom&color=0:7c3aed,50:a855f7,100:6d28d9&height=200&section=header&text=AI%20Code%20Reviewer&fontSize=60&fontAlign=50&animation=fadeIn&fontAlignY=50&fontColor=ffffff" />

<br/>

<a href="https://ai-code-reviewer.theshivaji.in">
  <img src="https://img.shields.io/badge/◉%20LIVE%20DEMO-ai--code--reviewer.theshivaji.in-7c3aed?style=for-the-badge&logoColor=white" />
</a>

<br/><br/>

<img src="https://img.shields.io/badge/LangGraph-1.3.2-a855f7?style=flat-square" />
<img src="https://img.shields.io/badge/Agents-8-7c3aed?style=flat-square" />
<img src="https://img.shields.io/badge/Stack-MERN%20%2B%20PostgreSQL-6d28d9?style=flat-square" />
<img src="https://img.shields.io/badge/Deploy-Render%20%2B%20Vercel-22c55e?style=flat-square" />
<img src="https://img.shields.io/badge/License-MIT-0077B5?style=flat-square" />

<br/><br/>

> **8 specialized AI agents. One unified pipeline. Zero tolerance for bad code.**

</div>

---

## ⚡ What is this?

Not another "ask ChatGPT to review my code" wrapper.

This is a **stateful LangGraph pipeline** where 4 agents run in parallel, feed their results into a decision layer, which triggers a fix generator, then an action agent formats a PR comment, and finally a staff-level reviewer produces a complete engineering report — all automatically.

You paste code, drop a GitHub URL, or link a PR. The agents handle the rest.

---

## 🧠 Agent Pipeline

<div align="center">

```
                    ┌─────────────────────────────────────┐
   paste code ─────▶│                                     │
   github url ─────▶│         INPUT PROCESSING            │
   PR diff ─────────▶│         (Fetcher Agent)             │
                    └──────────────┬──────────────────────┘
                                   │
                    ┌──────────────▼──────────────────────┐
                    │      PARALLEL EXECUTION              │
                    │                                     │
                    │  🔒 Security Agent  (Mistral Large) │
                    │  🐛 Bug Detector   (Llama 3.3 70B)  │
                    │  ⚡ Performance    (Groq / Llama)   │
                    │  ✅ Best Practices (Groq / Llama)   │
                    └──────────────┬──────────────────────┘
                                   │ all 4 complete
                    ┌──────────────▼──────────────────────┐
                    │  ⚖️  Decision Layer   (Gemini)       │
                    │     Critical / Warning / Low         │
                    └──────────────┬──────────────────────┘
                                   │
                    ┌──────────────▼──────────────────────┐
                    │  🔧 Fix Generator    (Gemini)        │
                    │     corrected code + // FIXED:       │
                    └──────────────┬──────────────────────┘
                                   │
                    ┌──────────────▼──────────────────────┐
                    │  💬 Action Agent     (Gemini)        │
                    │     PR comment + markdown table      │
                    └──────────────┬──────────────────────┘
                                   │
                    ┌──────────────▼──────────────────────┐
                    │  🎯 Final Reviewer   (Gemini)        │
                    │     score /10 + production verdict   │
                    └──────────────┬──────────────────────┘
                                   │
                              JSON Response
```

</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔒 **Security Scan** | SQL injection, XSS, hardcoded secrets, CORS misconfig |
| 🐛 **Bug Detection** | Logic errors, edge cases, null risks, bad error handling |
| ⚡ **Performance** | Big-O analysis, memory leaks, blocking operations |
| ✅ **Best Practices** | SOLID principles, clean code, naming conventions |
| ⚖️ **Severity Rating** | Critical / Warning / Low per issue |
| 🔧 **Fix Generator** | Full corrected code with `// FIXED:` comments |
| 💬 **PR Comment** | GitHub/GitLab markdown table format, copy-paste ready |
| 🎯 **Final Report** | Score /10, strengths, production readiness verdict |
| 🌐 **3 Input Types** | Paste code / GitHub file URL / PR diff URL |
| 🔗 **Share Links** | Unique URL per review — no auth needed to view |
| 📊 **Score History** | Track code quality improvement over time |
| 🧠 **isDiff Mode** | Analyze only changed lines — saves tokens |
| 🔍 **Auto Detect** | Language auto-detection from code patterns |

---

## 🛠️ Tech Stack

```
Frontend              Backend               Database
──────────────        ──────────────        ──────────────
React 19              Node.js               PostgreSQL
Redux Toolkit         Express 5             Neon (cloud)
Framer Motion         LangGraph 1.3.2       pg driver
Tailwind CSS v4       LangChain
Lucide Icons          JWT + bcrypt
React Markdown        HTTP-only cookies

AI Models             Deploy
──────────────        ──────────────
Mistral Large         Render (Backend)
Llama 3.3 70B         Vercel (Frontend)
Gemini 2.0 Flash      Neon PostgreSQL
Groq inference        Docker ready
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
│       │   ├── fetcher.agent.js      ← GitHub URL + PR diff
│       │   ├── security.agent.js     ← vulnerability scan
│       │   ├── decision.agent.js     ← severity classification
│       │   ├── fixgenerator.agent.js ← code correction
│       │   └── action.agent.js       ← PR comment format
│       ├── controllers/
│       │   ├── auth.controller.js
│       │   └── review.controller.js
│       ├── db/
│       │   ├── database.js           ← pg Pool (Neon + local)
│       │   └── Schema.js             ← CREATE TABLE + ALTER
│       ├── middleware/auth.middleware.js
│       ├── routes/
│       │   ├── auth.routes.js
│       │   └── review.routes.js
│       └── utils/
│           ├── detectlanguage.js     ← pattern-based detection
│           └── extractScore.js       ← regex score extraction
│
└── Frontend/
    └── src/
        ├── app/                      ← store + routes
        └── features/
            ├── auth/                 ← slice + pages + hooks
            └── chat/                 ← slice + pages + components
                ├── pages/            ← Dashboard, History, SharedReview
                └── components/       ← Navbar, AgentLoader, ReviewResult
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

# Backend
cd Backend && npm install

# Frontend  
cd ../Frontend && npm install
```

### Environment

Create `Backend/.env`:

```env
PORT=3000

# Database (use one)
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
# OR
DB_HOST=localhost
DB_PORT=5432
DB_NAME=code_reviewer
DB_USER=postgres
DB_PASSWORD=your_password

# Auth
JWT_SECRET=your_jwt_secret

# AI Keys
MISTRAL_API_KEY=your_key
GROQ_API_KEY=your_key
GEMINI_API_KEY=your_key

# Optional
GITLAB_TOKEN=your_token
FRONTEND_URL=http://localhost:5173
```

### Run

```bash
# Terminal 1 — Backend
cd Backend && npm run dev

# Terminal 2 — Frontend
cd Frontend && npm run dev
```

```
Frontend → http://localhost:5173
Backend  → http://localhost:3000
```

---

## 🔌 API Reference

```
Auth
────────────────────────────────────────
POST  /api/auth/register
POST  /api/auth/login
POST  /api/auth/logout
GET   /api/auth/me

Reviews
────────────────────────────────────────
POST  /api/review/create          8-agent pipeline trigger
GET   /api/review/reviews          history (auth required)
GET   /api/review/score-history    score trend (auth required)
GET   /api/review/share/:token     public shared review
```

---

## 📌 Roadmap

- [x] Full auth system — JWT + HTTP-only cookies
- [x] PostgreSQL schema — 14 columns per review
- [x] Fetcher Agent — GitHub file + PR diff + paste
- [x] 4 parallel agents — Security, Bug, Performance, Best Practices
- [x] Decision Layer — Critical / Warning / Low severity
- [x] Fix Generator — corrected code with comments
- [x] Action Agent — PR comment markdown table
- [x] Final Reviewer — score + production verdict
- [x] isDiff mode — diff-only analysis
- [x] Language auto-detection
- [x] Score history tracking
- [x] Shareable review links
- [x] Redux Toolkit + Framer Motion UI
- [x] Deployed — Render + Vercel + Neon PostgreSQL
- [x] Docker support
- [ ] GitLab MCP integration
- [ ] Webhook — auto-trigger on MR create

---

## 🤝 Contributing

```bash
# Fork → Clone → Branch → Push → PR
git checkout -b feature/your-feature
git commit -m "feat: your feature"
git push origin feature/your-feature
```

---

<div align="center">

**Built by Shivaji Jagdale**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/prathamesh-jagdale-48817330b)
[![GitHub](https://img.shields.io/badge/GitHub-171515?style=for-the-badge&logo=github&logoColor=white)](https://github.com/TheShivaji)
[![Portfolio](https://img.shields.io/badge/Portfolio-a855f7?style=for-the-badge&logo=safari&logoColor=white)](https://theshivaji.in)

<br/>

*⭐ Star this repo if you find it useful — keeps the motivation alive*

<img src="https://capsule-render.vercel.app/api?type=venom&color=0:6d28d9,50:7c3aed,100:a855f7&height=100&section=footer" />

</div>
