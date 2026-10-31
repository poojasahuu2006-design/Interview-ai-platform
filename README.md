# Interview AI Platform

> An AI-powered interview preparation platform that analyzes job descriptions, evaluates candidate resumes, and generates customized technical questions, behavioral scenarios, skill gaps, daily study roadmaps, and tailored ATS resumes using Google Gemini.

[![Live Demo](https://img.shields.io/badge/Demo-Live_Website-4F46E5?style=for-the-badge&logo=cloudflare&logoColor=white)](https://interview-ai-p.pages.dev/login)
[![GitHub Profile](https://img.shields.io/badge/GitHub-poojasahuu2006--design-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/poojasahuu2006-design)
[![Repository](https://img.shields.io/badge/Repository-Interview--ai--platform-blue?style=for-the-badge&logo=git&logoColor=white)](https://github.com/poojasahuu2006-design/Interview-ai-platform)

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-24.x-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Google Gemini](https://img.shields.io/badge/AI-Google_Gemini-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![Cloudflare](https://img.shields.io/badge/Cloudflare_Pages-Deployed-F38020?logo=cloudflare&logoColor=white)](https://interview-ai-p.pages.dev/login)
[![Render](https://img.shields.io/badge/Render-Backend_Live-46E3B7?logo=render&logoColor=black)](https://interview-ai-platform-87ar.onrender.com)

---

## 🚀 Live Application

- **Live URL:** [https://interview-ai-p.pages.dev/login](https://interview-ai-p.pages.dev/login)
- **Frontend Hosting:** Cloudflare Pages
- **Backend Hosting:** Render
- **Database:** MongoDB Atlas

---

## 👩‍💻 About This Repository

This project is maintained by **[@poojasahuu2006-design](https://github.com/poojasahuu2006-design)** as an **open source contribution & enhancement** building upon an initial codebase by [@ankurdtio](https://github.com/ankurdtio).

All enhancements, bug fixes, UI modernization, and cloud deployment hardening are clearly documented in the commit history.

### Key Contributions & Enhancements

| Area | What I Built & Fixed |
|------|----------------------|
| **UI Modernization** | Complete redesign featuring a soft minimal theme: pure white cards, clean black borders, and modern indigo accents. Replaced harsh AI-style layouts with clean, human-designed aesthetics. |
| **Centered Auth & Loading** | Fixed broken top-left loading screen by creating a centered, animated loading card with spinner and active progress pulse. Added scoped SCSS for Login and Register. |
| **Resilient AI Engine** | Built a multi-model failover engine (`gemini-2.5-flash-lite`, `gemini-3.5-flash-lite`, `gemini-3.5-flash`, `gemini-3.8-flash`) to eliminate 503 high-demand capacity spikes. |
| **Tailored ATS Resume Generator** | Re-engineered resume generation with strict 1-to-2 page constraints, centered candidate header, and zero-margin page formatting to remove browser header/footer stamps. |
| **Dual-Token Authentication** | Solved cross-domain cookie blocking by introducing a dual-token architecture (HTTP-only SameSite=None cookies + `Authorization: Bearer <token>` in localStorage). |
| **Robust Error Handling** | Added comprehensive `try/catch` blocks and user-facing error banners across authentication and report generation controllers. |
| **Cloud Deployment** | Successfully deployed the full stack into production: Frontend on Cloudflare Pages, REST API on Render, and data layer on MongoDB Atlas. |
| **Security & Git Hardening** | Sealed all environment variables (`.env` protected across 3 levels of `.gitignore` and `.dockerignore`), cleaned `.env.example` templates, and verified zero leaked credentials in git history. |

---

## 💡 Features

- **Instant Match Score** — Quantitative candidate-to-job compatibility rating (0-100%).
- **Interactive Question Bank** — Expandable technical and behavioral interview questions tailored to your past projects and target JD, complete with interviewer intentions and model answers.
- **Skill Gap Matrix** — Categorized missing skills rated by impact (`High`, `Medium`, `Low`).
- **Day-by-Day Preparation Roadmap** — Daily structured preparation milestones.
- **ATS Resume Export** — Download tailored, high-impact 1-to-2 page ATS resumes optimized for keyword parsers.
- **Persistent User Blueprints** — Secure JWT authentication with past preparation plans saved to your dashboard.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, React Router v7, SCSS, Axios
- **Backend:** Node.js, Express 5, Google Gemini API (`@google/genai`), MongoDB, Mongoose, Zod
- **Infrastructure:** Cloudflare Pages, Render, MongoDB Atlas, Docker, Nginx

---

## 💻 Local Development Setup

### 1. Backend Setup
```bash
cd Backend
npm install
cp .env.example .env
# Fill in your MONGO_URI, JWT_SECRET, and GOOGLE_GENAI_API_KEY in .env
node server.js
```

### 2. Frontend Setup
```bash
cd Frontend
npm install
npm run dev
```

---

## 🐳 Docker Deployment

Run the complete multi-container stack locally with one command:
```bash
docker compose up -d --build
```

---

## 🤝 Attribution

Original foundational concept by [@ankurdtio](https://github.com/ankurdtio). Enhanced, modernized, secured, and deployed by [@poojasahuu2006-design](https://github.com/poojasahuu2006-design).
