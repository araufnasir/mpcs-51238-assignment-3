import type { ComponentProps } from "react";
import { focusRing, type } from "./type";

type Props = ComponentProps<"button"> & {
  variant?: "primary" | "secondary";
  size?: "md" | "sm";
};

const base = `${type.label} border transition-colors duration-100 enabled:active:translate-y-px ${focusRing}
  disabled:cursor-not-allowed disabled:border-dotted disabled:border-ln-muted disabled:bg-transparent disabled:text-ln-muted`;

const variants = {
  /** Oxblood is for the primary action only. */
  primary:
    "border-ln-accent bg-ln-accent text-ln-background enabled:hover:border-ln-accent-strong enabled:hover:bg-ln-accent-strong enabled:hover:underline enabled:hover:underline-offset-4",
  secondary:
    "border-ln-text bg-transparent text-ln-text enabled:hover:bg-ln-text enabled:hover:text-ln-background",
};

const sizes = { md: "px-5 py-2.5", sm: "px-3 py-1.5" };

export default function Button({
  variant = "secondary",
  size = "md",
  className = "",
  type: buttonType = "button",
  ...props
}: Props) {
  return (
    <button
      type={buttonType}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
}
