# 🚀 Interview AI

> An AI-powered interview preparation platform that analyzes job descriptions, evaluates candidate resumes, and generates customized technical questions, behavioral scenarios, skill gaps, and daily study roadmaps using Google Gemini.

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-24.x-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Google Gemini](https://img.shields.io/badge/AI-Google_Gemini-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)

---

## ✨ Features

- **Resume & JD Analysis:** Upload PDF resumes and analyze target job requirements.
- **Match Score:** Instant candidate-to-job compatibility percentage (0–100%).
- **Skill Gap Matrix:** Pinpoints missing skills categorized by severity (`High`, `Medium`, `Low`).
- **Tailored Q&A:** Technical and behavioral questions with interviewer intentions and model answers.
- **Study Roadmap:** Day-by-day structured preparation timeline.
- **Custom Resume Export:** Generates an ATS-tailored resume PDF via Puppeteer.
- **Auth & History:** JWT-authenticated dashboard tracking past interview blueprints.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, React Router v7, SCSS (Deep Midnight Slate theme)
- **Backend:** Node.js, Express 5, Google Gemini API (`@google/genai`), MongoDB, Mongoose
- **Utilities:** Multer, `pdf-parse`, Puppeteer, Zod, JWT
- **DevOps:** Docker, Docker Compose, Nginx

---

## ⚡ Quick Start

### 1. Backend Setup
```bash
cd Backend
npm install
```
Configure `Backend/.env`:
```env
PORT=3000
MONGO_URI="mongodb://127.0.0.1:27017/interview-ai"
JWT_SECRET=your_jwt_secret
GOOGLE_GENAI_API_KEY=your_gemini_api_key
```
Start server:
```bash
node server.js
```

### 2. Frontend Setup
```bash
cd Frontend
npm install
npm run dev
```

---

## 🐳 Docker (One-Command Run)

```bash
docker compose up -d --build
```

---

## 🌐 Endpoints

- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:3000](http://localhost:3000)
- **Health Check:** [http://localhost:3000/health](http://localhost:3000/health)
