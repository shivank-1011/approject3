# 💰 Expense Splitter

A **full-stack web application** built with **React.js**, **Express.js**, **MySQL**, and **Prisma** to simplify **group expense management**.  
Expense Splitter helps users record, track, and settle shared expenses — whether it's for trips, shared apartments, or projects — ensuring fairness and transparency.

---

## 🧾 Introduction

**Expense Splitter** eliminates the manual hassle of dividing shared expenses among friends or groups.  
It automatically calculates **who owes whom**, displays clear summaries, and keeps settlement records — all within a simple and responsive interface.

### 🎯 Goals
- Simplify expense tracking and settlements.  
- Offer clear visibility into shared balances.  
- Maintain data consistency, security, and scalability.  

---

## ⚙️ Features

| Feature | Description | Rationale | Implementation |
|----------|--------------|------------|----------------|
| **1. User Authentication & Authorization** | Secure login/signup using JWT tokens. | Ensures privacy and security for all users. | **Frontend:** React + Context API.<br>**Backend:** Express + JWT.<br>**DB:** Prisma `User` model. |
| **2. Group Creation & Management** | Create, join, and manage expense groups. | Organize expenses by event or category. | **Frontend:** Modals & list views.<br>**Backend:** Group routes in Express.<br>**DB:** `Group` + `GroupMember` models. |
| **3. Add & Manage Expenses** | Record expenses with payer, participants, and date. | Core functionality of the system. | **Frontend:** React forms.<br>**Backend:** Expense CRUD routes.<br>**DB:** `Expense`, `ExpenseSplit` models. |
| **4. Expense Splitting Logic** | Calculates each person's share and owed amount. | Automates fairness and accuracy. | **Backend:** Business logic in Express.<br>**DB:** Prisma aggregation queries. |
| **5. Settlement Summary / Balances View** | Shows who owes whom and pending balances. | Provides financial transparency. | **Frontend:** Summary table & charts.<br>**Backend:** Aggregated balance endpoint. |
| **6. Notifications / Activity Feed** | Alerts users when new expenses are added or updated. | Improves collaboration and visibility. | **Frontend:** Toast notifications.<br>**Backend:** Prisma event triggers. |
| **7. Settlement Records** | Record repayments and maintain transaction history. | Enables accountability and tracking. | **DB:** `Settlement` model.<br>**Backend:** Settlement API routes. |
| **8. Dashboard & Analytics** | Visual insights into total spend and owed amounts. | Gives quick financial overview. | **Frontend:** Recharts / Chart.js.<br>**Backend:** Analytics endpoint. |
| **9. Responsive UI / Mobile Compatibility** | Optimized for phones, tablets, and desktops. | Enhances accessibility. | **Frontend:** TailwindCSS layouts. |
| **10. Cloud Deployment & CI/CD** | Deployed using Vercel (frontend) & Render/Railway (backend). | Ensures uptime and scalability. | **DB:** PlanetScale / Supabase MySQL. |

---

## 🧩 Technology Stack

| Layer | Technology | Purpose / Reasoning |
|-------|-------------|---------------------|
| **Frontend** | **React.js (Vite)** | Component-based UI, fast builds, reactive SPA behavior. |
| | **React Router v6** | Page routing and access protection. |
| | **Context API / Redux Toolkit** | Global state management (auth, groups, expenses). |
| | **Axios** | API communication with backend. |
| | **TailwindCSS** | Fast, responsive UI design. |
| **Backend** | **Node.js + Express.js** | Lightweight, scalable REST API server. |
| **Database ORM** | **Prisma** | Type-safe ORM for schema management and migrations. |
| **Database** | **MySQL** | Relational database for structured data and relationships. |
| **Authentication** | **JWT (JSON Web Tokens)** | Stateless and secure user authentication. |
| **Deployment** | **Frontend:** Vercel / Netlify<br>**Backend:** Render / Railway<br>**DB:** PlanetScale | Scalable and cloud-native CI/CD setup. |
| **Version Control** | **Git + GitHub** | Collaboration, version tracking, and CI workflows. |

---
## Project Structure

```
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # Global state management
│   │   ├── pages/         # Page components
│   │   ├── routes/        # Routing configuration
│   │   ├── styles/        # CSS files
│   │   └── utils/         # Helper functions
│   └── package.json
│
├── backend/           # Express backend API
│   ├── src/
│   │   ├── config/        # Configuration files
│   │   ├── controllers/   # Request handlers
│   │   ├── middleware/    # Custom middleware
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   └── utils/         # Utility functions
│   ├── prisma/            # Database schema
│   └── package.json
│
└── .gitignore
```

## Features

- 🔐 User authentication (register/login)
- 👥 Group management
- 💰 Expense tracking and splitting
- 📊 Balance calculations
- ⚖️ Settlement suggestions
- 📈 Analytics and visualizations

## Tech Stack

### Frontend

- React 18
- Vite
- React Router DOM
- Axios
- Context API

### Backend

- Node.js
- Express.js
- Prisma ORM
- MySQL
- JWT Authentication
- Bcrypt
