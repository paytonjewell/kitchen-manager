import { Router } from 'express';
import type { Request, Response } from 'express';

const router = Router();

// GET /api/recipes - List recipes
router.get('/', (_req: Request, res: Response) => {
  // TODO: Implement in issue #5
  res.json({ message: 'Recipe list endpoint - to be implemented' });
});

// POST /api/recipes - Create recipe
router.post('/', (_req: Request, res: Response) => {
  // TODO: Implement in issue #5
  res.json({ message: 'Create recipe endpoint - to be implemented' });
});

export default router;
