import type { ComponentProps } from "react";
import { focusRing, type } from "./type";

type Props = Omit<ComponentProps<"button">, "type"> & {
  /** Marks the chip as the current choice. Exposed as aria-pressed. */
  selected: boolean;
};

/** A small toggle button, at least 44 px square. Used for quick minutes and recent subjects. */
export default function Chip({ selected, className = "", ...props }: Props) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={`${type.labelSmall} min-h-11 min-w-11 border border-ln-text px-2.5 py-1.5 transition-colors duration-100 ${focusRing} ${
        selected ? "bg-ln-text text-ln-background" : "hover:bg-ln-text hover:text-ln-background"
      } ${className}`}
      {...props}
    />
  );
}
