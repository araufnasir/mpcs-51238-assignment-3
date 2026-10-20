import type { InputHTMLAttributes } from "react";
import { useId } from "react";
import { focusRing, type } from "./type";

type Props = InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> & {
  label: string;
  error?: string;
  hint?: string;
  multiline?: boolean;
  rows?: number;
};

/** A ruled line, like a form on paper. A double heavy rule marks an invalid field. */
// mt-2 leaves room for the 3px offset and 2px width of the focus ring above the control.
const control = `mt-2 w-full rounded-none border-0 border-b border-ln-text bg-transparent px-1 py-2 text-lg text-ln-text placeholder:italic placeholder:text-ln-muted
  hover:bg-ln-surface focus:bg-ln-surface ${focusRing} aria-invalid:border-b-[3px] aria-invalid:border-double aria-invalid:border-ln-accent`;

export default function Field({ label, error, hint, multiline, rows = 3, className = "", ...props }: Props) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(" ") || undefined;
  const shared = {
    id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
    className: `${control} ${className}`,
  };

  return (
    <div>
      <label htmlFor={id} className={`${type.label} block`}>
        {label}
      </label>
      {hint && (
        <p id={hintId} className={`${type.bodySmall} mt-1 text-ln-muted`}>
          {hint}
        </p>
      )}
      {multiline ? <textarea rows={rows} {...shared} {...props} /> : <input {...shared} {...props} />}
      {error && (
        <p id={errorId} className={`${type.bodySmall} mt-2 text-ln-accent`}>
          {error}
        </p>
      )}
    </div>
  );
}
