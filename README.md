<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f2027,50:203a43,100:2c5364&height=220&section=header&text=AI%20Code%20Reviewer&fontSize=72&fontAlign=50&animation=fadeIn&fontAlignY=38&desc=Multi-Agent%20Code%20Review%20%7C%20LangGraph%20%2B%20Gemini&descAlign=50&descAlignY=60&fontColor=ffffff&descColor=67e8f9" alt="Header" />

</div>

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-18+-00d084?style=for-the-badge&logo=node.js&logoColor=white)
![LangGraph](https://img.shields.io/badge/LangGraph-Multi--Agent-06b6d4?style=for-the-badge)
![Gemini](https://img.shields.io/badge/Google_Gemini-AI_Core-0ea5e9?style=for-the-badge&logo=google&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES2024-f0db4f?style=for-the-badge&logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-22d3ee?style=for-the-badge)

<br/>

> **8 AI Agents. 1 Perfect Code Review. GitHub PR format mein output.**

</div>

---

## 🧠 What Is This?

```ts
const aiCodeReviewer = {
  what:    "Multi-agent system that reviews your code automatically",
  how:     "LangGraph orchestrates 8 parallel agents → Gemini synthesizes",
  output:  "GitHub PR comment — ready to paste or auto-post",
  stack:   ["Node.js", "LangGraph", "Gemini API", "HTML/CSS/JS"],
  builtBy: "TheShivaji",
};
```

Sirf apna code paste karo. Teen specialized AI agents parallel mein kaam karte hain — bugs, performance, aur best practices — phir Gemini ek clean final report banata hai **GitHub PR comment format** mein.

---

## 🔄 System Architecture

```
╔══════════════════════════════════════════════════════════════╗
║                      DEVELOPER INPUT                         ║
║              Code paste karo → Frontend UI                   ║
╚══════════════════════╦═══════════════════════════════════════╝
                       ║
                       ▼
╔══════════════════════════════════════════════════════════════╗
║              Node.js Backend  (Express API)                  ║
╚══════════════════════╦═══════════════════════════════════════╝
                       ║
                       ▼
╔══════════════════════════════════════════════════════════════╗
║              LangGraph Orchestration Layer                    ║
║               [ 3 Agents run in parallel ]                   ║
╠═══════════════╦══════════════════╦═══════════════════════════╣
║               ║                  ║                           ║
▼               ▼                  ▼                           ║
┌───────────┐ ┌────────────┐ ┌──────────────┐                 ║
│  AGENT 1  │ │  AGENT 2   │ │   AGENT 3    │                 ║
│           │ │            │ │              │                 ║
│    Bug    │ │  Perf.     │ │    Best      │                 ║
│ Detector  │ │ Analyzer   │ │  Practices   │                 ║
│           │ │            │ │  Checker     │                 ║
│ • Security│ │ • Big-O    │ │ • SOLID/DRY  │                 ║
│ • Logic   │ │ • Loops    │ │ • Naming     │                 ║
│ • Nulls   │ │ • Caching  │ │ • Patterns   │                 ║
│ • Leaks   │ │ • DB Query │ │ • Docs       │                 ║
└─────┬─────┘ └─────┬──────┘ └──────┬───────┘                 ║
      └─────────────┴───────────────┘                          ║
                    ║                                           ║
                    ▼                                           ║
╔══════════════════════════════════════════════════════════════╝
║              Google Gemini — Final Report Generator
║              All 3 agent outputs → 1 unified review
╚══════════════════════╦═══════════════════════════════════════╝
                       ║
                       ▼
╔══════════════════════════════════════════════════════════════╗
║         📋  GitHub PR Comment Format Output                  ║
╚══════════════════════════════════════════════════════════════╝
```

---

## 🕵️ Agent Breakdown

<table>
<tr>
<td width="33%">

### 🐛 Agent 1 — Bug Detector

- SQL Injection & XSS detection
- Hardcoded secrets / API keys
- Null/undefined edge cases
- Memory leaks & infinite loops
- Logic errors & wrong conditions

</td>
<td width="33%">

### ⚡ Agent 2 — Performance Analyzer

- Time & space complexity (Big-O)
- Nested loop optimizations
- Unnecessary re-renders
- DB query inefficiencies
- Caching & memoization gaps

</td>
<td width="33%">

### ✅ Agent 3 — Best Practices

- SOLID, DRY, KISS principles
- Function responsibility (SRP)
- Naming conventions
- Anti-pattern detection
- Comment & doc quality

</td>
</tr>
</table>

---

## 📤 Sample Output

```markdown
## 🤖 AI Code Review — by TheShivaji/ai-code-reviewer

---

### 🐛 Bug Report
| Severity | Line | Issue |
|----------|------|-------|
| 🔴 Critical | L34 | SQL query vulnerable to injection — use parameterized queries |
| 🟠 High | L12 | `user.id` accessed without null check — will crash on undefined |
| 🟡 Medium | L67 | Missing error handling in async function |

---

### ⚡ Performance Analysis
- 🔴 **O(n²)** nested loop at Line 45 — refactor using `Map` → O(n)
- 🟡 `getUserData()` called 3x in loop — extract outside, cache result
- 🟢 Async/await used correctly — no unnecessary blocking

---

### ✅ Best Practices
- 🔴 `processData()` doing 6 things — violates Single Responsibility Principle
- 🟡 Variables named `x`, `temp`, `data` — not descriptive enough
- 🟢 Good use of `const` and immutability throughout

---

### 📊 Final Summary
> **Overall Score: 6.5 / 10**
> Critical: 1 &nbsp;|&nbsp; High: 2 &nbsp;|&nbsp; Medium: 3 &nbsp;|&nbsp; Suggestions: 4

*Generated by 3 LangGraph agents + Gemini synthesis*
```

---

## 🏗️ Project Structure

```
ai-code-reviewer/
│
├── Backend/
│   ├── agents/
│   │   ├── bugDetector.js        # Agent 1 — security & logic
│   │   ├── performanceAnalyzer.js # Agent 2 — complexity & optimization
│   │   └── bestPractices.js      # Agent 3 — clean code & patterns
│   ├── graph/
│   │   └── reviewGraph.js        # LangGraph pipeline orchestration
│   ├── gemini/
│   │   └── summarizer.js         # Gemini final report generator
│   ├── routes/
│   │   └── review.js             # POST /api/review
│   └── index.js                  # Express server entry point
│
└── Frontend/
    ├── index.html                 # Code input UI
    ├── style.css                  # Dark themed styles
    └── main.js                   # API calls + result rendering
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **Gemini API Key** → [Get it free at Google AI Studio](https://aistudio.google.com/)

### Installation

```bash
# Clone the repo
git clone https://github.com/TheShivaji/ai-code-reviewer.git
cd ai-code-reviewer

# Backend setup
cd Backend
npm install

# Configure environment
cp .env.example .env
```

```env
# .env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

```bash
# Start the server
npm start

# Open Frontend — just open in browser
cd ../Frontend
open index.html    # or use VS Code Live Server
```

> Server runs at `http://localhost:3000`

---

## 🔧 API Reference

### `POST /api/review`

```json
// Request
{
  "code": "function fetchUser(id) { return db.query('SELECT * FROM users WHERE id=' + id) }",
  "language": "javascript"
}
```

```json
// Response
{
  "bugReport":            "SQL injection detected at line 1...",
  "performanceAnalysis":  "Query runs O(n) scan — add index on id...",
  "bestPractices":        "Function name is clear, but no error handling...",
  "prComment":            "## 🤖 AI Code Review\n...",
  "score":                5.5
}
```

---

## 🛠️ Tech Stack

<div align="center">

<img src="https://skillicons.dev/icons?i=js,nodejs,express,html,css&theme=dark&perline=5" />

</div>

<br/>

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | HTML + CSS + JS | Code input & result display |
| **Backend** | Node.js + Express | API server |
| **Agent Pipeline** | LangGraph | Multi-agent orchestration |
| **AI Brain** | Google Gemini | Final synthesis & report |
| **Output** | GitHub PR Markdown | Ready-to-use comment format |

---

## 🤝 Contributing

Contributions open hain! Koi naya agent add karna hai ya improvement suggest karni hai — welcome.

```bash
git checkout -b feature/your-feature
git commit -m "feat: add your feature"
git push origin feature/your-feature
# Open a PR 🎉
```

---

## 📄 License

MIT — free to use, fork, and build on.

---

<div align="center">

**Built by [TheShivaji](https://github.com/TheShivaji)**

*"Code review shouldn't be a bottleneck — it should be instant."*

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:2c5364,50:203a43,100:0f2027&height=100&section=footer" />

</div>

