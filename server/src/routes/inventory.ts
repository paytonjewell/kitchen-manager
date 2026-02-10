import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import { inventoryService } from '../services/inventory-service.js';
import {
  addInventoryItemSchema,
  bulkAddInventorySchema,
  bulkDeleteInventorySchema,
  inventorySearchSchema,
} from '../validators/inventory.validator.js';
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
 * GET /api/inventory - List all inventory items
 */
router.get(
  '/',
  asyncHandler(async (_req: Request, res: Response) => {
    const result = await inventoryService.listInventory();
    res.json(result);
  })
);

/**
 * POST /api/inventory - Add single ingredient to inventory
 */
router.post(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    try {
      // Validate request body
      const input = addInventoryItemSchema.parse(req.body);

      // Add item
      const item = await inventoryService.addInventoryItem(input);

      res.status(201).json(item);
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
 * POST /api/inventory/bulk - Add multiple ingredients at once
 * Accepts either:
 * - { ingredients: [{ ingredient_name: "...", notes?: "..." }, ...] }
 * - { ingredients_text: "milk, eggs, flour" }
 */
router.post(
  '/bulk',
  asyncHandler(async (req: Request, res: Response) => {
    try {
      // Validate request body
      const input = bulkAddInventorySchema.parse(req.body);

      let ingredientsToAdd;

      // Parse input based on format
      if ('ingredients_text' in input) {
        ingredientsToAdd = inventoryService.parseIngredientsText(input.ingredients_text);
      } else {
        ingredientsToAdd = input.ingredients;
      }

      // Add items
      const result = await inventoryService.bulkAddInventory(ingredientsToAdd);

      res.status(201).json(result);
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
 * DELETE /api/inventory/:id - Remove single inventory item
 */
router.delete(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const deleted = await inventoryService.deleteInventoryItem(id);

    if (!deleted) {
      res.status(404).json({
        status: 'error',
        message: 'Inventory item not found',
      });
      return;
    }

    res.status(204).send();
  })
);

/**
 * DELETE /api/inventory/bulk - Remove multiple inventory items
 */
router.delete(
  '/bulk',
  asyncHandler(async (req: Request, res: Response) => {
    try {
      // Validate request body
      const input = bulkDeleteInventorySchema.parse(req.body);

      // Delete items
      const deletedCount = await inventoryService.bulkDeleteInventory(input.ids);

      res.json({
        deleted: deletedCount,
        requested: input.ids.length,
      });
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
 * GET /api/inventory/search - Search/autocomplete for ingredients
 */
router.get(
  '/search',
  asyncHandler(async (req: Request, res: Response) => {
    try {
      // Validate query parameters
      const query = inventorySearchSchema.parse(req.query);

      // Search ingredients
      const suggestions = await inventoryService.searchIngredients(query.q, query.limit);

      res.json({ suggestions });
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

export default router;
