import { milestoneMessage } from "@/lib/encouragement";
import { plural } from "@/lib/format";
import type { Streak } from "@/lib/streak";
import Card from "./Card";

type Props = { streak: Streak };

function message({ state, count }: Streak): { heading: string; body: string } {
  switch (state) {
    case "new":
      return { heading: "Start your streak today.", body: "Log your first session below." };
    case "active": {
      const milestone = milestoneMessage({ state, count });
      return {
        heading: `${count}-day streak.`,
        body: milestone ? `${milestone} You're done for today.` : "You're done for today.",
      };
    }
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
    <Card compact aria-label="Welcome" data-streak-state={streak.state}>
      {/* Stays mounted, so logging a session announces the new streak message. */}
      <div role="status">
        <h2 className="text-xl font-normal leading-tight sm:text-2xl">{heading}</h2>
        <p className="mt-1 text-base leading-snug sm:mt-2 sm:text-lg sm:leading-[1.65]">{body}</p>
      </div>
    </Card>
  );
}
