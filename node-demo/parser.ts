// Parse an ISO-8601 date string and return a Date object.
// Return null if invalid. Do not throw.
export function parseDate(dateString: string): Date | null {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return null;
    }
    return date;
}