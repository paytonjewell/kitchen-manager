# Development Guide

This guide will help you set up and run the Kitchen Manager project locally.

## Prerequisites

- Node.js 20.x LTS or higher
- npm or pnpm package manager

## Project Structure

This is a monorepo containing:

- `/client` - Frontend React application (Vite + TypeScript)
- `/server` - Backend API server (Express + TypeScript)

## Getting Started

### 1. Install Dependencies

Navigate to each directory and install dependencies:

```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### 2. Running in Development Mode

**Client (Frontend):**

```bash
cd client
npm run dev
```

The client will start on http://localhost:3000

**Server (Backend):**

```bash
cd server
npm run dev
```

The server will start on http://localhost:4000

## Available Scripts

### Client

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Server

- `npm run dev` - Start development server with auto-reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm run start` - Run compiled production server
- `npm run lint` - Run ESLint

## Code Quality

### TypeScript

Both client and server use TypeScript with strict mode enabled. Run type checking:

```bash
# Client
cd client
npm run build

# Server
cd server
npm run build
```

### Linting

The project uses ESLint 9 with flat config for both client and server:

```bash
# Lint client
cd client
npm run lint

# Lint server
cd server
npm run lint
```

### Code Formatting

Prettier is configured at the root level for consistent code formatting across the monorepo.

Format your code:

```bash
# Format client
cd client
npx prettier --write .

# Format server
cd server
npx prettier --write .
```

## Tech Stack

### Frontend
- **React** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **ESLint + Prettier** - Code quality and formatting

### Backend
- **Node.js 20.x** - Runtime environment
- **Express** - Web framework
- **TypeScript** - Type-safe JavaScript
- **tsx** - TypeScript execution for development
- **ESLint + Prettier** - Code quality and formatting

## Environment Variables

Copy `.env.example` to `.env` and configure as needed:

```bash
cp .env.example .env
```

Note: Node.js 20.6+ has built-in support for environment variables, so no additional packages are needed.

## Troubleshooting

### Port Already in Use

If you get a port conflict error, you can change the ports:

- Client: Edit `vite.config.ts` and change the `server.port` value
- Server: Set the `PORT` environment variable

### TypeScript Errors

Make sure you've installed all dependencies:

```bash
cd client && npm install
cd ../server && npm install
```

## Additional Resources

- [Vite Documentation](https://vite.dev/)
- [React Documentation](https://react.dev/)
- [Express Documentation](https://expressjs.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
