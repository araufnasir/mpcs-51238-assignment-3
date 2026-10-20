"use client";

import { useState } from "react";
import { formatMinutes } from "@/lib/format";
import type { Session } from "@/lib/streak";
import Button from "./Button";
import { type } from "./type";

type Props = { session: Session; onDelete?: (id: string) => void };

export default function SessionItem({ session, onDelete }: Props) {
  const [confirming, setConfirming] = useState(false);

  return (
    <li className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3 border-b border-ln-muted py-4 last:border-b-0">
      <div className="min-w-0">
        <p className={`${type.body} break-words`}>
          <span className="font-medium">{session.subject}</span>
          <span className="text-ln-muted"> · {formatMinutes(session.minutes)}</span>
        </p>
        {session.notes && (
          <p className={`${type.bodySmall} mt-1 whitespace-pre-line break-words text-ln-muted`}>{session.notes}</p>
        )}
      </div>

      {onDelete &&
        (confirming ? (
          <div role="group" aria-label={`Delete ${session.subject}?`} className="flex items-center gap-2">
            <span className={type.bodySmall}>Delete?</span>
            <Button size="sm" variant="primary" onClick={() => onDelete(session.id)}>
              Yes
            </Button>
            {/* Focus lands on the safe choice when the confirm appears. */}
            <Button size="sm" autoFocus onClick={() => setConfirming(false)}>
              No
            </Button>
          </div>
        ) : (
          <Button size="sm" aria-label={`Delete ${session.subject}, ${formatMinutes(session.minutes)}`} onClick={() => setConfirming(true)}>
            Delete
          </Button>
        ))}
    </li>
  );
}
