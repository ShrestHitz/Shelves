# Shelves Academic Management System — How to Run

## STEP 1 — Set Up MySQL Database

1. Open **MySQL Workbench**
2. Connect using: Host=`localhost`, User=`root`, Password=`MySql`
3. Click **File → Open SQL Script** → select `backend/schema.sql`
4. Click the ⚡ **Execute** button
5. You should see `academic_app` appear in the left panel with all tables

---

## STEP 2 — Start the Backend

Open VS Code, open a terminal, run:

```
cd backend
npm install
npm run dev
```

You should see:
```
Server running on port 5000
Database connected successfully
```

---

## STEP 3 — Start the Frontend

Open a **second terminal** in VS Code:

```
cd frontend
npm install
npm start
```

Browser opens at `http://localhost:3000`

---

## STEP 4 — Log In

| Role    | Email                 | Password |
|---------|-----------------------|----------|
| Student | aarav@gmail.com       | pass123  |
| Student | priya@gmail.com       | pass123  |
| Admin   | admin1@college.edu    | any      |

---

## STEP 5 — Prove It Saves to MySQL (For Faculty)

1. In the app, go to **Students** → **Add Student** → fill form → Save
2. Go to MySQL Workbench, run:
```sql
USE academic_app;
SELECT * FROM student;
```
3. You'll see the new student appear ✅

**Check all tables:**
```sql
USE academic_app;
SELECT * FROM student;
SELECT * FROM subject;
SELECT * FROM assignment;
SELECT * FROM learning_material;
SELECT * FROM exam;
SELECT * FROM announcement;
SELECT * FROM community_post;
```

---

## Features

| Page         | Add | Edit | Delete |
|-------------|-----|------|--------|
| Students     | ✅  | ✅   | ✅     |
| Subjects     | ✅  | ✅   | ✅     |
| Assignments  | ✅  | ✅   | ✅     |
| Materials    | ✅  | ✅   | ✅     |
| Exams        | ✅  | ✅   | ✅     |
| Announcements| ✅  | ✅   | ✅     |
| Community    | ✅  | ✅   | ✅     |

---

## Every Time You Want to Run

1. Terminal 1 (backend): `cd backend` → `npm run dev`
2. Terminal 2 (frontend): `cd frontend` → `npm start`
