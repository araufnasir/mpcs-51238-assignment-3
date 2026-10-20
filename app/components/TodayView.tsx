"use client";

import Link from "next/link";
import { formatMinutes, plural } from "@/lib/format";
import type { Streak } from "@/lib/streak";
import { useSessions } from "@/lib/useSessions";
import Card from "./Card";
import SessionForm from "./SessionForm";
import SessionList from "./SessionList";
import Skeleton from "./Skeleton";
import StatCard from "./StatCard";
import { focusRing, type } from "./type";
import WelcomeBanner from "./WelcomeBanner";

const RECENT = 3;

function streakNote({ state, count }: Streak): string {
  switch (state) {
    case "new":
      return "Start today";
    case "active":
      return "Done for today";
    case "at-risk":
      return "Log today to keep it";
    case "broken":
      return `Last streak: ${plural(count, "day")}`;
  }
}

export default function TodayView() {
  const { ready, sessions, today, weekMinutes, weekSessions, streak } = useSessions();

  if (!ready) return <Skeleton />;

  // A broken streak is 0 today; its old length only appears in the note and banner.
  const streakDays = streak.state === "broken" ? 0 : streak.count;

  return (
    <div className="space-y-5 sm:space-y-8">
      <h1 className="sr-only">Today</h1>
      <WelcomeBanner streak={streak} />

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <StatCard label="This week" value={formatMinutes(weekMinutes)} note={plural(weekSessions, "session")} />
        <StatCard label="Streak" value={plural(streakDays, "day")} note={streakNote(streak)} />
      </div>

      <Card aria-labelledby="quick-log">
        <h2 id="quick-log" className={`${type.heading} mb-4 sm:mb-5`}>
          Log a session
        </h2>
        {/* On a first visit there is nothing else to do, so the subject starts focused. */}
        <SessionForm compact autoFocus={sessions.length === 0} />
        <p className={`${type.bodySmall} mt-3 text-ln-muted`}>Saved in this browser only.</p>
      </Card>

      <section aria-labelledby="recent" className="space-y-4">
        <div className="flex items-baseline justify-between gap-4">
          <h2 id="recent" className={type.heading}>
            Recent
          </h2>
          {sessions.length > RECENT && (
            <Link href="/history" className={`${type.label} underline underline-offset-4 ${focusRing}`}>
              All history
            </Link>
          )}
        </div>
        <SessionList
          sessions={sessions.slice(0, RECENT)}
          today={today}
          empty="Your sessions will show up here."
        />
      </section>
    </div>
  );
}
