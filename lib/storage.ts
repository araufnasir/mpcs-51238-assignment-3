import type { Session } from "./streak";

// One key holds everything: { version: 1, sessions: [...] }, newest first.
export const STORAGE_KEY = "study-log";
const VERSION = 1;

function isSession(value: unknown): value is Session {
  if (typeof value !== "object" || value === null) return false;
  const s = value as Record<string, unknown>;
  return (
    typeof s.id === "string" &&
    typeof s.subject === "string" &&
    typeof s.minutes === "number" &&
    Number.isFinite(s.minutes) &&
    typeof s.notes === "string" &&
    typeof s.date === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(s.date) &&
    typeof s.createdAt === "number"
  );
}

/** Parses stored text. Anything missing, corrupt or from an unknown version becomes an empty list. */
export function parseSessions(raw: string | null): Session[] {
  if (!raw) return [];
  try {
    const data: unknown = JSON.parse(raw);
    if (typeof data !== "object" || data === null) return [];
    const { version, sessions } = data as { version?: unknown; sessions?: unknown };
    if (version !== VERSION || !Array.isArray(sessions)) return [];
    return sessions.filter(isSession);
  } catch {
    return [];
  }
}

/** Reads sessions, and reports whether localStorage works at all in this browser. */
export function loadSessions(): { sessions: Session[]; available: boolean } {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return { sessions: parseSessions(raw), available: true };
  } catch {
    return { sessions: [], available: false };
  }
}

/** Returns false when the browser refuses the write (quota, blocked storage). */
export function saveSessions(sessions: Session[]): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: VERSION, sessions }));
    return true;
  } catch {
    return false;
  }
}
