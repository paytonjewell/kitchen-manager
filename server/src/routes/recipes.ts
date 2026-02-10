import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import { recipeService } from '../services/recipe-service.js';
import {
  createRecipeSchema,
  updateRecipeSchema,
  recipeListQuerySchema,
} from '../validators/recipe.validator.js';
import { ZodError } from 'zod';

const router = Router();

/**
 * Error handling wrapper for async route handlers
 */
const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

/**
 * GET /api/recipes - List all recipes with pagination and filtering
 */
router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    try {
      // Validate query parameters
      const query = recipeListQuerySchema.parse(req.query);

      // Parse tags if provided
      const tags = query.tags ? query.tags.split(',').map((t) => t.trim()) : undefined;

      // Get recipes
      const result = await recipeService.listRecipes({
        search: query.search,
        tags,
        favorite: query.favorite,
        limit: query.limit,
        offset: query.offset,
      });

      res.json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          status: 'error',
          message: 'Invalid query parameters',
          errors: error.errors,
        });
        return;
      }
      throw error;
    }
  })
);

/**
 * GET /api/recipes/:id - Get single recipe with full details
 */
router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const recipe = await recipeService.getRecipeById(id);

    if (!recipe) {
      res.status(404).json({
        status: 'error',
        message: 'Recipe not found',
      });
      return;
    }

    res.json(recipe);
  })
);

/**
 * POST /api/recipes - Create new recipe
 */
router.post(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    try {
      // Validate request body
      const input = createRecipeSchema.parse(req.body);

      // Create recipe
      const recipe = await recipeService.createRecipe(input);

      res.status(201).json(recipe);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          status: 'error',
          message: 'Invalid request body',
          errors: error.errors,
        });
        return;
      }
      throw error;
    }
  })
);

/**
 * PUT /api/recipes/:id - Update existing recipe
 */
router.put(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;

    try {
      // Validate request body
      const input = updateRecipeSchema.parse(req.body);

      // Update recipe
      const recipe = await recipeService.updateRecipe(id, input);

      if (!recipe) {
        res.status(404).json({
          status: 'error',
          message: 'Recipe not found',
        });
        return;
      }

      res.json(recipe);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          status: 'error',
          message: 'Invalid request body',
          errors: error.errors,
        });
        return;
      }
      throw error;
    }
  })
);

/**
 * DELETE /api/recipes/:id - Delete recipe
 */
router.delete(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const deleted = await recipeService.deleteRecipe(id);

    if (!deleted) {
      res.status(404).json({
        status: 'error',
        message: 'Recipe not found',
      });
      return;
    }

    res.status(204).send();
  })
);

/**
 * PATCH /api/recipes/:id/favorite - Toggle favorite status
 */
router.patch(
  '/:id/favorite',
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const recipe = await recipeService.toggleFavorite(id);

    if (!recipe) {
      res.status(404).json({
        status: 'error',
        message: 'Recipe not found',
      });
      return;
    }

    res.json(recipe);
  })
);

export default router;
