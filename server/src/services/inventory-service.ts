import { db } from '../db/index.js';
import { inventory, recipeIngredients } from '../db/schema.js';
import { eq, like, sql } from 'drizzle-orm';
import { normalizeIngredient } from '../utils/ingredient-normalizer.js';
import { COMMON_INGREDIENTS } from '../data/common-ingredients.js';
import type { AddInventoryItemInput } from '../validators/inventory.validator.js';

export interface InventoryItem {
  id: string;
  ingredient_name: string;
  notes: string | null;
  added_at: Date;
  updated_at: Date;
}

export interface InventoryListResult {
  items: InventoryItem[];
  total: number;
}

export interface BulkAddResult {
  added: number;
  skipped: number;
  items: InventoryItem[];
}

export interface IngredientToAdd {
  ingredient_name: string;
  notes?: string;
}

class InventoryService {
  /**
   * Get all inventory items
   */
  async listInventory(): Promise<InventoryListResult> {
    const items = await db.select().from(inventory).orderBy(inventory.ingredientName);

    return {
      items: items.map((item) => ({
        id: item.id,
        ingredient_name: item.ingredientName,
        notes: item.notes,
        added_at: item.addedAt,
        updated_at: item.updatedAt,
      })),
      total: items.length,
    };
  }

  /**
   * Add a single inventory item
   * Returns existing item if ingredient already exists (after normalization)
   */
  async addInventoryItem(input: AddInventoryItemInput): Promise<InventoryItem> {
    const normalizedName = normalizeIngredient(input.ingredient_name);

    // Check if ingredient already exists
    const existing = await db
      .select()
      .from(inventory)
      .where(eq(inventory.ingredientName, normalizedName))
      .limit(1);

    if (existing.length > 0) {
      const item = existing[0];
      return {
        id: item.id,
        ingredient_name: item.ingredientName,
        notes: item.notes,
        added_at: item.addedAt,
        updated_at: item.updatedAt,
      };
    }

    // Insert new item
    const newItem = await db
      .insert(inventory)
      .values({
        ingredientName: normalizedName,
        notes: input.notes || null,
      })
      .returning();

    const item = newItem[0];
    return {
      id: item.id,
      ingredient_name: item.ingredientName,
      notes: item.notes,
      added_at: item.addedAt,
      updated_at: item.updatedAt,
    };
  }

  /**
   * Add multiple inventory items at once
   * Handles duplicates gracefully
   */
  async bulkAddInventory(ingredients: IngredientToAdd[]): Promise<BulkAddResult> {
    const result: BulkAddResult = {
      added: 0,
      skipped: 0,
      items: [],
    };

    for (const ingredient of ingredients) {
      const normalizedName = normalizeIngredient(ingredient.ingredient_name);

      // Skip empty names
      if (!normalizedName) {
        result.skipped++;
        continue;
      }

      // Check if ingredient already exists
      const existing = await db
        .select()
        .from(inventory)
        .where(eq(inventory.ingredientName, normalizedName))
        .limit(1);

      if (existing.length > 0) {
        result.skipped++;
        const item = existing[0];
        result.items.push({
          id: item.id,
          ingredient_name: item.ingredientName,
          notes: item.notes,
          added_at: item.addedAt,
          updated_at: item.updatedAt,
        });
        continue;
      }

      // Insert new item
      const newItem = await db
        .insert(inventory)
        .values({
          ingredientName: normalizedName,
          notes: ingredient.notes || null,
        })
        .returning();

      result.added++;
      const item = newItem[0];
      result.items.push({
        id: item.id,
        ingredient_name: item.ingredientName,
        notes: item.notes,
        added_at: item.addedAt,
        updated_at: item.updatedAt,
      });
    }

    return result;
  }

  /**
   * Parse comma or newline separated text into ingredient objects
   */
  parseIngredientsText(text: string): IngredientToAdd[] {
    // Split by comma or newline
    const lines = text
      .split(/[,\n]/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    return lines.map((line) => ({
      ingredient_name: line,
    }));
  }

  /**
   * Delete a single inventory item
   */
  async deleteInventoryItem(id: string): Promise<boolean> {
    const result = await db.delete(inventory).where(eq(inventory.id, id)).returning();
    return result.length > 0;
  }

  /**
   * Delete multiple inventory items at once
   */
  async bulkDeleteInventory(ids: string[]): Promise<number> {
    if (ids.length === 0) {
      return 0;
    }

    let deletedCount = 0;
    for (const id of ids) {
      const result = await db.delete(inventory).where(eq(inventory.id, id)).returning();
      if (result.length > 0) {
        deletedCount++;
      }
    }

    return deletedCount;
  }

  /**
   * Search for ingredients for autocomplete
   * Priority:
   * 1. Existing inventory items
   * 2. Common ingredients list
   * 3. Previously used ingredients from recipes
   */
  async searchIngredients(query: string, limit: number = 10): Promise<string[]> {
    const normalizedQuery = query.toLowerCase().trim();
    const suggestions: string[] = [];

    // 1. Search existing inventory items
    const inventoryItems = await db
      .select()
      .from(inventory)
      .where(like(inventory.ingredientName, `%${normalizedQuery}%`))
      .limit(limit);

    suggestions.push(...inventoryItems.map((item) => item.ingredientName));

    // 2. Search common ingredients if we need more suggestions
    if (suggestions.length < limit) {
      const commonMatches = COMMON_INGREDIENTS.filter((ingredient) =>
        ingredient.includes(normalizedQuery)
      ).slice(0, limit - suggestions.length);

      suggestions.push(...commonMatches);
    }

    // 3. Search recipe ingredients if we still need more
    if (suggestions.length < limit) {
      const recipeIngredientsItems = await db
        .selectDistinct({ name: recipeIngredients.ingredientName })
        .from(recipeIngredients)
        .where(like(recipeIngredients.ingredientName, `%${normalizedQuery}%`))
        .limit(limit - suggestions.length);

      suggestions.push(...recipeIngredientsItems.map((item) => item.name));
    }

    // Remove duplicates and limit results
    return [...new Set(suggestions)].slice(0, limit);
  }
}

export const inventoryService = new InventoryService();
