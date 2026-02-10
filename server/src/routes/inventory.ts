import { Router } from 'express';
import type { Request, Response } from 'express';

const router = Router();

// GET /api/inventory - List inventory
router.get('/', (_req: Request, res: Response) => {
  // TODO: Implement in issue #8
  res.json({ message: 'Inventory list endpoint - to be implemented' });
});

// POST /api/inventory - Add to inventory
router.post('/', (_req: Request, res: Response) => {
  // TODO: Implement in issue #8
  res.json({ message: 'Add inventory endpoint - to be implemented' });
});

export default router;
