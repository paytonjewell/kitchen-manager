/**
 * Text Utilities
 * Functions for cleaning and parsing text content from DOM
 */

/**
 * Clean text by removing extra whitespace, HTML entities, and unwanted characters
 */
export function cleanText(text: string | null | undefined): string {
  if (!text) return '';

  return text
    .trim()
    // Remove HTML entities
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    // Remove checkbox/bullet characters
    .replace(/^[\u2610\u2611\u2612\u25A1\u25A0\u25CB\u25CF\u2022\u2023\u2043]\s*/g, '')
    // Remove leading numbers and periods (e.g., "1. ", "2) ")
    .replace(/^\d+[\.\)]\s*/g, '')
    // Collapse multiple spaces
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extract time in minutes from text patterns
 * Examples:
 * - "Prep Time: 15 minutes" → 15
 * - "Cook: 30 min" → 30
 * - "Total: 1 hour 15 minutes" → 75
 * - "45 mins" → 45
 * - "2 hours" → 120
 */
export function extractTimeInMinutes(text: string | null | undefined): number | undefined {
  if (!text) return undefined;

  const cleaned = text.toLowerCase();

  // Pattern for hours and minutes: "1 hour 15 minutes", "2 hrs 30 mins"
  const hourMinutePattern = /(\d+)\s*(?:hour|hr|hrs|h)(?:\s+(\d+)\s*(?:minute|min|mins|m)?)?/i;
  const hourMinuteMatch = cleaned.match(hourMinutePattern);

  if (hourMinuteMatch) {
    const hours = parseInt(hourMinuteMatch[1], 10);
    const minutes = hourMinuteMatch[2] ? parseInt(hourMinuteMatch[2], 10) : 0;
    return hours * 60 + minutes;
  }

  // Pattern for minutes only: "15 minutes", "30 min", "45 mins"
  const minutePattern = /(\d+)\s*(?:minute|min|mins|m)(?!\w)/i;
  const minuteMatch = cleaned.match(minutePattern);

  if (minuteMatch) {
    return parseInt(minuteMatch[1], 10);
  }

  // Pattern for hours only: "2 hours", "1 hr"
  const hourPattern = /(\d+)\s*(?:hour|hr|hrs|h)(?!\w)/i;
  const hourMatch = cleaned.match(hourPattern);

  if (hourMatch) {
    return parseInt(hourMatch[1], 10) * 60;
  }

  return undefined;
}

/**
 * Parse prep and cook times from text content
 */
export function parseTimesFromText(
  text: string | null | undefined
): { prepTimeMinutes?: number; cookTimeMinutes?: number } {
  if (!text) return {};

  const cleaned = text.toLowerCase();

  const result: { prepTimeMinutes?: number; cookTimeMinutes?: number } = {};

  // Look for prep time
  const prepPattern = /prep(?:\s+time)?[:\s]+([^\n]+?)(?:\n|cook|total|$)/i;
  const prepMatch = cleaned.match(prepPattern);
  if (prepMatch && prepMatch[1]) {
    result.prepTimeMinutes = extractTimeInMinutes(prepMatch[1]);
  }

  // Look for cook time
  const cookPattern = /cook(?:\s+time)?[:\s]+([^\n]+?)(?:\n|prep|total|$)/i;
  const cookMatch = cleaned.match(cookPattern);
  if (cookMatch && cookMatch[1]) {
    result.cookTimeMinutes = extractTimeInMinutes(cookMatch[1]);
  }

  return result;
}

/**
 * Extract servings from text
 * Examples:
 * - "Serves: 4" → 4
 * - "Yield: 6 servings" → 6
 * - "Makes 8 portions" → 8
 * - "4-6 servings" → 4 (takes first number)
 */
export function extractServings(text: string | null | undefined): number | undefined {
  if (!text) return undefined;

  const cleaned = text.toLowerCase();

  // Pattern for "Serves: 4", "Yield: 6 servings", "Makes 8"
  const servingsPattern = /(?:serves?|yield|makes?)[:\s]+(\d+)/i;
  const match = cleaned.match(servingsPattern);

  if (match && match[1]) {
    return parseInt(match[1], 10);
  }

  // Pattern for just a number followed by servings/portions
  const numberPattern = /(\d+)\s*(?:serving|portion|people)/i;
  const numberMatch = cleaned.match(numberPattern);

  if (numberMatch && numberMatch[1]) {
    return parseInt(numberMatch[1], 10);
  }

  // Pattern for range like "4-6 servings" - take the first number
  const rangePattern = /(\d+)\s*-\s*\d+\s*(?:serving|portion)/i;
  const rangeMatch = cleaned.match(rangePattern);

  if (rangeMatch && rangeMatch[1]) {
    return parseInt(rangeMatch[1], 10);
  }

  return undefined;
}

/**
 * Clean and normalize a title
 * Removes common suffixes like "| Recipe", "- Allrecipes", etc.
 */
export function cleanTitle(title: string | null | undefined): string {
  if (!title) return '';

  return cleanText(title)
    // Remove common recipe site suffixes
    .replace(/\s*[-|]\s*(?:recipe|allrecipes|food network|bon appétit|serious eats|tasty|epicurious).*$/i, '')
    .trim();
}

/**
 * Split a single text block into steps
 * Handles cases where instructions are in a single paragraph
 */
export function splitIntoSteps(text: string): string[] {
  if (!text) return [];

  // Try splitting by numbered patterns: "1.", "2)", etc.
  const numberedSteps = text.split(/\d+[\.\)]\s+/).filter(s => s.trim().length > 0);
  if (numberedSteps.length > 1) {
    return numberedSteps.map(s => cleanText(s));
  }

  // Try splitting by newlines
  const lineSteps = text.split(/\n+/).filter(s => s.trim().length > 0);
  if (lineSteps.length > 1) {
    return lineSteps.map(s => cleanText(s));
  }

  // Try splitting by periods followed by capital letters or line breaks
  const sentenceSteps = text
    .split(/\.\s+(?=[A-Z])/)
    .filter(s => s.trim().length > 20); // Only if substantial sentences

  if (sentenceSteps.length > 1) {
    return sentenceSteps.map(s => cleanText(s));
  }

  // If nothing works, return the whole text as a single step
  const cleaned = cleanText(text);
  return cleaned.length > 0 ? [cleaned] : [];
}

/**
 * Check if text looks like an ingredient (vs navigation, ads, etc.)
 */
export function isLikelyIngredient(text: string): boolean {
  if (!text || text.length < 2) return false;

  const cleaned = text.toLowerCase().trim();

  // Filter out common non-ingredient patterns
  const excludePatterns = [
    /^(print|save|share|pin|email|comment|rating|review|subscribe)$/i,
    /^(ingredients|instructions|directions|steps|method|preparation)$/i,
    /^\d+\s*star/i, // "5 stars"
    /recipe/i,
    /^by\s+/i, // "by Author Name"
  ];

  for (const pattern of excludePatterns) {
    if (pattern.test(cleaned)) {
      return false;
    }
  }

  // Ingredients typically have some length and may include numbers
  return cleaned.length >= 2 && cleaned.length < 200;
}

/**
 * Check if text looks like an instruction step
 */
export function isLikelyInstruction(text: string): boolean {
  if (!text || text.length < 10) return false;

  const cleaned = text.toLowerCase().trim();

  // Filter out common non-instruction patterns
  const excludePatterns = [
    /^(print|save|share|pin|email|comment|rating|review|subscribe)$/i,
    /^(ingredients|instructions|directions|steps|method|preparation)$/i,
    /^\d+\s*star/i,
  ];

  for (const pattern of excludePatterns) {
    if (pattern.test(cleaned)) {
      return false;
    }
  }

  // Instructions typically are longer and contain action verbs
  return cleaned.length >= 10 && cleaned.length < 1000;
}
