const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface ParsedRecipe {
  id?: number;
  title: string;
  image_url?: string;
  source_url: string;
  prep_time?: number;
  cook_time?: number;
  total_time?: number;
  servings?: number;
  ingredients: Array<{
    name: string;
    amount?: string;
    unit?: string;
  }>;
  steps: Array<{
    step_number: number;
    instruction: string;
  }>;
  tags?: string[];
}

export interface Recipe extends ParsedRecipe {
  id: number;
  created_at: string;
  updated_at: string;
}

export interface GetRecipesParams {
  search?: string;
  tags?: string[];
}

export const api = {
  /**
   * Parse a recipe from a URL
   */
  async parseRecipe(url: string): Promise<Recipe> {
    const response = await fetch(`${API_URL}/recipes/parse`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to parse recipe' }));
      throw new Error(error.message || 'Failed to parse recipe');
    }

    return response.json();
  },

  /**
   * Get all recipes with optional filters
   */
  async getRecipes(params?: GetRecipesParams): Promise<Recipe[]> {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.tags) query.set('tags', params.tags.join(','));

    const response = await fetch(`${API_URL}/recipes?${query}`);

    if (!response.ok) {
      throw new Error('Failed to fetch recipes');
    }

    return response.json();
  },

  /**
   * Get a single recipe by ID
   */
  async getRecipe(id: number): Promise<Recipe> {
    const response = await fetch(`${API_URL}/recipes/${id}`);

    if (!response.ok) {
      throw new Error('Recipe not found');
    }

    return response.json();
  },

  /**
   * Delete a recipe
   */
  async deleteRecipe(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/recipes/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete recipe');
    }
  },
};
