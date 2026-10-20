const smallCaps = "[font-variant-caps:all-small-caps] tracking-[0.08em]";

/** Type roles from the Liner Notes system, all in one typeface. Weight and size do the work. */
export const type = {
  title: "text-4xl font-light leading-tight tracking-tight",
  heading: "text-2xl font-normal leading-tight",
  body: "text-lg leading-[1.65]",
  bodySmall: "text-base leading-snug",
  label: `${smallCaps} text-lg leading-none`,
  labelSmall: `${smallCaps} text-base leading-none`,
};

/** Large, light numbers for stats. */
export const numeral = "text-5xl font-extralight leading-none tabular-nums";

export const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-ln-text";
