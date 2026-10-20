"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useSessions } from "@/lib/useSessions";
import { EMPTY_VALUES, validateField, validateSession } from "@/lib/validation";
import type { FieldName, FormErrors, FormValues } from "@/lib/validation";
import Button from "./Button";
import Field from "./Field";
import { Toast, useToast } from "./Toast";
import { focusRing, type } from "./type";

const QUICK_MINUTES = [15, 25, 45, 60];

type Props = {
  /** Subject, minutes and chips only. The full form also has notes. */
  compact?: boolean;
  autoFocus?: boolean;
};

/** The one form for logging a session, used on / (compact) and /log (full). */
export default function SessionForm({ compact = false, autoFocus = false }: Props) {
  const { add } = useSessions();
  const { message, show } = useToast();
  const [values, setValues] = useState<FormValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");

  // Before the first submit, fields stay quiet. After a failed submit, they re-check as you type.
  function update(name: FieldName, value: string) {
    setValues((v) => ({ ...v, [name]: value }));
    if (submitted) setErrors((e) => ({ ...e, [name]: validateField(name, value) }));
  }

  function onChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    update(e.target.name as FieldName, e.target.value);
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError("");

    const result = validateSession(compact ? { ...values, notes: "" } : values);
    if (!result.ok) {
      setSubmitted(true);
      setErrors(result.errors);
      const first = (["subject", "minutes", "notes"] as const).find((n) => result.errors[n]);
      const field = first && e.currentTarget.elements.namedItem(first);
      if (field instanceof HTMLElement) field.focus();
      return;
    }

    if (!add(result.value).ok) {
      setFormError("Couldn't save. Your browser may be blocking storage.");
      return;
    }

    show(`Logged ${result.value.minutes} min of ${result.value.subject}`);
    setValues((v) => ({ ...v, minutes: "", notes: "" }));
    setErrors({});
    setSubmitted(false);
  }

  return (
    <>
      <form onSubmit={onSubmit} noValidate className="space-y-4 sm:space-y-6">
        <Field
          label="Subject"
          name="subject"
          placeholder="e.g. Math"
          autoComplete="off"
          autoFocus={autoFocus}
          value={values.subject}
          onChange={onChange}
          error={errors.subject}
        />

        <div>
          <Field
            label="Minutes"
            name="minutes"
            inputMode="numeric"
            placeholder="e.g. 45"
            autoComplete="off"
            value={values.minutes}
            onChange={onChange}
            error={errors.minutes}
          />
          <div role="group" aria-label="Quick minutes" className="mt-2 flex flex-wrap gap-1.5 sm:mt-3 sm:gap-2">
            {QUICK_MINUTES.map((m) => {
              const selected = values.minutes.trim() === String(m);
              return (
                <button
                  key={m}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => update("minutes", String(m))}
                  className={`${type.labelSmall} min-h-11 min-w-11 border border-ln-text px-2.5 py-1.5 transition-colors duration-100 ${focusRing} ${
                    selected ? "bg-ln-text text-ln-background" : "hover:bg-ln-text hover:text-ln-background"
                  }`}
                >
                  {m} min
                </button>
              );
            })}
          </div>
        </div>

        {!compact && (
          <Field
            label="Notes (optional)"
            name="notes"
            multiline
            placeholder="What did you cover?"
            value={values.notes}
            onChange={onChange}
            error={errors.notes}
          />
        )}

        {formError && (
          <p role="alert" className={`${type.bodySmall} border border-double border-ln-accent px-3 py-2 text-ln-accent`}>
            {formError}
          </p>
        )}

        <Button type="submit" variant="primary">
          Log session
        </Button>
      </form>
      <Toast message={message} />
    </>
  );
}
