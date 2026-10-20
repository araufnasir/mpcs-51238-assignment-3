"use client";

import { useSessions } from "@/lib/useSessions";
import { type } from "./type";

/** Shown only when the browser blocks localStorage, so the user knows history won't last. */
export default function StorageNotice() {
  const { ready, persisted } = useSessions();
  if (!ready || persisted) return null;

  return (
    <p role="status" className={`${type.bodySmall} border-b border-ln-text bg-ln-surface px-5 py-3 text-center`}>
      Your browser is blocking storage, so history won&apos;t be saved after you close this tab.
    </p>
  );
}
