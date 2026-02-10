import type {
  Recipe,
  RecipeIngredient,
  RecipeStep,
} from '../db/schema.js';

/**
 * Full recipe with all related data
 */
export interface RecipeWithDetails extends Recipe {
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
  tags: string[];
}

/**
 * Recipe list item (without full details)
 */
export interface RecipeListItem {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  prepTimeMinutes: number | null;
  cookTimeMinutes: number | null;
  servings: number | null;
  isFavorite: boolean;
  tags: string[];
  createdAt: Date;
}

/**
 * Recipe list response with pagination
 */
export interface RecipeListResponse {
  recipes: RecipeListItem[];
  total: number;
}

/**
 * Query parameters for listing recipes
 */
export interface RecipeListQuery {
  search?: string;
  tags?: string;
  favorite?: string;
  limit?: string;
  offset?: string;
}

/**
 * Input for creating a new recipe
 */
export interface CreateRecipeInput {
  title: string;
  description?: string;
  sourceUrl?: string;
  imageUrl?: string;
  prepTimeMinutes?: number;
  cookTimeMinutes?: number;
  servings?: number;
  notes?: string;
  isFavorite?: boolean;
  ingredients: Array<{
    ingredientName: string;
    quantity?: string;
    unit?: string;
    notes?: string;
    orderIndex: number;
  }>;
  steps: Array<{
    stepNumber: number;
    instruction: string;
  }>;
  tags?: string[];
}

// UpdateRecipeInput is now exported from the validator
// (No longer needed here as it's just CreateRecipeInput)
