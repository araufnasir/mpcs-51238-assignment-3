import type { ComponentProps } from "react";

export default function Card({ className = "", ...props }: ComponentProps<"section">) {
  return <section className={`border border-ln-text bg-ln-surface p-5 ${className}`} {...props} />;
}
