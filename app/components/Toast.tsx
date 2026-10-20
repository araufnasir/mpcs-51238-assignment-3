"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { type } from "./type";

/** The region stays mounted so screen readers announce each new message. */
export function Toast({ message }: { message: string }) {
  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 flex justify-center px-5">
      {message && <p className={`${type.bodySmall} bg-ln-text px-4 py-3 text-ln-background`}>{message}</p>}
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
