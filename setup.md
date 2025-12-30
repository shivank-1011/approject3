# 🛠️ Expense Splitter - Project Setup Guide

This guide will help you set up the **Expense Splitter** project locally for development.

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your machine:

1.  **[Node.js](https://nodejs.org/)** (v18 or higher recommended)
2.  **[npm](https://www.npmjs.com/)** (comes with Node.js)
3.  **[MySQL](https://www.mysql.com/downloads/)** (locally installed or a cloud instance like PlanetScale/Railway)
4.  **[Git](https://git-scm.com/)**

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd approject3
```

---

## 🔙 Backend Setup

The backend is built with Node.js, Express, and Prisma.

1.  **Navigate to the backend directory:**

    ```bash
    cd backend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**

    Create a `.env` file in the `backend` directory:

    ```bash
    touch .env
    # or manually create the file
    ```

    Add the following configuration to the `.env` file:

    ```env
    # Server Configuration
    PORT=3000
    NODE_ENV=development

    # Database Configuration (MySQL)
    # Format: mysql://USER:PASSWORD@HOST:PORT/DATABASE
    DATABASE_URL="mysql://root:password@localhost:3306/expense_splitter"

    # Security
    JWT_SECRET="your_super_secret_jwt_key"
    JWT_EXPIRES_IN="7d"
    BCRYPT_ROUNDS=10

    # CORS & Security
    CORS_ORIGIN="http://localhost:5173"
    RATE_LIMIT_WINDOW_MS=900000
    RATE_LIMIT_MAX_REQUESTS=100
    ```

    > **Note:** Update `DATABASE_URL` with your actual MySQL credentials.

4.  **Database Setup:**

    Run the Prisma migrations to create the database tables:

    ```bash
    npx prisma migrate dev --name init
    ```


5.  **Start the Backend Server:**

    ```bash
    npm run dev
    ```

    The server should now be running on `http://localhost:3000`.

---

## 🎨 Frontend Setup

The frontend is built with React and Vite.

1.  **Open a new terminal and navigate to the frontend directory:**

    ```bash
    cd frontend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Configure Environment Variables (Optional):**

    By default, the frontend assumes the backend is at `http://localhost:3000/api`. If you need to change this, create a `.env` file in the `frontend` directory:

    ```env
    VITE_API_URL=http://localhost:3000/api
    ```

4.  **Start the Development Server:**

    ```bash
    npm run dev
    ```

    The application will start, usually at `http://localhost:5173`.

---


## ✅ Verification

to verify the setup:

1.  Ensure the backend log says `Server running on port 3000` (or your configured port).
2.  Open the frontend URL (e.g., `http://localhost:5173`) in your browser.
3.  Try to Sign Up / Login to test the database connection.
