import express, { type Request, type Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API routes
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Kitchen Manager API is running' });
});

// Serve static files from the client build
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

// Catch-all route to serve index.html for client-side routing
app.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
