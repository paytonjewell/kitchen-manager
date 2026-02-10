/**
 * Ingredient Parser
 * Parses ingredient strings into structured data
 */

import type { ParsedIngredient } from './types.js';

/**
 * Common units to look for in ingredient strings
 */
const UNITS = [
  'cup', 'cups',
  'tablespoon', 'tablespoons', 'tbsp', 'tbs', 'tb',
  'teaspoon', 'teaspoons', 'tsp', 'ts',
  'ounce', 'ounces', 'oz',
  'pound', 'pounds', 'lb', 'lbs',
  'gram', 'grams', 'g',
  'kilogram', 'kilograms', 'kg',
  'milliliter', 'milliliters', 'ml',
  'liter', 'liters', 'l',
  'pint', 'pints', 'pt',
  'quart', 'quarts', 'qt',
  'gallon', 'gallons', 'gal',
  'piece', 'pieces', 'pc',
  'slice', 'slices',
  'clove', 'cloves',
  'pinch', 'dash',
  'can', 'cans',
  'package', 'packages', 'pkg',
  'bunch', 'bunches',
];

/**
 * Parse an ingredient string into structured data
 * Examples:
 * - "2 cups flour" => { quantity: "2", unit: "cups", ingredient_name: "flour" }
 * - "1/2 teaspoon salt" => { quantity: "1/2", unit: "teaspoon", ingredient_name: "salt" }
 * - "2 lbs chicken breast, boneless skinless" => { quantity: "2", unit: "lbs", ingredient_name: "chicken breast", notes: "boneless skinless" }
 *
 * @param ingredientString Raw ingredient string
 * @param orderIndex Order index for the ingredient
 * @returns Parsed ingredient data
 */
export function parseIngredient(ingredientString: string, orderIndex: number): ParsedIngredient {
  if (!ingredientString || typeof ingredientString !== 'string') {
    return {
      ingredient_name: '',
      quantity: undefined,
      unit: undefined,
      notes: undefined,
    };
  }

  const trimmed = ingredientString.trim();

  // Split on comma to separate main ingredient from notes
  const [mainPart, ...notesParts] = trimmed.split(',');
  const notes = notesParts.length > 0 ? notesParts.join(',').trim() : undefined;

  // Try to extract quantity and unit
  // Pattern: number(s) + optional unit + ingredient name
  // Numbers can be: 1, 1.5, 1/2, 1 1/2, etc.
  const quantityPattern = /^(\d+(?:[\s\/]\d+)?(?:\.\d+)?)\s*/;
  const quantityMatch = mainPart.match(quantityPattern);

  let quantity: string | undefined;
  let unit: string | undefined;
  let ingredientName: string;

  if (quantityMatch) {
    quantity = quantityMatch[1].trim();
    const remaining = mainPart.slice(quantityMatch[0].length).trim();

    // Try to find a unit at the start of the remaining string
    const unitMatch = UNITS.find(u => {
      const unitPattern = new RegExp(`^${u}\\b`, 'i');
      return unitPattern.test(remaining);
    });

    if (unitMatch) {
      unit = unitMatch;
      ingredientName = remaining.slice(unitMatch.length).trim();
    } else {
      ingredientName = remaining;
    }
  } else {
    // No quantity found, entire main part is the ingredient
    ingredientName = mainPart.trim();
  }

  return {
    ingredient_name: ingredientName,
    quantity,
    unit,
    notes,
  };
}

/**
 * Parse an array of ingredient strings
 *
 * @param ingredients Array of ingredient strings
 * @returns Array of parsed ingredients
 */
export function parseIngredients(ingredients: string[]): ParsedIngredient[] {
  if (!Array.isArray(ingredients)) {
    return [];
  }

  return ingredients
    .filter(ing => ing && typeof ing === 'string' && ing.trim().length > 0)
    .map((ing, index) => parseIngredient(ing, index));
}
