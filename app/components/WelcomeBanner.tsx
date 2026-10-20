import { formatMinutes, plural } from "@/lib/format";
import { formatDayLabel } from "@/lib/streak";
import type { Session, Streak } from "@/lib/streak";
import Card from "./Card";
import { type } from "./type";

type Props = { streak: Streak; last?: Session; today: string };

function message({ state, count }: Streak): { heading: string; body: string } {
  switch (state) {
    case "new":
      return { heading: "Start your streak today.", body: "Log your first session below." };
    case "active":
      return { heading: `${plural(count, "day")} streak.`, body: "You're done for today." };
    case "at-risk":
      return {
        heading: "Welcome back!",
        body: `${plural(count, "day")} streak. Log a session today to keep it.`,
      };
    case "broken":
      return {
        heading: "Welcome back!",
        body: `Your last streak was ${plural(count, "day")}. Start a new one today.`,
      };
  }
}

export default function WelcomeBanner({ streak, last, today }: Props) {
  const { heading, body } = message(streak);
  const day = last ? formatDayLabel(last.date, today) : "";
  const when = day === "Today" || day === "Yesterday" ? day.toLowerCase() : `on ${day}`;

  return (
    <Card aria-label="Welcome" data-streak-state={streak.state}>
      <h2 className={type.heading}>{heading}</h2>
      <p className={`${type.body} mt-2`}>{body}</p>
      {last && (
        <p className={`${type.bodySmall} mt-3 text-ln-muted`}>
          Last time: {formatMinutes(last.minutes)} of {last.subject}, {when}.
        </p>
      )}
    </Card>
  );
}
