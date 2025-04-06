# 🧠 Work Sync

A role-based task and performance management system built for streamlined team collaboration and accountability. Inspired by tools like Notion, it includes a dashboard for Admins, Managers, and Employees.

---

## 🚀 Features

### 👤 Role-Based Access
- **Admin**: Add/manage users, assign roles, and reset passwords.
- **Manager**: Assign tasks, track team performance, view analytics and leaderboards.
- **Employee**: View and complete tasks, monitor personal progress.

### 📊 Analytics & Leaderboards
- Task completion rate
- On-time delivery tracking
- Average task completion time
- Leaderboard ranking employees based on efficiency

### ✅ Task Management
- Assign, update, and track task status
- Individual dashboards
- Real-time performance insights

---

## 🛠️ Tech Stack

### Frontend (React + MUI)
- Material UI for UI components
- JWT-based authentication
- Role-protected routes
- Local storage for persistent login

### Backend (Node.js + Express)
- MongoDB for data storage (via Mongoose)
- RESTful APIs
- bcrypt for password hashing
- JWT for auth middleware

---

## 📂 Folder Structure

work_sync/ ├── client/ # Frontend (React) │ ├── public/ │ └── src/ ├── server/ # Backend (Express) │ ├── models/ │ ├── routes/ │ ├── controllers/ │ └── middleware/ └──