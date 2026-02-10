import { useState } from 'react';
import { Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/toast';
import { api } from '@/lib/api';
import { isValidUrl } from '@/lib/validation';

interface RecipeUrlFormProps {
  onRecipeAdded?: () => void;
}

export function RecipeUrlForm({ onRecipeAdded }: RecipeUrlFormProps) {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate URL
    if (!isValidUrl(url)) {
      setError('Please enter a valid URL starting with http:// or https://');
      return;
    }

    setIsLoading(true);

    try {
      await api.parseRecipe(url);

      // Reset form
      setUrl('');
      toast({
        title: 'Recipe added',
        description: 'Your recipe has been saved successfully.',
        variant: 'success',
      });

      // Notify parent component
      onRecipeAdded?.();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to add recipe';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="recipe-url">Add Recipe from URL</Label>
          <div className="flex gap-2">
            <Input
              id="recipe-url"
              type="url"
              placeholder="https://example.com/recipe"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading || !url}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Parsing...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add
                </>
              )}
            </Button>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      </form>
    </Card>
  );
}
