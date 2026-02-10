/**
 * Common Selector Patterns
 * Defines CSS selectors commonly used by recipe websites
 */

/**
 * Selectors for recipe titles, in priority order
 */
export const TITLE_SELECTORS = [
  'h1.recipe-title',
  'h1[itemprop="name"]',
  'h1.entry-title',
  'h1.post-title',
  '[class*="recipe"] h1',
  'article h1',
  'h1',
];

/**
 * Meta tag selectors for fallback title extraction
 */
export const TITLE_META_SELECTORS = [
  'meta[property="og:title"]',
  'meta[name="twitter:title"]',
  'title',
];

/**
 * Selectors for ingredient lists, in priority order
 */
export const INGREDIENT_SELECTORS = [
  'ul.ingredients',
  'ol.ingredients',
  'ul[class*="ingredient"]',
  'ol[class*="ingredient"]',
  'ul[class*="recipe-ingredient"]',
  '[itemprop="recipeIngredient"]',
  '[class*="ingredient-list"]',
  'div.ingredients ul',
  'div.ingredients ol',
  'section[class*="ingredient"] ul',
  'section[class*="ingredient"] ol',
];

/**
 * Selectors for ingredient list items
 */
export const INGREDIENT_ITEM_SELECTORS = [
  'li[itemprop="recipeIngredient"]',
  'li',
  'p[itemprop="recipeIngredient"]',
  'div[itemprop="recipeIngredient"]',
];

/**
 * Selectors for recipe instructions, in priority order
 */
export const INSTRUCTION_SELECTORS = [
  'ol.instructions',
  'ol.recipe-instructions',
  'ol[class*="instruction"]',
  'ol[class*="direction"]',
  'ol[class*="step"]',
  '[itemprop="recipeInstructions"]',
  'div.instructions ol',
  'div[class*="instruction"] ol',
  'section[class*="instruction"] ol',
  'section[class*="direction"] ol',
];

/**
 * Selectors for instruction list items
 */
export const INSTRUCTION_ITEM_SELECTORS = [
  'li[itemprop="step"]',
  'li[class*="step"]',
  'li',
  'div[class*="step"]',
  'p[class*="step"]',
];

/**
 * Selectors for recipe images, in priority order
 */
export const IMAGE_SELECTORS = [
  'meta[property="og:image"]',
  'meta[name="twitter:image"]',
  'img[itemprop="image"]',
  'img[class*="recipe-image"]',
  'img[class*="recipe-photo"]',
  'article img',
  '[class*="recipe"] img',
  'img',
];

/**
 * Selectors for recipe description
 */
export const DESCRIPTION_SELECTORS = [
  'meta[property="og:description"]',
  'meta[name="description"]',
  '[itemprop="description"]',
  'div.recipe-description',
  'p.recipe-description',
];

/**
 * Selectors for time information
 */
export const TIME_SELECTORS = [
  '[itemprop="prepTime"]',
  '[itemprop="cookTime"]',
  '[itemprop="totalTime"]',
  '[class*="prep-time"]',
  '[class*="cook-time"]',
  '[class*="total-time"]',
  'time[datetime]',
];

/**
 * Selectors for servings/yield information
 */
export const SERVINGS_SELECTORS = [
  '[itemprop="recipeYield"]',
  '[class*="yield"]',
  '[class*="serving"]',
  'span[class*="servings"]',
];
