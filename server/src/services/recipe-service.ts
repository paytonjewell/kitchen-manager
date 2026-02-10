import { db, schema } from '../db/index.js';
import { eq, desc, or, like, and, sql, inArray } from 'drizzle-orm';
import type {
  CreateRecipeInput,
  UpdateRecipeInput,
} from '../validators/recipe.validator.js';
import type {
  RecipeWithDetails,
  RecipeListResponse,
  RecipeListItem,
} from '../types/recipe.types.js';

/**
 * Recipe Service - handles all recipe-related business logic
 */
export class RecipeService {
  /**
   * Escape LIKE wildcard characters in search strings
   */
  private escapeLikeWildcards(search: string): string {
    return search.replace(/[%_]/g, '\\$&');
  }

  /**
   * List recipes with filtering and pagination
   */
  async listRecipes(options: {
    search?: string;
    tags?: string[];
    favorite?: boolean;
    limit: number;
    offset: number;
  }): Promise<RecipeListResponse> {
    const { search, tags, favorite, limit, offset } = options;

    // Build WHERE conditions
    const conditions = [];

    if (search) {
      const escapedSearch = this.escapeLikeWildcards(search);
      conditions.push(
        or(
          like(schema.recipes.title, `%${escapedSearch}%`),
          like(schema.recipes.description, `%${escapedSearch}%`)
        )
      );
    }

    if (favorite !== undefined) {
      conditions.push(eq(schema.recipes.isFavorite, favorite));
    }

    // Get recipe IDs filtered by tags if specified
    let recipeIdsFromTags: string[] | undefined;
    if (tags && tags.length > 0) {
      const tagResults = await db
        .select({ recipeId: schema.recipeTags.recipeId })
        .from(schema.recipeTags)
        .where(inArray(schema.recipeTags.tag, tags))
        .groupBy(schema.recipeTags.recipeId)
        .having(sql`COUNT(DISTINCT ${schema.recipeTags.tag}) = ${tags.length}`);

      recipeIdsFromTags = tagResults.map((r) => r.recipeId);

      if (recipeIdsFromTags.length === 0) {
        // No recipes match the tag filter
        return { recipes: [], total: 0 };
      }

      conditions.push(inArray(schema.recipes.id, recipeIdsFromTags));
    }

    // Build final WHERE clause
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get total count
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(schema.recipes)
      .where(whereClause);

    const total = countResult[0]?.count ?? 0;

    // Get recipes
    const recipes = await db
      .select()
      .from(schema.recipes)
      .where(whereClause)
      .orderBy(desc(schema.recipes.createdAt))
      .limit(limit)
      .offset(offset);

    // Get tags for each recipe
    const recipeIds = recipes.map((r) => r.id);
    const tagsData =
      recipeIds.length > 0
        ? await db
            .select()
            .from(schema.recipeTags)
            .where(inArray(schema.recipeTags.recipeId, recipeIds))
        : [];

    // Group tags by recipe
    const tagsByRecipe = tagsData.reduce(
      (acc, tag) => {
        if (!acc[tag.recipeId]) {
          acc[tag.recipeId] = [];
        }
        acc[tag.recipeId].push(tag.tag);
        return acc;
      },
      {} as Record<string, string[]>
    );

    // Format response
    const recipeList: RecipeListItem[] = recipes.map((recipe) => ({
      id: recipe.id,
      title: recipe.title,
      description: recipe.description,
      imageUrl: recipe.imageUrl,
      prepTimeMinutes: recipe.prepTimeMinutes,
      cookTimeMinutes: recipe.cookTimeMinutes,
      servings: recipe.servings,
      isFavorite: recipe.isFavorite,
      tags: tagsByRecipe[recipe.id] || [],
      createdAt: recipe.createdAt,
    }));

    return {
      recipes: recipeList,
      total,
    };
  }

  /**
   * Get a single recipe by ID with all details
   */
  async getRecipeById(id: string): Promise<RecipeWithDetails | null> {
    const recipe = await db
      .select()
      .from(schema.recipes)
      .where(eq(schema.recipes.id, id))
      .limit(1);

    if (recipe.length === 0) {
      return null;
    }

    // Get ingredients
    const ingredients = await db
      .select()
      .from(schema.recipeIngredients)
      .where(eq(schema.recipeIngredients.recipeId, id))
      .orderBy(schema.recipeIngredients.orderIndex);

    // Get steps
    const steps = await db
      .select()
      .from(schema.recipeSteps)
      .where(eq(schema.recipeSteps.recipeId, id))
      .orderBy(schema.recipeSteps.stepNumber);

    // Get tags
    const tagsData = await db
      .select()
      .from(schema.recipeTags)
      .where(eq(schema.recipeTags.recipeId, id));

    return {
      ...recipe[0],
      ingredients,
      steps,
      tags: tagsData.map((t) => t.tag),
    };
  }

  /**
   * Create a new recipe with ingredients, steps, and tags
   */
  async createRecipe(input: CreateRecipeInput): Promise<RecipeWithDetails> {
    return db.transaction(async (tx) => {
      // Insert recipe
      const recipeData = {
        title: input.title,
        description: input.description,
        sourceUrl: input.sourceUrl,
        imageUrl: input.imageUrl,
        prepTimeMinutes: input.prepTimeMinutes,
        cookTimeMinutes: input.cookTimeMinutes,
        servings: input.servings,
        notes: input.notes,
        isFavorite: input.isFavorite ?? false,
      };

      const [recipe] = await tx.insert(schema.recipes).values(recipeData).returning();

      // Insert ingredients
      const ingredientData = input.ingredients.map((ing) => ({
        recipeId: recipe.id,
        ingredientName: ing.ingredientName,
        quantity: ing.quantity,
        unit: ing.unit,
        notes: ing.notes,
        orderIndex: ing.orderIndex,
      }));

      const ingredients = await tx
        .insert(schema.recipeIngredients)
        .values(ingredientData)
        .returning();

      // Insert steps
      const stepData = input.steps.map((step) => ({
        recipeId: recipe.id,
        stepNumber: step.stepNumber,
        instruction: step.instruction,
      }));

      const steps = await tx.insert(schema.recipeSteps).values(stepData).returning();

      // Insert tags
      const tags: string[] = [];
      if (input.tags && input.tags.length > 0) {
        const tagData = input.tags.map((tag) => ({
          recipeId: recipe.id,
          tag,
          isAutoGenerated: false,
        }));

        await tx.insert(schema.recipeTags).values(tagData);
        tags.push(...input.tags);
      }

      return {
        ...recipe,
        ingredients,
        steps,
        tags,
      };
    });
  }

  /**
   * Update an existing recipe (replaces ingredients, steps, and tags)
   */
  async updateRecipe(id: string, input: UpdateRecipeInput): Promise<RecipeWithDetails | null> {
    // Check if recipe exists
    const existing = await db
      .select()
      .from(schema.recipes)
      .where(eq(schema.recipes.id, id))
      .limit(1);

    if (existing.length === 0) {
      return null;
    }

    return db.transaction(async (tx) => {
      // Update recipe
      const recipeData = {
        title: input.title,
        description: input.description,
        sourceUrl: input.sourceUrl,
        imageUrl: input.imageUrl,
        prepTimeMinutes: input.prepTimeMinutes,
        cookTimeMinutes: input.cookTimeMinutes,
        servings: input.servings,
        notes: input.notes,
        isFavorite: input.isFavorite ?? existing[0].isFavorite,
        updatedAt: new Date(),
      };

      const [recipe] = await tx
        .update(schema.recipes)
        .set(recipeData)
        .where(eq(schema.recipes.id, id))
        .returning();

      // Delete existing ingredients, steps, and tags (cascade handled by DB)
      await tx.delete(schema.recipeIngredients).where(eq(schema.recipeIngredients.recipeId, id));
      await tx.delete(schema.recipeSteps).where(eq(schema.recipeSteps.recipeId, id));
      await tx.delete(schema.recipeTags).where(eq(schema.recipeTags.recipeId, id));

      // Insert new ingredients
      const ingredientData = input.ingredients.map((ing) => ({
        recipeId: id,
        ingredientName: ing.ingredientName,
        quantity: ing.quantity,
        unit: ing.unit,
        notes: ing.notes,
        orderIndex: ing.orderIndex,
      }));

      const ingredients = await tx
        .insert(schema.recipeIngredients)
        .values(ingredientData)
        .returning();

      // Insert new steps
      const stepData = input.steps.map((step) => ({
        recipeId: id,
        stepNumber: step.stepNumber,
        instruction: step.instruction,
      }));

      const steps = await tx.insert(schema.recipeSteps).values(stepData).returning();

      // Insert new tags
      const tags: string[] = [];
      if (input.tags && input.tags.length > 0) {
        const tagData = input.tags.map((tag) => ({
          recipeId: id,
          tag,
          isAutoGenerated: false,
        }));

        await tx.insert(schema.recipeTags).values(tagData);
        tags.push(...input.tags);
      }

      return {
        ...recipe,
        ingredients,
        steps,
        tags,
      };
    });
  }

  /**
   * Delete a recipe (cascade deletes ingredients, steps, and tags)
   */
  async deleteRecipe(id: string): Promise<boolean> {
    const result = await db.delete(schema.recipes).where(eq(schema.recipes.id, id));
    return result.changes > 0;
  }

  /**
   * Toggle favorite status for a recipe
   */
  async toggleFavorite(id: string): Promise<RecipeWithDetails | null> {
    // Get current status
    const existing = await db
      .select()
      .from(schema.recipes)
      .where(eq(schema.recipes.id, id))
      .limit(1);

    if (existing.length === 0) {
      return null;
    }

    // Toggle favorite
    const [recipe] = await db
      .update(schema.recipes)
      .set({
        isFavorite: !existing[0].isFavorite,
        updatedAt: new Date(),
      })
      .where(eq(schema.recipes.id, id))
      .returning();

    // Return full recipe details
    return this.getRecipeById(id);
  }
}

// Export singleton instance
export const recipeService = new RecipeService();
