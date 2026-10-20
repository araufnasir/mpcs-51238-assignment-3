import type { ComponentProps } from "react";

type Props = ComponentProps<"section"> & {
  /** Tighter padding on phones, for the banner and stat cards. */
  compact?: boolean;
};

export default function Card({ compact = false, className = "", ...props }: Props) {
  const padding = compact ? "p-3 sm:p-5" : "p-4 sm:p-5";
  return <section className={`border border-ln-text bg-ln-surface ${padding} ${className}`} {...props} />;
}
