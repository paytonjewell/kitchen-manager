import { Router } from 'express';
import type { Request, Response } from 'express';

const router = Router();

// GET /api/meal-plans - List meal plans
router.get('/', (_req: Request, res: Response) => {
  // TODO: Implement in issue #9
  res.json({ message: 'Meal plans list endpoint - to be implemented' });
});

// POST /api/meal-plans - Create meal plan
router.post('/', (_req: Request, res: Response) => {
  // TODO: Implement in issue #9
  res.json({ message: 'Create meal plan endpoint - to be implemented' });
});

export default router;
