"use client";

import Link from "next/link";
import { useRef } from "react";
import { formatMinutes } from "@/lib/format";
import { startOfWeek } from "@/lib/streak";
import { useSessions } from "@/lib/useSessions";
import SessionList from "./SessionList";
import Skeleton from "./Skeleton";
import { Toast, useToast } from "./Toast";
import { focusRing, type } from "./type";

export default function HistoryView() {
  const { ready, sessions, today, weekMinutes, remove } = useSessions();
  const { message, show } = useToast();
  const headingRef = useRef<HTMLHeadingElement>(null);

  if (!ready) return <Skeleton />;

  const thisWeek = sessions.some((s) => s.date >= startOfWeek(today));

  function onDelete(id: string) {
    // The focused row is about to disappear, so move focus somewhere stable first.
    headingRef.current?.focus();
    show(remove(id) ? "Session deleted" : "Couldn't delete. Your browser may be blocking storage.");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 ref={headingRef} tabIndex={-1} className={type.title}>
          History
        </h1>
        {sessions.length > 0 && (
          <p className={`${type.body} mt-2 text-ln-muted`}>This week: {formatMinutes(weekMinutes)}</p>
        )}
        <Toast message={message} className="mt-2 min-h-[1.375rem]" />
      </div>

      {sessions.length > 0 && !thisWeek && <p className={type.body}>Nothing logged this week yet.</p>}

      <SessionList
        sessions={sessions}
        today={today}
        onDelete={onDelete}
        empty={
          <>
            No sessions yet.{" "}
            <Link href="/log" className={`underline underline-offset-4 ${focusRing}`}>
              Log your first one
            </Link>
            .
          </>
        }
      />
    </div>
  );
}
