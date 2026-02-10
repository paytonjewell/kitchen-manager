import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RecipeUrlForm } from '@/components/recipes/RecipeUrlForm';
import { RecipeList } from '@/components/recipes/RecipeList';

export function RecipesView() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleManualAdd = () => {
    // TODO: Implement manual recipe creation
    console.log('Manual recipe creation not yet implemented');
  };

  const handleRecipeAdded = () => {
    // Trigger a refresh of the recipe list
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Recipes</h2>
        <Button onClick={handleManualAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Recipe
        </Button>
      </div>

      <RecipeUrlForm onRecipeAdded={handleRecipeAdded} />

      <RecipeList refreshTrigger={refreshTrigger} />
    </div>
  );
}
