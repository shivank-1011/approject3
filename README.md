# Expense Splitter Application

A full-stack expense splitting application built with React (Vite) and Express.js.

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
- PostgreSQL
- JWT Authentication
- Bcrypt

