# 📘 ToggleNest

## 📖 Project Description

ToggleNest is a powerful task management platform developed mainly in JavaScript. It enables teams to dynamically update task in collaborative way also implemented active log updates of all members. Used kanban board with drag and drop feature.

---

## ✨ Features

- Real-time toggling & updates
- Scheduling feature rollouts
- Audit logs and change tracking
- API-first architecture

---

## 🛠️ Tech Stack

### Frontend
- React js
- HTML, CSS

### Backend
- Node.js (Express.js) or similar

### Database
- MongoDB / PostgreSQL / JSON

### Tools & Libraries
- dotenv
- Axios/Fetch
- JWT (authentication)
- socket.io

---

## ⚙️ Installation Guide

1. **Clone the repository**
   ```bash
   git clone https://github.com/ValayaDase/ToggleNest.git
   cd ToggleNest
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Configure environment variables**  
   (see `.env` section below)
4. **Run the project**
   ```bash
   npm start
   ```

---

## 🔑 Environment Variables (.env)

```env

# Backend
PORT=4000
MONGO_URI=mongodb://localhost:27017/togglenest
JWT_SECRET=your_toggle_secret
```

---

## 📂 Folder Structure (detailed)

```
ToggleNest/
│
├── public/                         # Static assets
│   └── index.html
│
├── src/
│   ├── api/                        # Axios/Fetch API methods
│   ├── assets/
│   ├── components/                 # FlagList, FlagEdit, etc.
│   ├── config/                     # App-wide configs
│   ├── context/                    # Auth, FeatureFlag context
│   ├── hooks/                      # Custom hooks
│   ├── layouts/                    # Layout wrappers
│   ├── pages/                      # Dashboard, Login, etc.
│   ├── routes/                     # Route definitions
│   ├── store/                      # Redux or global state
│   ├── styles/
│   ├── utils/
│   ├── App.js
│   └── index.js
│
├── backend/ (if monorepo)
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   └── server.js
│
├── .env
├── package.json
├── README.md
└── ...
```

---

## 📡 API Endpoints

> These are typical endpoints, update to your backend

```
POST    /api/auth/login                # User login
GET     /api/flags                     # Get all flags
POST    /api/flags                     # Create a new flag
PUT     /api/flags/:id                 # Update a flag
DELETE  /api/flags/:id                 # Delete flag
POST    /api/flags/:id/toggle          # Toggle flag state
GET     /api/audit                     # Fetch audit logs
```

---

## 🧪 Testing Instructions

1. **Component and integration tests**
   ```bash
   npm test
   ```
2. **End-to-end tests**
   ```bash
   npm run cypress
   ```
3. **API endpoint testing**
   - Use Postman/Insomnia or run automated tests in `/backend/tests`.

---

## 🚀 Deployment Guide

1. **Frontend**
    - Build: `npm run build`
    - Deploy files (Netlify, Vercel, etc.)

2. **Backend**
    - Deploy using Heroku, Railway, or your server
    - Set environment variables on your cloud platform

3. **DNS**
    - Map custom domains as needed

---

## 📱 Responsive Design Support

- Responsive grid layout
- Breakpoints for mobile/tablet/desktop views
- Material UI/Bootstrap/Custom media queries for responsiveness

---

## ⚡ Performance Optimizations

- Bundle splitting and code minification
- Memoization and virtualization for large flag lists
- HTTP caching for GET requests
- Debounced input handlers in dashboard

---

## 🧠 Challenges Faced

- Managing toggle propagation in real time
- Securing feature flag endpoints

---


