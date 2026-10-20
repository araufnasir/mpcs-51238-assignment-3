// Pure date, week and streak logic. Days are local calendar dates stored as "YYYY-MM-DD" keys,
// so a late-night session never lands on the wrong day. Key math runs in UTC to avoid DST drift.

export type Session = {
  id: string;
  subject: string;
  minutes: number;
  notes: string;
  date: string;
  createdAt: number;
};

export type StreakState = "new" | "active" | "at-risk" | "broken";

export type Streak = { state: StreakState; count: number };

const DAY_MS = 86_400_000;

export function toDateKey(d: Date): string {
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

function keyToUtc(key: string): number {
  const [y, m, d] = key.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

function utcToKey(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

export function addDays(key: string, days: number): string {
  return utcToKey(keyToUtc(key) + days * DAY_MS);
}

/** Whole days from `a` to `b` (positive when `b` is later). */
export function dayDiff(a: string, b: string): number {
  return Math.round((keyToUtc(b) - keyToUtc(a)) / DAY_MS);
}

/** The Monday on or before `key`. */
export function startOfWeek(key: string): string {
  const dow = new Date(keyToUtc(key)).getUTCDay(); // 0 = Sunday
  return addDays(key, -((dow + 6) % 7));
}

export function weeklyMinutes(sessions: Session[], today: string): number {
  const monday = startOfWeek(today);
  return sessions.reduce((sum, s) => (s.date >= monday ? sum + s.minutes : sum), 0);
}

export function weeklySessions(sessions: Session[], today: string): number {
  const monday = startOfWeek(today);
  return sessions.filter((s) => s.date >= monday).length;
}

export function computeStreak(sessions: Session[], today: string): Streak {
  if (sessions.length === 0) return { state: "new", count: 0 };

  const days = new Set(sessions.map((s) => s.date));
  let last = "";
  for (const day of days) if (day > last) last = day;

  let count = 0;
  for (let day = last; days.has(day); day = addDays(day, -1)) count++;

  const gap = dayDiff(last, today);
  if (gap <= 0) return { state: "active", count };
  if (gap === 1) return { state: "at-risk", count };
  return { state: "broken", count };
}

export function formatDayLabel(key: string, today: string): string {
  const gap = dayDiff(key, today);
  if (gap === 0) return "Today";
  if (gap === 1) return "Yesterday";
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

/** Groups sessions (already newest first) into consecutive same-day runs. */
export function groupByDay(sessions: Session[]): { date: string; sessions: Session[] }[] {
  const groups: { date: string; sessions: Session[] }[] = [];
  for (const s of sessions) {
    const group = groups[groups.length - 1];
    if (group && group.date === s.date) group.sessions.push(s);
    else groups.push({ date: s.date, sessions: [s] });
  }
  return groups;
}
