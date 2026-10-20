"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { type } from "./type";

/**
 * An in-flow message, so it never covers content. The caller places it where the user is
 * already looking. The region stays mounted so screen readers announce each new message.
 */
export function Toast({ message, className = "" }: { message: string; className?: string }) {
  return (
    <div role="status" aria-live="polite" className={className}>
      {message && <p className={`${type.bodySmall} line-clamp-2 border-l-2 border-ln-text pl-3`}>{message}</p>}
    </div>
  );
}

export function useToast(duration = 4000) {
  const [message, setMessage] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const show = useCallback(
    (next: string) => {
      clearTimeout(timer.current);
      setMessage(next);
      timer.current = setTimeout(() => setMessage(""), duration);
    },
    [duration],
  );

  return { message, show };
}
