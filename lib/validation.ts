// The single validation module, used by every form. Takes raw field strings and returns
// either per-field error messages or a cleaned value.

export const SUBJECT_MAX = 50;
export const MINUTES_MAX = 720;
export const NOTES_MAX = 280;

export type FormValues = { subject: string; minutes: string; notes: string };
export type FieldName = keyof FormValues;
export type FormErrors = Partial<Record<FieldName, string>>;
export type SessionInput = { subject: string; minutes: number; notes: string };

export const EMPTY_VALUES: FormValues = { subject: "", minutes: "", notes: "" };

export function validateField(name: FieldName, raw: string): string | undefined {
  const value = raw.trim();

  if (name === "subject") {
    if (!value) return "Enter a subject.";
    if (value.length > SUBJECT_MAX) return `Keep the subject under ${SUBJECT_MAX} characters.`;
  }

  if (name === "minutes") {
    if (!value) return "Enter how many minutes you studied.";
    if (!/^-?\d+$/.test(value)) return "Use a whole number, like 45.";
    const minutes = Number(value);
    if (minutes < 1) return "Must be at least 1 minute.";
    if (minutes > MINUTES_MAX) {
      return "That's over 12 hours. Check the number, or split it into sessions.";
    }
  }

  if (name === "notes" && value.length > NOTES_MAX) {
    return `Notes are limited to ${NOTES_MAX} characters.`;
  }

  return undefined;
}

export function validateSession(
  values: FormValues,
): { ok: true; value: SessionInput } | { ok: false; errors: FormErrors } {
  const errors: FormErrors = {};
  for (const name of ["subject", "minutes", "notes"] as const) {
    const message = validateField(name, values[name]);
    if (message) errors[name] = message;
  }
  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    value: {
      subject: values.subject.trim(),
      minutes: Number(values.minutes.trim()),
      notes: values.notes.trim(),
    },
  };
}
