# Expense Splitter Frontend

A React-based frontend for the Expense Splitter application.

## Features

- User authentication (login/register)
- Dashboard with expense summary
- Group management
- Expense tracking
- Settlement calculations
- Analytics and visualizations

## Tech Stack

- React 18
- Vite
- React Router DOM
- Axios
- Context API for state management

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

### Environment Variables

Create a `.env` file in the root directory:

```
VITE_API_URL=http://localhost:3000/api
```

## Project Structure

- `src/components/` - Reusable UI components
- `src/context/` - Global state management
- `src/pages/` - Page-level components
- `src/routes/` - Routing configuration
- `src/utils/` - Helper functions and API client
- `src/styles/` - CSS files

## License

MIT
