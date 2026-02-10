import { Router } from 'express';
import recipesRouter from './recipes.js';
import inventoryRouter from './inventory.js';
import mealPlansRouter from './meal-plans.js';

const router = Router();

// Mount route modules
router.use('/recipes', recipesRouter);
router.use('/inventory', inventoryRouter);
router.use('/meal-plans', mealPlansRouter);

export default router;
