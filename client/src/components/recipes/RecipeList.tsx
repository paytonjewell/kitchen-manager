import { useEffect, useState } from 'react';
import { api, type Recipe } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from './EmptyState';

interface RecipeListProps {
  refreshTrigger?: number;
}

export function RecipeList({ refreshTrigger }: RecipeListProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRecipes();
  }, [refreshTrigger]);

  const loadRecipes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await api.getRecipes();
      setRecipes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load recipes');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-4" />
            <Skeleton className="h-32 w-full" />
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <p className="text-destructive">Error: {error}</p>
      </Card>
    );
  }

  if (recipes.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {recipes.map((recipe) => (
        <Card key={recipe.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          {recipe.image_url && (
            <img
              src={recipe.image_url}
              alt={recipe.title}
              className="w-full h-48 object-cover"
            />
          )}
          <CardHeader>
            <CardTitle className="line-clamp-2">{recipe.title}</CardTitle>
            <CardDescription className="line-clamp-1">
              {recipe.source_url}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 text-sm text-muted-foreground">
              {recipe.total_time && (
                <span>{recipe.total_time} min</span>
              )}
              {recipe.servings && (
                <span>{recipe.servings} servings</span>
              )}
              {recipe.ingredients && (
                <span>{recipe.ingredients.length} ingredients</span>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
