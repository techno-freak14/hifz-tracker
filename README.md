# Hifz Progress Tracker — ZaryahPlus

A premium internal web tool for Hifz coordinators to manage and track students' Quran memorization progress. Built as part of the ZaryahPlus internship program.

---

## What It Does

- Add students and log their current Juz (1–30)
- View live stats — Total Students, Active Learners, Completed Hifz
- Track each student's memorization progress with a visual progress bar
- Remove students when they leave the program
- All data persists in a database across server restarts
- Hifz Calculator — estimate completion date based on daily memorization pace
- Milestone Badges — celebrate student achievements
- Study Mode — Surah library and mistake logging for focused sessions

---

## Tech Stack

| Layer      | Tool                                  |
| ---------- | ------------------------------------- |
| Frontend   | HTML, CSS, JavaScript (no frameworks) |
| Backend    | FastAPI (Python)                      |
| Database   | SQLite                                |
| Validation | Pydantic                              |
| Server     | Uvicorn                               |

---

## Project Structure

HIFZ-TRACKER/
├── backend/
│ ├── main.py ← FastAPI routes
│ ├── database.py ← SQLite setup
│ └── hifz.db ← Auto-created database
├── frontend/
│ ├── index.html ← Main UI
│ ├── app.js ← All frontend logic
│ └── style.css ← Styling
└── README.md

---

## Setup Instructions

### 1. Make sure Python is installed

python --version
Requires Python 3.9+

### 2. Create and activate a virtual environment

python -m venv venv
venv\Scripts\activate # Windows
source venv/bin/activate # Mac/Linux

### 3. Install dependencies

pip install fastapi uvicorn pydantic

### 4. Run the server

cd backend
uvicorn main:app --reload --port 8000

### 5. Open the app

http://localhost:8000

---

## API Routes

| Method | Route            | Description       |
| ------ | ---------------- | ----------------- |
| GET    | `/students`      | Get all students  |
| POST   | `/students`      | Add a new student |
| DELETE | `/students/{id}` | Remove a student  |

---

## Validation Rules

- Name cannot be empty or whitespace
- Juz must be a number between 1 and 30
- Invalid inputs return a clear error — server never crashes

---

## Key Features

- No page reloads — all updates via JavaScript Fetch API
- No ORMs — raw SQL only (INSERT INTO, SELECT, DELETE)
- No frontend frameworks — plain HTML, CSS, JS
- Data survives server restarts — stored in hifz.db

---

ZaryahPlus | Hifz Progress Tracker | Intern Build | 2026
