/**
 * DOM-Based Recipe Parser
 * Fallback parser that uses DOM crawling and heuristics when JSON-LD is not available
 */

import * as cheerio from 'cheerio';
import type { ParsedRecipe, ParsedIngredient, ParsedStep } from './types.js';
import { parseIngredient } from './ingredient-parser.js';
import {
  TITLE_SELECTORS,
  TITLE_META_SELECTORS,
  INGREDIENT_SELECTORS,
  INGREDIENT_ITEM_SELECTORS,
  INSTRUCTION_SELECTORS,
  INSTRUCTION_ITEM_SELECTORS,
  IMAGE_SELECTORS,
  DESCRIPTION_SELECTORS,
  TIME_SELECTORS,
  SERVINGS_SELECTORS,
} from './selectors.js';
import {
  cleanText,
  cleanTitle,
  extractTimeInMinutes,
  parseTimesFromText,
  extractServings,
  splitIntoSteps,
  isLikelyIngredient,
  isLikelyInstruction,
} from './text-utils.js';

/**
 * Extract recipe title from DOM
 */
function extractTitle($: cheerio.CheerioAPI): string | undefined {
  // Try common title selectors
  for (const selector of TITLE_SELECTORS) {
    const element = $(selector).first();
    if (element.length > 0) {
      const text = cleanTitle(element.text());
      if (text.length > 0) {
        return text;
      }
    }
  }

  // Try meta tags
  for (const selector of TITLE_META_SELECTORS) {
    const element = $(selector).first();
    if (element.length > 0) {
      if (selector === 'title') {
        const text = cleanTitle(element.text());
        if (text.length > 0) {
          return text;
        }
      } else {
        const content = element.attr('content');
        if (content) {
          const text = cleanTitle(content);
          if (text.length > 0) {
            return text;
          }
        }
      }
    }
  }

  return undefined;
}

/**
 * Extract recipe description from DOM
 */
function extractDescription($: cheerio.CheerioAPI): string | undefined {
  for (const selector of DESCRIPTION_SELECTORS) {
    const element = $(selector).first();
    if (element.length > 0) {
      if (selector.startsWith('meta')) {
        const content = element.attr('content');
        if (content) {
          const text = cleanText(content);
          if (text.length > 0) {
            return text;
          }
        }
      } else {
        const text = cleanText(element.text());
        if (text.length > 0) {
          return text;
        }
      }
    }
  }

  return undefined;
}

/**
 * Extract ingredients from DOM
 */
function extractIngredients($: cheerio.CheerioAPI): ParsedIngredient[] {
  const ingredients: ParsedIngredient[] = [];

  // Try to find ingredient lists
  for (const selector of INGREDIENT_SELECTORS) {
    const container = $(selector).first();
    if (container.length > 0) {
      // Look for list items within the container
      const items = container.find(INGREDIENT_ITEM_SELECTORS.join(', '));

      items.each((_, element) => {
        const text = cleanText($(element).text());
        if (text && isLikelyIngredient(text)) {
          const parsed = parseIngredient(text);
          if (parsed.ingredient_name) {
            ingredients.push(parsed);
          }
        }
      });

      // If we found ingredients, return them
      if (ingredients.length > 0) {
        return ingredients;
      }
    }
  }

  // Fallback: look for any lists that might contain ingredients
  $('ul li, ol li').each((_, element) => {
    const text = cleanText($(element).text());
    if (text && isLikelyIngredient(text)) {
      const parsed = parseIngredient(text);
      if (parsed.ingredient_name) {
        ingredients.push(parsed);
      }
    }
  });

  return ingredients;
}

/**
 * Extract recipe instructions/steps from DOM
 */
function extractInstructions($: cheerio.CheerioAPI): ParsedStep[] {
  const steps: ParsedStep[] = [];

  // Try to find instruction lists
  for (const selector of INSTRUCTION_SELECTORS) {
    const container = $(selector).first();
    if (container.length > 0) {
      // Look for list items within the container
      const items = container.find(INSTRUCTION_ITEM_SELECTORS.join(', '));

      items.each((_, element) => {
        const text = cleanText($(element).text());
        if (text && isLikelyInstruction(text)) {
          steps.push({
            step_number: steps.length + 1,
            instruction: text,
          });
        }
      });

      // If we found steps, return them
      if (steps.length > 0) {
        return steps;
      }
    }
  }

  // Fallback: look for numbered lists that might be instructions
  $('ol li').each((_, element) => {
    const text = cleanText($(element).text());
    if (text && isLikelyInstruction(text)) {
      steps.push({
        step_number: steps.length + 1,
        instruction: text,
      });
    }
  });

  // If still no steps, try to find a text block and split it
  if (steps.length === 0) {
    for (const selector of INSTRUCTION_SELECTORS) {
      const container = $(selector).first();
      if (container.length > 0) {
        const text = cleanText(container.text());
        if (text.length > 0) {
          const splitSteps = splitIntoSteps(text);
          return splitSteps.map((instruction, index) => ({
            step_number: index + 1,
            instruction,
          }));
        }
      }
    }
  }

  return steps;
}

/**
 * Extract recipe image URL from DOM
 */
function extractImageUrl($: cheerio.CheerioAPI): string | undefined {
  for (const selector of IMAGE_SELECTORS) {
    const element = $(selector).first();
    if (element.length > 0) {
      if (selector.startsWith('meta')) {
        const content = element.attr('content');
        if (content && content.startsWith('http')) {
          return content;
        }
      } else {
        const src = element.attr('src');
        if (src && src.startsWith('http')) {
          return src;
        }
      }
    }
  }

  return undefined;
}

/**
 * Extract time information from DOM
 */
function extractTimes($: cheerio.CheerioAPI): {
  prepTimeMinutes?: number;
  cookTimeMinutes?: number;
} {
  const result: { prepTimeMinutes?: number; cookTimeMinutes?: number } = {};

  // Try time-specific selectors
  for (const selector of TIME_SELECTORS) {
    const element = $(selector).first();
    if (element.length > 0) {
      const selectorLower = selector.toLowerCase();

      // Check if this is a prep time element
      if (selectorLower.includes('prep')) {
        const datetime = element.attr('datetime');
        if (datetime) {
          // Try parsing ISO 8601 duration
          const minutes = extractTimeInMinutes(datetime);
          if (minutes) {
            result.prepTimeMinutes = minutes;
          }
        } else {
          const text = cleanText(element.text());
          const minutes = extractTimeInMinutes(text);
          if (minutes) {
            result.prepTimeMinutes = minutes;
          }
        }
      }

      // Check if this is a cook time element
      if (selectorLower.includes('cook')) {
        const datetime = element.attr('datetime');
        if (datetime) {
          const minutes = extractTimeInMinutes(datetime);
          if (minutes) {
            result.cookTimeMinutes = minutes;
          }
        } else {
          const text = cleanText(element.text());
          const minutes = extractTimeInMinutes(text);
          if (minutes) {
            result.cookTimeMinutes = minutes;
          }
        }
      }
    }
  }

  // If we didn't find times with specific selectors, search the page text
  if (!result.prepTimeMinutes && !result.cookTimeMinutes) {
    const bodyText = $('body').text();
    const parsed = parseTimesFromText(bodyText);
    Object.assign(result, parsed);
  }

  return result;
}

/**
 * Extract servings information from DOM
 */
function extractServingsFromDOM($: cheerio.CheerioAPI): number | undefined {
  // Try servings-specific selectors
  for (const selector of SERVINGS_SELECTORS) {
    const element = $(selector).first();
    if (element.length > 0) {
      const text = cleanText(element.text());
      const servings = extractServings(text);
      if (servings) {
        return servings;
      }
    }
  }

  // Search the page text for servings information
  const bodyText = $('body').text();
  return extractServings(bodyText);
}

/**
 * Parse recipe from HTML using DOM crawling
 *
 * @param html HTML content to parse
 * @param sourceUrl Original URL of the recipe
 * @returns Parsed recipe data, or null if insufficient data found
 */
export function parseDOMRecipe(html: string, sourceUrl: string): ParsedRecipe | null {
  console.log(`Attempting DOM-based parsing for: ${sourceUrl}`);

  try {
    const $ = cheerio.load(html);

    // Extract all components
    const title = extractTitle($);
    const description = extractDescription($);
    const ingredients = extractIngredients($);
    const steps = extractInstructions($);
    const imageUrl = extractImageUrl($);
    const { prepTimeMinutes, cookTimeMinutes } = extractTimes($);
    const servings = extractServingsFromDOM($);

    // Validate that we have minimum required data
    if (!title || ingredients.length === 0 || steps.length === 0) {
      console.log(
        `Insufficient data found: title=${!!title}, ingredients=${ingredients.length}, steps=${steps.length}`
      );
      return null;
    }

    console.log(
      `Successfully parsed recipe via DOM: ${title} (${ingredients.length} ingredients, ${steps.length} steps)`
    );

    return {
      title,
      description,
      source_url: sourceUrl,
      image_url: imageUrl,
      prep_time_minutes: prepTimeMinutes,
      cook_time_minutes: cookTimeMinutes,
      servings,
      ingredients,
      steps,
    };
  } catch (error) {
    console.error('Error parsing recipe via DOM:', error);
    return null;
  }
}
