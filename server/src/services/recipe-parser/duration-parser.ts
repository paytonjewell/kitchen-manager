/**
 * ISO 8601 Duration Parser
 * Parses ISO 8601 duration strings (e.g., PT15M, PT1H30M) to minutes
 */

/**
 * Parse ISO 8601 duration string to minutes
 * Examples:
 * - PT15M => 15 minutes
 * - PT1H => 60 minutes
 * - PT1H30M => 90 minutes
 * - PT2H45M => 165 minutes
 * - P1DT2H30M => 1 day + 2 hours + 30 minutes = 1590 minutes
 *
 * @param duration ISO 8601 duration string
 * @returns Number of minutes, or undefined if parsing fails
 */
export function parseISO8601Duration(duration: string | undefined): number | undefined {
  if (!duration || typeof duration !== 'string') {
    return undefined;
  }

  // ISO 8601 duration format: P[n]Y[n]M[n]DT[n]H[n]M[n]S
  // We care about: P[n]DT[n]H[n]M
  const regex = /P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const matches = duration.match(regex);

  if (!matches) {
    return undefined;
  }

  const [, days, hours, minutes, seconds] = matches;

  let totalMinutes = 0;

  if (days) {
    totalMinutes += parseInt(days, 10) * 24 * 60;
  }

  if (hours) {
    totalMinutes += parseInt(hours, 10) * 60;
  }

  if (minutes) {
    totalMinutes += parseInt(minutes, 10);
  }

  if (seconds) {
    // Round up seconds to nearest minute
    totalMinutes += Math.ceil(parseInt(seconds, 10) / 60);
  }

  return totalMinutes > 0 ? totalMinutes : undefined;
}

/**
 * Calculate total time from prep and cook times
 * If totalTime is provided, use it; otherwise sum prep and cook times
 *
 * @param prepTime ISO 8601 prep time
 * @param cookTime ISO 8601 cook time
 * @param totalTime ISO 8601 total time
 * @returns Object with prepTimeMinutes and cookTimeMinutes
 */
export function parseTimes(
  prepTime?: string,
  cookTime?: string,
  totalTime?: string
): { prepTimeMinutes?: number; cookTimeMinutes?: number } {
  const prepMinutes = parseISO8601Duration(prepTime);
  const cookMinutes = parseISO8601Duration(cookTime);
  const totalMinutes = parseISO8601Duration(totalTime);

  // If we have total time but not both prep and cook, calculate the missing one
  if (totalMinutes !== undefined) {
    if (prepMinutes !== undefined && cookMinutes === undefined) {
      return {
        prepTimeMinutes: prepMinutes,
        cookTimeMinutes: totalMinutes - prepMinutes,
      };
    }
    if (cookMinutes !== undefined && prepMinutes === undefined) {
      return {
        prepTimeMinutes: totalMinutes - cookMinutes,
        cookTimeMinutes: cookMinutes,
      };
    }
  }

  return {
    prepTimeMinutes: prepMinutes,
    cookTimeMinutes: cookMinutes,
  };
}
