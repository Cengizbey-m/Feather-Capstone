# Feather Frontend

React + TypeScript frontend for the Feather market insights application.

## Quick Start

### Development Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment:
```bash
cp env.example .env
# Edit .env with your API URL
```

3. Start development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage
- `npm run lint` - Lint code
- `npm run lint:fix` - Fix linting issues
- `npm run format` - Format code with Prettier

## Features

- **Authentication**: JWT-based login system
- **Dashboard**: Overview of market insights and watchlist
- **Predictions**: ML-based price predictions with confidence scores
- **News**: Market news with sentiment analysis
- **Watchlist**: Track favorite stocks
- **Alerts**: Set up price and sentiment alerts
- **Dark Mode**: Toggle between light and dark themes
- **Responsive**: Mobile-friendly design

## Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **React Router** for navigation
- **TanStack Query** for data fetching
- **Zustand** for state management
- **Tailwind CSS** for styling
- **Vitest** for testing
- **ESLint + Prettier** for code quality

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # API client and utilities
├── store/              # Zustand stores
├── types/              # TypeScript type definitions
├── styles/             # Global styles
└── test/               # Test utilities
```

## API Integration

The frontend integrates with the Feather backend API:

- **Authentication**: `/auth/login`, `/auth/me`
- **Predictions**: `/api/tickers/{symbol}/prediction`
- **News**: `/api/tickers/{symbol}/news`, `/api/news`
- **Watchlist**: `/api/watchlist`
- **Alerts**: `/api/alerts`

## Environment Variables

- `VITE_API_BASE_URL` - Backend API base URL (default: http://localhost:8000)

## Testing

Tests are written using Vitest and React Testing Library:

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:ui
```

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
