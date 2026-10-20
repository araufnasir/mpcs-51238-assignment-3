"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { recentSubjects } from "@/lib/subjects";
import { useSessions } from "@/lib/useSessions";
import { EMPTY_VALUES, validateField, validateSession } from "@/lib/validation";
import type { FieldName, FormErrors, FormValues } from "@/lib/validation";
import Button from "./Button";
import Chip from "./Chip";
import Field from "./Field";
import { Toast, useToast } from "./Toast";
import { type } from "./type";

const QUICK_MINUTES = [15, 25, 45, 60];

type Props = {
  /** Subject, minutes and chips only. The full form also has notes. */
  compact?: boolean;
  autoFocus?: boolean;
};

/** The one form for logging a session, used on / (compact) and /log (full). */
export default function SessionForm({ compact = false, autoFocus = false }: Props) {
  const { ready, add, sessions } = useSessions();
  const subjects = recentSubjects(sessions);
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

  // Recent subjects come from localStorage, so wait for it. Otherwise the fields below the
  // Subject field would jump down once the chips appear (the Today page already waits).
  if (!ready) {
    return (
      <div role="status">
        <span className="sr-only">Loading the form</span>
        <div aria-hidden className="h-72 animate-pulse bg-ln-muted/20" />
      </div>
    );
  }

  return (
    <>
      <form onSubmit={onSubmit} noValidate className="space-y-4 sm:space-y-6">
        <div>
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
          {/* Nothing on a first visit. One scrolling row on phones keeps the form on the first screen. */}
          {subjects.length > 0 && (
            <div className="mt-2">
              <div
                role="group"
                aria-label="Recent subjects"
                className="-m-1.5 flex scroll-px-1.5 gap-1.5 overflow-x-auto p-1.5 sm:flex-wrap sm:overflow-visible"
              >
                {subjects.map((subject) => (
                  <Chip
                    key={subject}
                    selected={values.subject.trim().toLowerCase() === subject.toLowerCase()}
                    onClick={() => update("subject", subject)}
                    // Browsers leave a partly visible chip half hidden on focus, clipping its ring.
                    onFocus={(e) => e.currentTarget.scrollIntoView({ block: "nearest", inline: "nearest" })}
                    className="max-w-40 shrink-0 truncate"
                  >
                    {subject}
                  </Chip>
                ))}
              </div>
            </div>
          )}
        </div>

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
            {QUICK_MINUTES.map((m) => (
              <Chip
                key={m}
                selected={values.minutes.trim() === String(m)}
                onClick={() => update("minutes", String(m))}
              >
                {m} min
              </Chip>
            ))}
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

        <div className="flex min-h-11 items-center gap-3">
          <Button type="submit" variant="primary" className="shrink-0">
            Log session
          </Button>
          <Toast message={message} className="min-w-0 flex-1" />
        </div>
      </form>
    </>
  );
}
