/**
 * JSON-LD Recipe Parser
 * Extracts recipe data from JSON-LD structured data (schema.org/Recipe format)
 */

import * as cheerio from 'cheerio';
import axios from 'axios';
import type {
  ParsedRecipe,
  SchemaOrgRecipe,
  SchemaOrgStep,
  SchemaOrgImage,
  ParseOptions,
} from './types.js';
import { parseTimes } from './duration-parser.js';
import { parseIngredients } from './ingredient-parser.js';
import { parseDOMRecipe } from './dom-parser.js';

/**
 * Fetch HTML content from a URL
 */
async function fetchHTML(url: string, options: ParseOptions = {}): Promise<string> {
  const { timeout = 10000, userAgent = 'RecipeParser/1.0' } = options;

  try {
    const response = await axios.get(url, {
      timeout,
      headers: {
        'User-Agent': userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to fetch URL: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Extract JSON-LD scripts from HTML
 */
function extractJSONLD(html: string): SchemaOrgRecipe[] {
  const $ = cheerio.load(html);
  const recipes: SchemaOrgRecipe[] = [];

  $('script[type="application/ld+json"]').each((_, element) => {
    try {
      const content = $(element).html();
      if (!content) return;

      const data = JSON.parse(content);

      // Handle arrays of items (e.g., @graph)
      if (Array.isArray(data)) {
        data.forEach(item => {
          if (isRecipe(item)) {
            recipes.push(item);
          }
        });
      } else if (data['@graph'] && Array.isArray(data['@graph'])) {
        data['@graph'].forEach((item: unknown) => {
          if (isRecipe(item)) {
            recipes.push(item as SchemaOrgRecipe);
          }
        });
      } else if (isRecipe(data)) {
        recipes.push(data);
      }
    } catch (error) {
      // Malformed JSON, skip this script tag
      console.error('Failed to parse JSON-LD:', error);
    }
  });

  return recipes;
}

/**
 * Check if an object is a Recipe type
 */
function isRecipe(data: unknown): data is SchemaOrgRecipe {
  if (!data || typeof data !== 'object') return false;

  const obj = data as Record<string, unknown>;
  const type = obj['@type'];

  if (typeof type === 'string') {
    return type === 'Recipe';
  }

  if (Array.isArray(type)) {
    return type.includes('Recipe');
  }

  return false;
}

/**
 * Extract image URL from various image formats
 */
function extractImageUrl(image: unknown): string | undefined {
  if (!image) return undefined;

  // String URL
  if (typeof image === 'string') {
    return image;
  }

  // Array of strings or objects
  if (Array.isArray(image) && image.length > 0) {
    const first = image[0];
    if (typeof first === 'string') {
      return first;
    }
    if (typeof first === 'object' && first !== null) {
      return extractImageUrl(first);
    }
  }

  // ImageObject with url property
  if (typeof image === 'object' && image !== null) {
    const obj = image as SchemaOrgImage;
    if (obj.url) {
      return obj.url;
    }
  }

  return undefined;
}

/**
 * Extract recipe instructions from various formats
 */
function extractInstructions(instructions: unknown): string[] {
  if (!instructions) return [];

  // Single string
  if (typeof instructions === 'string') {
    // Split by periods or newlines to get individual steps
    return instructions
      .split(/\.\s+|\n+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);
  }

  // Array of strings or HowToStep objects
  if (Array.isArray(instructions)) {
    return instructions
      .map(step => {
        if (typeof step === 'string') {
          return step.trim();
        }
        if (typeof step === 'object' && step !== null) {
          const obj = step as SchemaOrgStep;
          return (obj.text || obj.name || '').trim();
        }
        return '';
      })
      .filter(s => s.length > 0);
  }

  return [];
}

/**
 * Extract servings from various formats
 */
function extractServings(recipeYield: unknown): number | undefined {
  if (!recipeYield) return undefined;

  // Number
  if (typeof recipeYield === 'number') {
    return recipeYield;
  }

  // String like "4 servings" or "4"
  if (typeof recipeYield === 'string') {
    const match = recipeYield.match(/(\d+)/);
    if (match && match[1]) {
      return parseInt(match[1], 10);
    }
  }

  // Array (take first element)
  if (Array.isArray(recipeYield) && recipeYield.length > 0) {
    return extractServings(recipeYield[0]);
  }

  return undefined;
}

/**
 * Parse a Schema.org Recipe object into ParsedRecipe format
 */
function parseSchemaOrgRecipe(recipe: SchemaOrgRecipe, sourceUrl: string): ParsedRecipe | null {
  // Validate required fields
  if (!recipe.name || !recipe.recipeIngredient || !recipe.recipeInstructions) {
    console.warn('Recipe missing required fields (name, ingredients, or instructions)');
    return null;
  }

  // Parse times
  const { prepTimeMinutes, cookTimeMinutes } = parseTimes(
    recipe.prepTime,
    recipe.cookTime,
    recipe.totalTime
  );

  // Parse ingredients
  const ingredients = parseIngredients(recipe.recipeIngredient || []);

  // Parse instructions
  const instructionStrings = extractInstructions(recipe.recipeInstructions);
  const steps = instructionStrings.map((instruction, index) => ({
    step_number: index + 1,
    instruction,
  }));

  return {
    title: recipe.name,
    description: recipe.description,
    source_url: sourceUrl,
    image_url: extractImageUrl(recipe.image),
    prep_time_minutes: prepTimeMinutes,
    cook_time_minutes: cookTimeMinutes,
    servings: extractServings(recipe.recipeYield),
    ingredients,
    steps,
  };
}

/**
 * Parse a recipe from a URL using JSON-LD extraction
 *
 * @param url Recipe URL to parse
 * @param options Parse options
 * @returns Parsed recipe data, or null if no JSON-LD recipe found
 */
export async function parseRecipeFromURL(
  url: string,
  options: ParseOptions = {}
): Promise<ParsedRecipe | null> {
  console.log(`Attempting to parse recipe from: ${url}`);

  try {
    // Fetch HTML
    const html = await fetchHTML(url, options);

    // Try JSON-LD first
    const recipes = extractJSONLD(html);

    if (recipes.length > 0) {
      console.log(`Found ${recipes.length} JSON-LD recipe(s), using the first one`);

      const recipe = recipes[0];
      if (recipe) {
        const parsed = parseSchemaOrgRecipe(recipe, url);
        if (parsed) {
          console.log(`Successfully parsed recipe via JSON-LD: ${parsed.title}`);
          return parsed;
        }
      }
    }

    // Fall back to DOM parsing
    console.log('No JSON-LD recipes found, falling back to DOM parsing');
    return parseDOMRecipe(html, url);
  } catch (error) {
    console.error('Error parsing recipe:', error);
    throw error;
  }
}

/**
 * Parse recipe from HTML string (for testing or when HTML is already fetched)
 *
 * @param html HTML content containing JSON-LD
 * @param sourceUrl Original URL of the recipe
 * @returns Parsed recipe data, or null if no JSON-LD recipe found
 */
export function parseRecipeFromHTML(html: string, sourceUrl: string): ParsedRecipe | null {
  console.log(`Parsing recipe from HTML for: ${sourceUrl}`);

  try {
    // Try JSON-LD first
    const recipes = extractJSONLD(html);

    if (recipes.length > 0) {
      console.log(`Found ${recipes.length} JSON-LD recipe(s), using the first one`);

      const recipe = recipes[0];
      if (recipe) {
        const parsed = parseSchemaOrgRecipe(recipe, sourceUrl);
        if (parsed) {
          console.log(`Successfully parsed recipe via JSON-LD: ${parsed.title}`);
          return parsed;
        }
      }
    }

    // Fall back to DOM parsing
    console.log('No JSON-LD recipes found, falling back to DOM parsing');
    return parseDOMRecipe(html, sourceUrl);
  } catch (error) {
    console.error('Error parsing recipe from HTML:', error);
    return null;
  }
}
