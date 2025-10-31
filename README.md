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

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd approject3
```

2. Install frontend dependencies

```bash
cd frontend
npm install
```

3. Install backend dependencies

```bash
cd ../backend
npm install
```

4. Set up environment variables

Create `.env` file in the backend directory:

```env
PORT=3000
DATABASE_URL="postgresql://user:password@localhost:5432/expense_splitter"
JWT_SECRET=your-secret-key
```

Create `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:3000/api
```

5. Set up the database

```bash
cd backend
npm run prisma:migrate
npm run prisma:generate
```

### Running the Application

1. Start the backend server:

```bash
cd backend
npm run dev
```

2. Start the frontend development server:

```bash
cd frontend
npm run dev
```

The application will be available at:

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## API Documentation

See [backend/README.md](backend/README.md) for detailed API documentation.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

MIT

## Authors

Your Team
