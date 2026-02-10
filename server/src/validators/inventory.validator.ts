import { z } from 'zod';

/**
 * Validator for adding a single inventory item
 */
export const addInventoryItemSchema = z.object({
  ingredient_name: z.string().min(1, 'Ingredient name is required').max(200),
  notes: z.string().max(500).optional(),
});

/**
 * Validator for adding a single ingredient in bulk operation
 */
const bulkIngredientSchema = z.object({
  ingredient_name: z.string().min(1, 'Ingredient name is required').max(200),
  notes: z.string().max(500).optional(),
});

/**
 * Validator for bulk adding inventory items
 * Supports either an array of ingredient objects or plain text (comma/newline separated)
 */
export const bulkAddInventorySchema = z.union([
  z.object({
    ingredients: z.array(bulkIngredientSchema).min(1, 'At least one ingredient is required'),
  }),
  z.object({
    ingredients_text: z.string().min(1, 'Ingredients text cannot be empty'),
  }),
]);

/**
 * Validator for bulk deleting inventory items
 */
export const bulkDeleteInventorySchema = z.object({
  ids: z.array(z.string().uuid('Invalid ID format')).min(1, 'At least one ID is required'),
});

/**
 * Validator for inventory search query
 */
export const inventorySearchSchema = z.object({
  q: z.string().min(1, 'Search query is required'),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10))
    .pipe(z.number().int().min(1).max(50)),
});

/**
 * Type exports inferred from schemas
 */
export type AddInventoryItemInput = z.infer<typeof addInventoryItemSchema>;
export type BulkAddInventoryInput = z.infer<typeof bulkAddInventorySchema>;
export type BulkDeleteInventoryInput = z.infer<typeof bulkDeleteInventorySchema>;
export type InventorySearchQuery = z.infer<typeof inventorySearchSchema>;
