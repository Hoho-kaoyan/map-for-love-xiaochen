/**
 * Computes the number of days between a given anniversary date and today.
 *
 * Return shape is `{ days, isFuture }`:
 * - `days` is the absolute number of days (always non-negative)
 * - `isFuture` is `true` when the given date is later than today
 *
 * Returns `null` when the input is missing or not in the expected `YYYY.MM.DD`
 * format (the project-wide convention from `data/appSettings.ts`).
 *
 * Extracted from `components/HomeProgress.tsx:82-97` so it can be reused by
 * the mobile login page (P0-1) and the anniversary Tab (P0-3) without
 * coupling them to the home dashboard.
 */
export const daysTogether = (date?: string) => {
  if (!date || !/^\d{4}\.\d{2}\.\d{2}$/.test(date)) return null;

  const [year, month, day] = date.split(".").map(Number);
  const start = new Date(year, month - 1, day);
  const today = new Date();

  start.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diff = Math.floor((today.getTime() - start.getTime()) / 86_400_000);
  return {
    days: Math.abs(diff),
    isFuture: diff < 0,
  };
};