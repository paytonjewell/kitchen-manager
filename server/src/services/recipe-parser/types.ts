/**
 * Recipe Parser Types
 * Types for parsing recipe data from external sources
 */

/**
 * Parsed recipe data structure that can be used to create a recipe
 */
export interface ParsedRecipe {
  title: string;
  description?: string;
  source_url: string;
  image_url?: string;
  prep_time_minutes?: number;
  cook_time_minutes?: number;
  servings?: number;
  ingredients: ParsedIngredient[];
  steps: ParsedStep[];
  notes?: string;
}

/**
 * Parsed ingredient data
 */
export interface ParsedIngredient {
  ingredient_name: string;
  quantity?: string;
  unit?: string;
  notes?: string;
}

/**
 * Parsed recipe step
 */
export interface ParsedStep {
  step_number: number;
  instruction: string;
}

/**
 * Schema.org Recipe JSON-LD structure
 */
export interface SchemaOrgRecipe {
  '@context'?: string | string[];
  '@type': string | string[];
  name: string;
  description?: string;
  image?: string | string[] | SchemaOrgImage | SchemaOrgImage[];
  author?: string | { '@type'?: string; name?: string };
  prepTime?: string;
  cookTime?: string;
  totalTime?: string;
  recipeYield?: string | number | string[];
  recipeIngredient?: string[];
  recipeInstructions?: string | string[] | SchemaOrgStep | SchemaOrgStep[];
}

/**
 * Schema.org HowToStep structure
 */
export interface SchemaOrgStep {
  '@type'?: string;
  text?: string;
  name?: string;
}

/**
 * Schema.org ImageObject structure
 */
export interface SchemaOrgImage {
  '@type'?: string;
  url?: string;
}

/**
 * Options for parsing recipes
 */
export interface ParseOptions {
  timeout?: number;
  userAgent?: string;
}
