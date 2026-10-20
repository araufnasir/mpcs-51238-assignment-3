import { computeStreak } from "./streak";
import type { Session, Streak } from "./streak";

export const FIRST_SESSION_MESSAGE = "First session logged. Come back tomorrow to start a streak.";

const MILESTONES: Record<number, string> = {
  3: "Three days in a row. A habit is forming!",
  7: "A full week in a row!",
  14: "Two weeks in a row. Keep going!",
  30: "A whole month in a row. Remarkable!",
};

/** The message for an active streak that sits exactly on a milestone (3, 7, 14 or 30 days). */
export function milestoneMessage(streak: Streak): string | undefined {
  return streak.state === "active" ? MILESTONES[streak.count] : undefined;
}

/**
 * What to tell the user right after they log a session.
 * - the very first session: the first-session message
 * - the log that makes the streak reach a milestone: the milestone, then the usual line
 * - anything else (including a second log on a milestone day): the usual line
 * `before` is the saved sessions without `logged`.
 */
export function logMessage(logged: Session, before: Session[]): string {
  const usual = `Logged ${logged.minutes} min of ${logged.subject}.`;
  if (before.length === 0) return FIRST_SESSION_MESSAGE;

  const wasActive = computeStreak(before, logged.date).state === "active";
  const milestone = wasActive ? undefined : milestoneMessage(computeStreak([logged, ...before], logged.date));
  return milestone ? `${milestone} ${usual}` : usual;
}
