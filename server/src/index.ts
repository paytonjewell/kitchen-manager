import express, { type Request, type Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRoutes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/error-handler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Determine port based on environment
// In development: use 3001 (separate from frontend on 3000)
// In production: use 3000 (serves both API and static files)
const PORT = process.env.PORT || (process.env.NODE_ENV === 'production' ? 3000 : 3001);

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
};
app.use(cors(corsOptions));

// Request logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'Kitchen Manager API is running',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/api', apiRoutes);

// In production, serve static files from the client build
if (process.env.NODE_ENV === 'production') {
  const publicPath = path.join(__dirname, '../public');
  app.use(express.static(publicPath));

  // Catch-all route to serve index.html for client-side routing
  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.join(publicPath, 'index.html'));
  });
}

// 404 handler for API routes in development
if (process.env.NODE_ENV !== 'production') {
  app.use(notFoundHandler);
}

// Global error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`CORS enabled for: ${corsOptions.origin}`);
});
