/**
 * Parses an ISO-8601 date string into a Date object.
 *
 * @param dateString - The ISO-8601 date string to parse.
 * @returns A valid `Date`, or `null` if the string is invalid.
 * @example
 * parseDate('2024-01-15T10:30:00Z'); // Date object
 * parseDate('not-a-date');            // null
 */
export function parseDate(dateString: string): Date | null {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return null;
  }
  return date;
}