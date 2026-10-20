"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { loadSessions, saveSessions } from "./storage";
import { computeStreak, toDateKey, weeklyMinutes, weeklySessions } from "./streak";
import type { Session } from "./streak";
import type { SessionInput } from "./validation";

// A tiny module-level store shared by every page, so navigating between routes keeps the data.
// The server snapshot is null, so the first render is the same on server and client; React
// swaps in the real localStorage data right after hydration.
type Snapshot = { sessions: Session[]; persisted: boolean };

let snapshot: Snapshot | null = null;
const listeners = new Set<() => void>();

function getSnapshot(): Snapshot {
  if (!snapshot) {
    const { sessions, available } = loadSessions();
    snapshot = { sessions, persisted: available };
  }
  return snapshot;
}

function getServerSnapshot(): Snapshot | null {
  return null;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Saves first, so a failed write leaves memory and storage in agreement. */
function commit(sessions: Session[]): boolean {
  const current = getSnapshot();
  if (current.persisted && !saveSessions(sessions)) return false;
  snapshot = { ...current, sessions };
  listeners.forEach((listener) => listener());
  return true;
}

function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function useSessions() {
  const snap = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const add = useCallback((input: SessionInput): { ok: boolean; session?: Session } => {
    const session: Session = {
      id: makeId(),
      ...input,
      date: toDateKey(new Date()),
      createdAt: Date.now(),
    };
    const ok = commit([session, ...getSnapshot().sessions]);
    return ok ? { ok, session } : { ok };
  }, []);

  const remove = useCallback((id: string): boolean => {
    return commit(getSnapshot().sessions.filter((s) => s.id !== id));
  }, []);

  const derived = useMemo(() => {
    if (!snap) return null;
    const today = toDateKey(new Date());
    return {
      today,
      weekMinutes: weeklyMinutes(snap.sessions, today),
      weekSessions: weeklySessions(snap.sessions, today),
      streak: computeStreak(snap.sessions, today),
    };
  }, [snap]);

  return {
    /** False on the server and during hydration; render a skeleton until true. */
    ready: snap !== null,
    /** False when localStorage is unavailable, so history only lives in memory. */
    persisted: snap?.persisted ?? true,
    sessions: snap?.sessions ?? [],
    today: derived?.today ?? "",
    weekMinutes: derived?.weekMinutes ?? 0,
    weekSessions: derived?.weekSessions ?? 0,
    streak: derived?.streak ?? { state: "new" as const, count: 0 },
    add,
    remove,
  };
}
