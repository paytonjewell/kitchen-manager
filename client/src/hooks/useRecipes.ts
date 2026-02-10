import { useState, useEffect, useCallback } from 'react';
import { api, type Recipe, type GetRecipesParams } from '@/lib/api';

export function useRecipes(params?: GetRecipesParams) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRecipes = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await api.getRecipes(params);
      setRecipes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load recipes');
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    loadRecipes();
  }, [loadRecipes]);

  return {
    recipes,
    isLoading,
    error,
    refresh: loadRecipes,
  };
}
