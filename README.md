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


---

## 🧪 Local Development

### 🔄 Clone the Repo

```bash
git clone https://github.com/Hritesh49/work_sync.git
cd work_sync


⚙️ Backend Setup
cd server
npm install

Create a .env file inside server/ folder with this content:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

npm run dev

🎨 Frontend Setup
cd ../client
npm install
npm start

🚀 Deployment
Frontend → Vercel
Go to vercel.com

Import your GitHub repo

Set client/ as root directory

Add API URL in Vercel Environment Variables if needed

Backend → Render
Go to render.com

Create New Web Service

Choose your GitHub repo

Set root directory to server/

Add these environment variables:

PORT

MONGO_URI

JWT_SECRET


---

📄 License
This project is licensed under the MIT License – see the LICENSE file for details.

🙌 Author
Made with ❤️ by @Hritesh49


