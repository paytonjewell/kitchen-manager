import { ChefHat, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onAddFromUrl?: () => void;
  onCreateManual?: () => void;
}

export function EmptyState({ onAddFromUrl, onCreateManual }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <ChefHat className="h-16 w-16 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">No recipes yet</h3>
      <p className="text-muted-foreground mb-6 max-w-sm">
        Start building your recipe collection by adding a recipe from a URL or
        creating one manually.
      </p>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onAddFromUrl}>
          <Plus className="mr-2 h-4 w-4" />
          Add from URL
        </Button>
        <Button onClick={onCreateManual}>
          <Plus className="mr-2 h-4 w-4" />
          Create Recipe
        </Button>
      </div>
    </div>
  );
}
