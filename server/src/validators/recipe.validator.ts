import { z } from 'zod';

/**
 * Validator for recipe ingredient
 */
const recipeIngredientSchema = z.object({
  ingredientName: z.string().min(1, 'Ingredient name is required'),
  quantity: z.string().optional(),
  unit: z.string().optional(),
  notes: z.string().optional(),
  orderIndex: z.number().int().min(0),
});

/**
 * Validator for recipe step
 */
const recipeStepSchema = z.object({
  stepNumber: z.number().int().min(1),
  instruction: z.string().min(1, 'Instruction is required'),
});

/**
 * Validator for creating a new recipe
 */
export const createRecipeSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be 200 characters or less'),
  description: z.string().optional(),
  sourceUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  imageUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  prepTimeMinutes: z.number().int().min(0).optional(),
  cookTimeMinutes: z.number().int().min(0).optional(),
  servings: z.number().int().min(1).optional(),
  notes: z.string().optional(),
  isFavorite: z.boolean().optional().default(false),
  ingredients: z.array(recipeIngredientSchema).min(1, 'At least one ingredient is required'),
  steps: z.array(recipeStepSchema).min(1, 'At least one step is required'),
  tags: z.array(z.string()).optional().default([]),
});

/**
 * Validator for updating a recipe
 * Note: isFavorite does not have a default to preserve existing value when not provided
 */
export const updateRecipeSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be 200 characters or less'),
  description: z.string().optional(),
  sourceUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  imageUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  prepTimeMinutes: z.number().int().min(0).optional(),
  cookTimeMinutes: z.number().int().min(0).optional(),
  servings: z.number().int().min(1).optional(),
  notes: z.string().optional(),
  isFavorite: z.boolean().optional(),
  ingredients: z.array(recipeIngredientSchema).min(1, 'At least one ingredient is required'),
  steps: z.array(recipeStepSchema).min(1, 'At least one step is required'),
  tags: z.array(z.string()).optional().default([]),
});

/**
 * Validator for recipe list query parameters
 */
export const recipeListQuerySchema = z.object({
  search: z.string().optional(),
  tags: z.string().optional(),
  favorite: z
    .string()
    .optional()
    .transform((val) => {
      if (val === 'true') return true;
      if (val === 'false') return false;
      return undefined;
    }),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 50))
    .pipe(z.number().int().min(1).max(100)),
  offset: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 0))
    .pipe(z.number().int().min(0)),
});

/**
 * Type exports inferred from schemas
 */
export type CreateRecipeInput = z.infer<typeof createRecipeSchema>;
export type UpdateRecipeInput = z.infer<typeof updateRecipeSchema>;
export type RecipeListQuery = z.infer<typeof recipeListQuerySchema>;
