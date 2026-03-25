export type ViewMode = "month" | "week" | "day";

export function toYMD(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/** Returns 0=Mon … 6=Sun for first day of month */
export function firstDayOfMonth(year: number, month: number): number {
  const d = new Date(year, month, 1).getDay(); // 0=Sun
  return (d + 6) % 7; // convert to Mon=0
}
