import type { ReactNode } from "react";
import { formatDayLabel, groupByDay } from "@/lib/streak";
import type { Session } from "@/lib/streak";
import SessionItem from "./SessionItem";
import { type } from "./type";

type Props = {
  sessions: Session[];
  today: string;
  empty: ReactNode;
  onDelete?: (id: string) => void;
};

/** Sessions grouped by day, newest first. Passing onDelete adds the inline Yes/No delete. */
export default function SessionList({ sessions, today, empty, onDelete }: Props) {
  if (sessions.length === 0) return <p className={`${type.body} text-ln-muted`}>{empty}</p>;

  return (
    <div className="space-y-6">
      {groupByDay(sessions).map(({ date, sessions: items }) => (
        <section key={date} aria-label={formatDayLabel(date, today)}>
          <h3 className={`${type.label} text-ln-muted`}>{formatDayLabel(date, today)}</h3>
          <ul className="mt-1 border-t border-ln-text">
            {items.map((s) => (
              <SessionItem key={s.id} session={s} onDelete={onDelete} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
