# Interview AI Platform

> An AI-powered interview preparation platform that analyzes job descriptions, evaluates candidate resumes, and generates customized technical questions, behavioral scenarios, skill gaps, and daily study roadmaps using Google Gemini.

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-24.x-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Google Gemini](https://img.shields.io/badge/AI-Google_Gemini-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)

---

## About This Repository

This is an **open source contribution** to an existing project originally built by [@ankurdtio](https://github.com/ankurdtio).

I forked and contributed to this project as a learning and open source practice exercise. All my changes are clearly reflected in the commit history.

### My Contributions

| Area | What I Did |
|------|-----------|
| **UI Redesign** | Complete frontend redesign — soft light theme, white background, black borders, indigo accent. Replaced dark AI-generated look with a clean minimal design |
| **Loading Screen** | Built centered loading card with spinner and animated progress bar (was broken/top-left before) |
| **AI Model Fix** | Fixed broken Gemini model (`gemini-3-flash-preview` was 404) — updated to working `gemini-2.0-flash` |
| **Error Handling** | Added try/catch error handling to all 4 backend controllers with proper 500 responses |
| **Resume Optional** | Made resume PDF upload optional — app no longer crashes if no file is uploaded |
| **Auth Pages** | Redesigned Login and Register pages with scoped SCSS, black borders, white card |
| **Security Hardening** | Added root `.gitignore`, hardened `.dockerignore` files, fixed `.env.example` to use only placeholder values |
| **Interview Flow** | Added "Back to Studio", "Try Another Role" navigation buttons and "Start New Preparation" banner |
| **SCSS Fixes** | Replaced deprecated `darken()` SCSS functions with literal hex colors to fix Dart Sass 3 warnings |
| **Documentation** | Wrote this README and `README_DOCKER.md` |

---

## Features

- **Resume & JD Analysis** — Upload PDF resume and paste target job description
- **Match Score** — AI-generated candidate-to-job compatibility percentage
- **Skill Gap Matrix** — Missing skills categorized by severity
- **Tailored Q&A** — Technical and behavioral questions with model answers
- **Study Roadmap** — Day-by-day structured preparation timeline
- **Auth & History** — JWT-authenticated dashboard with past interview reports

---

## Tech Stack

- **Frontend:** React 19, Vite, React Router v7, SCSS
- **Backend:** Node.js, Express 5, Google Gemini API, MongoDB, Mongoose
- **Utilities:** Multer, pdf-parse, Puppeteer, Zod, JWT
- **DevOps:** Docker, Docker Compose, Nginx

---

## Quick Start

### 1. Backend Setup
```bash
cd Backend
npm install
cp .env.example .env
# Fill in your own values in .env
node server.js
```

### 2. Frontend Setup
```bash
cd Frontend
npm install
npm run dev
```

---

## Docker (One-Command Run)

```bash
docker compose up -d --build
```

---

## Endpoints

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000
- **Health Check:** http://localhost:3000/health

---

## Original Project

Original repository by [@ankurdtio](https://github.com/ankurdtio) — I contributed improvements on top of the existing codebase as open source practice.
