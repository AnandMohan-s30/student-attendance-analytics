# Student Attendance Analytics

A full-stack college attendance analytics system with JWT-based authentication, built with React, Node.js, Express, and MySQL.

## Features

- **Login page** – secure email/password authentication with show/hide toggle and loading state
- Dashboard with KPI cards, charts, and defaulter list
- Student management (CRUD with search)
- Subject management (CRUD with search)
- Attendance marking with bulk Present/Absent
- Attendance history with filters
- Analytics with distribution charts, ranking, monthly trends
- Student detail page with subject-wise breakdown
- Defaulter detection (below 75%)
- Logout with session-clear

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Recharts, Axios, React Router |
| Backend | Node.js, Express.js, bcrypt, jsonwebtoken |
| Database | MySQL |

## Project Structure

```
student-attendance-analytics/
├── frontend/               React + Vite app
│   └── src/
│       ├── context/        AuthContext (JWT session management)
│       ├── components/     Sidebar (with logout), PrivateRoute, …
│       ├── pages/          Login, Dashboard, Students, …
│       └── services/       api.js (axios, withCredentials)
├── backend/                Express REST API
│   ├── controllers/        auth.js, students.js, …
│   ├── middleware/         auth.js (JWT cookie verification)
│   ├── routes/             auth.js, students.js, …
│   ├── scripts/            seed-admin.js
│   ├── db/                 pool.js (MySQL connection)
│   └── .env.example        Required environment variables
└── database/
    ├── schema.sql          Core tables + sample data
    └── migrate_users.sql   Adds users table (run once)
```

## Authentication

- Passwords hashed with **bcrypt** (cost 12) — never stored in plain text
- Sessions use a **signed JWT stored in an HttpOnly `lax` SameSite cookie** (8 h expiry)
- All `/api/*` routes (except `/api/auth/login`) require a valid cookie
- Frontend redirects to `/login` on 401; `PrivateRoute` guards all pages

## Quick Start

### 1. Database

```bash
# Create tables and sample data
mysql -u root -p < database/schema.sql

# Add the users table (safe to re-run)
mysql -u root -p student_attendance_db < database/migrate_users.sql
```

### 2. Backend

```bash
cd backend
cp .env.example .env          # then edit .env with your values
npm install
npm run seed                  # creates the demo admin account
npm run dev
```

Backend runs on `http://localhost:5000`

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173` and proxies `/api` to port 5000.

## Environment Variables

Copy `backend/.env.example` to `backend/.env` and fill in your values:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=student_attendance_db
PORT=5000
FRONTEND_ORIGIN=http://localhost:5173

# Generate with:
# node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
JWT_SECRET=replace_with_a_long_random_secret

# Used only by:  npm run seed
SEED_ADMIN_NAME=Admin
SEED_ADMIN_EMAIL=admin@college.edu
SEED_ADMIN_PASSWORD=Admin@1234
```

> **Never commit `.env` to source control.** It is listed in `.gitignore`.

## Demo Account

| Field | Default |
|-------|---------|
| Email | `admin@college.edu` |
| Password | `Admin@1234` |

To change the password: update `SEED_ADMIN_PASSWORD` in `.env` and re-run `npm run seed`.

## API Overview

All endpoints except `POST /api/auth/login` require the JWT cookie (set automatically after login).

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | Login – sets HttpOnly JWT cookie |
| POST | /api/auth/logout | Logout – clears cookie |
| GET | /api/auth/me | Validate session / return current user |

### Students

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/students | List students with attendance % |
| POST | /api/students | Create student |
| PUT | /api/students/:id | Update student |
| DELETE | /api/students/:id | Delete student |

### Subjects

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/subjects | List subjects |
| POST | /api/subjects | Create subject |
| PUT | /api/subjects/:id | Update subject |
| DELETE | /api/subjects/:id | Delete subject |

### Attendance

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/attendance | List (filterable by date/subject/student) |
| POST | /api/attendance | Save attendance (array, upsert) |

### Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/analytics/overview | KPI counts |
| GET | /api/analytics/distribution | Attendance tier counts |
| GET | /api/analytics/top-bottom | Top 5 and bottom 5 students |
| GET | /api/analytics/subject-overview | Per-subject averages |
| GET | /api/analytics/monthly | Monthly trend |
| GET | /api/analytics/defaulters | Students below 75% |
| GET | /api/analytics/student/:id | Full student analytics |
| GET | /api/analytics/subject/:id | Full subject analytics |
