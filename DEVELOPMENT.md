# Development Guide

This guide will help you set up and run the Kitchen Manager project locally.

## Prerequisites

**Option 1: Using Docker (Recommended)**
- Docker
- Docker Compose

**Option 2: Local Development**
- Node.js 20.x LTS or higher
- npm or pnpm package manager

## Quick Start with Docker

The easiest way to run the application is using Docker:

```bash
docker-compose up -d
```

Then open http://localhost:3000

The application will be built and started automatically. Your data is persisted in the `./data` directory.

**Stop the application:**

```bash
docker-compose down
```

**View logs:**

```bash
docker-compose logs -f
```

**Rebuild after code changes:**

```bash
docker-compose up -d --build
```

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

The server will start on http://localhost:3000

**Note:** In production (Docker), the server serves both the API and the static client files on port 3000.

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

## Docker Setup

The application uses a multi-stage Docker build for optimal image size and security:

### Docker Architecture

- **Stage 1:** Build client (Vite production build)
- **Stage 2:** Build server (TypeScript compilation)
- **Stage 3:** Production image with both client and server

### Features

- **Single container:** Serves both frontend and backend on port 3000
- **Data persistence:** SQLite database stored in `./data` directory
- **Health checks:** Automatic container health monitoring
- **Non-root user:** Enhanced security
- **Signal handling:** Graceful shutdown with dumb-init

### Docker Commands

```bash
# Build the image
docker build -t kitchen-manager .

# Run manually (without docker-compose)
docker run -p 3000:3000 -v $(pwd)/data:/app/data kitchen-manager

# View container logs
docker logs kitchen-manager

# Stop container
docker stop kitchen-manager
```

### Data Persistence

The SQLite database is stored in the `./data` directory and mounted as a volume. This ensures:
- Data persists across container restarts
- You can rebuild the image without losing data
- Easy backup (just copy the `./data` directory)

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
