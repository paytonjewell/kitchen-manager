/**
 * Normalizes ingredient names for consistent storage and searching
 */
export function normalizeIngredient(name: string): string {
  if (!name) {
    return '';
  }

  // Convert to lowercase and trim whitespace
  let normalized = name.toLowerCase().trim();

  // Remove extra whitespace between words
  normalized = normalized.replace(/\s+/g, ' ');

  // Remove common prefixes
  normalized = normalized.replace(/^(fresh|dried|canned|frozen|raw|cooked)\s+/i, '');

  // Basic singularization rules
  normalized = singularize(normalized);

  return normalized;
}

/**
 * Basic singularization of common ingredient plural forms
 */
function singularize(word: string): string {
  // Common exceptions where plural form is preferred
  const pluralExceptions = [
    'beans',
    'peas',
    'lentils',
    'oats',
    'grits',
    'greens',
    'sprouts',
    'noodles',
    'chips',
    'breadcrumbs',
  ];

  // Check if the word ends with any of the plural exceptions
  const hasException = pluralExceptions.some((exception) => word.endsWith(exception));
  if (hasException) {
    return word;
  }

  // Standard pluralization rules
  if (word.endsWith('ies')) {
    // berries -> berry, cherries -> cherry
    return word.slice(0, -3) + 'y';
  } else if (word.endsWith('ves')) {
    // knives -> knife, loaves -> loaf
    return word.slice(0, -3) + 'f';
  } else if (word.endsWith('ses')) {
    // tomatoes -> tomato (but actually 'tomatoses' -> 'tomatos')
    return word.slice(0, -2);
  } else if (word.endsWith('es')) {
    // Check if it's a word that needs 'es' removed
    const baseWithoutEs = word.slice(0, -2);
    if (
      baseWithoutEs.endsWith('tato') ||
      baseWithoutEs.endsWith('mato') ||
      baseWithoutEs.endsWith('hero')
    ) {
      return baseWithoutEs;
    }
  } else if (word.endsWith('s') && !word.endsWith('ss')) {
    // eggs -> egg, carrots -> carrot
    // But not glass -> glas
    return word.slice(0, -1);
  }

  return word;
}
