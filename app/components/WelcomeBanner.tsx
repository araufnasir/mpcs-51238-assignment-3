import { plural } from "@/lib/format";
import type { Streak } from "@/lib/streak";
import Card from "./Card";
import { type } from "./type";

type Props = { streak: Streak };

function message({ state, count }: Streak): { heading: string; body: string } {
  switch (state) {
    case "new":
      return { heading: "Start your streak today.", body: "Log your first session below." };
    case "active":
      return { heading: `${count}-day streak.`, body: "You're done for today." };
    case "at-risk":
      return {
        heading: "Welcome back!",
        body: `${count}-day streak. Log a session today to keep it.`,
      };
    case "broken":
      return {
        heading: "Welcome back!",
        body: `Your last streak was ${plural(count, "day")}. Start a new one today.`,
      };
  }
}

export default function WelcomeBanner({ streak }: Props) {
  const { heading, body } = message(streak);

  return (
    <Card aria-label="Welcome" data-streak-state={streak.state}>
      {/* Stays mounted, so logging a session announces the new streak message. */}
      <div role="status">
        <h2 className={type.heading}>{heading}</h2>
        <p className={`${type.body} mt-2`}>{body}</p>
      </div>
    </Card>
  );
}
