# Expense Splitter Backend

Backend API for the Expense Splitter application built with Express.js, Prisma, and PostgreSQL.

## Features

- User authentication (JWT-based)
- Group management
- Expense tracking and splitting
- Settlement calculations
- Analytics and reporting
- RESTful API design

## Tech Stack

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- JWT for authentication
- Bcrypt for password hashing

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database

### Installation

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:
   Create a `.env` file in the root directory with the following:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL="postgresql://user:password@localhost:5432/expense_splitter"
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
```

3. Set up the database:

```bash
npm run prisma:migrate
npm run prisma:generate
```

### Development

Run the development server:

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

### Prisma Commands

- Generate Prisma Client: `npm run prisma:generate`
- Run migrations: `npm run prisma:migrate`
- Open Prisma Studio: `npm run prisma:studio`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Groups

- `POST /api/groups` - Create a new group
- `GET /api/groups` - Get all groups for user
- `GET /api/groups/:id` - Get group by ID
- `PUT /api/groups/:id` - Update group
- `DELETE /api/groups/:id` - Delete group

### Expenses

- `POST /api/expenses` - Create a new expense
- `GET /api/expenses` - Get all expenses
- `GET /api/expenses/:id` - Get expense by ID
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Settlements

- `GET /api/settlements/balances/:groupId` - Get balances for a group
- `GET /api/settlements/suggestions/:groupId` - Get settlement suggestions
- `POST /api/settlements` - Record a settlement
- `GET /api/settlements/history` - Get settlement history

### Analytics

- `GET /api/analytics/user` - Get user analytics
- `GET /api/analytics/group/:groupId` - Get group analytics

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Custom middleware
│   ├── routes/          # Route definitions
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   ├── app.js          # Express app setup
│   └── server.js       # Server entry point
├── prisma/
│   └── schema.prisma   # Database schema
└── package.json
```

## License

MIT
