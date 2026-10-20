import type { Session } from "./streak";

/**
 * The most recently used subjects, newest first, each listed once. "math" and "Math" count as
 * the same subject; the spelling from the latest session wins.
 */
export function recentSubjects(sessions: Session[], limit = 4): string[] {
  const seen = new Set<string>();
  const subjects: string[] = [];

  for (const session of [...sessions].sort((a, b) => b.createdAt - a.createdAt)) {
    const subject = session.subject.trim();
    const key = subject.toLowerCase();
    if (!subject || seen.has(key)) continue;
    seen.add(key);
    subjects.push(subject);
    if (subjects.length === limit) break;
  }

  return subjects;
}
