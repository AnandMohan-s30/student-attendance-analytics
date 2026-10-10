<h1 align="center">🎓 Student Attendance Analytics</h1>

<p align="center">
  A full-stack college attendance analytics system with JWT-based authentication, built with React, Node.js, Express, and MySQL.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/MySQL-Database-4479A1?style=for-the-badge&logo=mysql&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-Styling-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" />
</p>

---

## 📖 About

**Student Attendance Analytics** is a production-ready, full-stack attendance management platform designed for colleges and universities. It replaces manual attendance registers with a fast, searchable, and visually rich web application that gives faculty and administrators real-time insight into student attendance patterns.

The system was built with a clean separation of concerns — a React 18 single-page application on the frontend communicates with a stateless Express REST API on the backend, which in turn reads and writes to a MySQL 8 relational database. Authentication is handled entirely through HttpOnly JWT cookies, meaning no tokens are ever exposed to JavaScript, protecting against XSS attacks by design.

### Why it was built

Tracking attendance manually is error-prone and slow. Generating reports from spreadsheets takes hours. This application solves both problems: attendance is marked in bulk in seconds, and every chart, ranking, and defaulter report is computed in real time from the database — no manual aggregation needed.

### What makes it complete

Most attendance tools only cover marking. This one goes further:

- **Dashboard** gives an instant college-wide health check — total students, total subjects, sessions conducted, and a defaulter count, all on one screen alongside bar and pie charts.
- **Analytics engine** produces five distinct views: attendance distribution by tier (Excellent / Good / Warning / Critical), top and bottom 5 students by percentage, per-subject averages, monthly attendance trends, and a full individual student breakdown by subject.
- **Defaulter detection** automatically surfaces every student below the 75% threshold with their exact percentage, so action can be taken without manually scanning records.
- **Secure by default** — passwords are bcrypt-hashed at cost 12, sessions live in a signed HttpOnly cookie that expires after 8 hours, and every API route except login is protected by JWT middleware.
- **Clean data model** — the `attendance` table uses a composite unique key on `(student_id, subject_id, attendance_date)`, so re-submitting a day's attendance is always safe (upsert, never duplicate).

### Who it's for

Faculty who need to mark and review attendance quickly, and administrators who need college-wide or department-level attendance reports without writing a single query.

---

## 📌 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Environment Variables](#-environment-variables)
- [Demo Account](#-demo-account)
- [API Overview](#-api-overview)
- [Authentication](#-authentication)

---

## ✨ Features

| Module | Description |
|--------|-------------|
| 🔐 **Login** | Secure email/password auth with show/hide toggle and loading state |
| 📊 **Dashboard** | KPI cards, attendance charts, and defaulter list at a glance |
| 👨‍🎓 **Students** | Full CRUD with search — create, edit, delete students |
| 📚 **Subjects** | Full CRUD with search — manage subjects and faculty |
| ✅ **Attendance** | Bulk mark Present/Absent per subject per day |
| 🗂️ **History** | Filter attendance records by date, subject, or student |
| 📈 **Analytics** | Distribution charts, rankings, monthly trends, subject-wise breakdown |
| 🔍 **Student Detail** | Per-student subject-wise attendance breakdown |
| ⚠️ **Defaulters** | Auto-detect students below 75% attendance threshold |
| 🚪 **Logout** | Secure session clear via HttpOnly cookie |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, Vite, Tailwind CSS, Recharts, Axios, React Router v6 |
| **Backend** | Node.js, Express.js, bcrypt, jsonwebtoken, cookie-parser |
| **Database** | MySQL (mysql2/promise connection pool) |
| **Auth** | JWT stored in HttpOnly SameSite cookie (8h expiry) |
| **Dev Tools** | nodemon, dotenv |

---

## 📁 Project Structure

```
student-attendance-analytics/
├── frontend/                   React + Vite app
│   ├── index.html
│   └── src/
│       ├── context/            AuthContext — JWT session management
│       ├── components/         Sidebar, Header, KpiCard, PrivateRoute, …
│       ├── pages/              Login, Dashboard, Students, Subjects,
│       │                       Attendance, Analytics, StudentDetails
│       ├── services/           api.js — axios instance (withCredentials)
│       └── utils/              attendance.js — shared helpers
├── backend/                    Express REST API
│   ├── server.js               Entry point
│   ├── controllers/            analytics, attendance, auth, students, subjects
│   ├── middleware/             auth.js — JWT cookie verification
│   ├── routes/                 auth, students, subjects, attendance, analytics
│   ├── scripts/                seed-admin.js
│   ├── db/                     pool.js — MySQL connection pool
│   └── .env.example            Required environment variables (template)
└── database/
    ├── schema.sql              Core tables + 20 students + sample attendance
    └── migrate_users.sql       Adds users table (run once on existing DB)
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js ≥ 18
- MySQL ≥ 8
- npm

### 1. Database

```bash
# Create tables and load sample data
mysql -u root -p < database/schema.sql

# Add the users table (safe to re-run on existing DB)
mysql -u root -p student_attendance_db < database/migrate_users.sql
```

### 2. Backend

```bash
cd backend
cp .env.example .env        # fill in your DB password and JWT secret
npm install
npm run seed                # creates the demo admin account
npm run dev                 # starts on http://localhost:5000
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev                 # starts on http://localhost:5173
```

> The Vite dev server proxies all `/api` requests to `http://localhost:5000` automatically.

---

## ⚙️ Environment Variables

Copy `backend/.env.example` → `backend/.env` and fill in your values:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=student_attendance_db
PORT=5000

# Must match your Vite dev server origin
FRONTEND_ORIGIN=http://localhost:5173

# Generate a strong secret:
# node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
JWT_SECRET=replace_with_a_long_random_secret

# Used only by: npm run seed
SEED_ADMIN_NAME=Admin
SEED_ADMIN_EMAIL=admin@college.edu
SEED_ADMIN_PASSWORD=Admin@1234
```

> ⚠️ **Never commit `.env` to source control.** It is in `.gitignore`.

---

## 🔐 Authentication

- Passwords hashed with **bcrypt** (cost factor 12) — never stored in plain text
- Sessions use a **signed JWT in an HttpOnly `SameSite=lax` cookie** (8 h expiry)
- All `/api/*` routes except `POST /api/auth/login` require a valid cookie
- Frontend auto-redirects to `/login` on any 401; `<PrivateRoute>` guards all pages
- Stale cookies are cleared automatically on verification failure

---

## 🧪 Demo Account

| Field | Value |
|-------|-------|
| Email | `admin@college.edu` |
| Password | `Admin@1234` |

To rotate the password: update `SEED_ADMIN_PASSWORD` in `.env` and re-run `npm run seed`.

---

## 📡 API Overview

All endpoints except `POST /api/auth/login` require the JWT cookie (set automatically after login).

<details>
<summary><strong>Auth</strong></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/login` | Login — sets HttpOnly JWT cookie |
| `POST` | `/api/auth/logout` | Logout — clears cookie |
| `GET` | `/api/auth/me` | Validate session / return current user |

</details>

<details>
<summary><strong>Students</strong></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/students` | List all students with attendance % |
| `POST` | `/api/students` | Create a student |
| `PUT` | `/api/students/:id` | Update a student |
| `DELETE` | `/api/students/:id` | Delete a student |

</details>

<details>
<summary><strong>Subjects</strong></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/subjects` | List all subjects |
| `POST` | `/api/subjects` | Create a subject |
| `PUT` | `/api/subjects/:id` | Update a subject |
| `DELETE` | `/api/subjects/:id` | Delete a subject |

</details>

<details>
<summary><strong>Attendance</strong></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/attendance` | List records (filter by date / subject / student) |
| `POST` | `/api/attendance` | Save attendance batch (upsert) |

</details>

<details>
<summary><strong>Analytics</strong></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/analytics/overview` | KPI counts |
| `GET` | `/api/analytics/distribution` | Attendance tier counts |
| `GET` | `/api/analytics/top-bottom` | Top 5 and bottom 5 students |
| `GET` | `/api/analytics/subject-overview` | Per-subject averages |
| `GET` | `/api/analytics/monthly` | Monthly attendance trend |
| `GET` | `/api/analytics/defaulters` | Students below 75% |
| `GET` | `/api/analytics/student/:id` | Full analytics for one student |
| `GET` | `/api/analytics/subject/:id` | Full analytics for one subject |

</details>

---

<p align="center">Made with ❤️ by <a href="https://github.com/AnandMohan-s30">AnandMohan-s30</a></p>
