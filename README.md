# Study Session Log

Log study sessions (subject, minutes, optional notes), see them in a list with this week's total, and come back later to find your streak and history still there. Built with Next.js (App Router) and Tailwind, deployed on Vercel. There is no sign-in, database, or API. All data lives in the browser's localStorage.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scope

- Week starts Monday, in the device's local time.
- Sessions are always logged for today (no date field).
- Delete only, with an inline Yes/No confirm. There is no edit.
- Quick-minute chips (15 / 25 / 45 / 60). No weekly goal.

The same diagrams are in [flows.md](flows.md).

## Flow 1: First visit

```mermaid
flowchart TD
    A([Open app]) --> B["Render skeleton<br/>server and client HTML match"]
    B --> C{"localStorage<br/>available?"}
    C -- No --> D["Use in-memory state<br/>show banner: history won't be saved"]
    C -- Yes --> E{"Stored data<br/>valid?"}
    E -- "Missing" --> F
    E -- "Corrupt or unknown version" --> G["Fall back to empty list<br/>do not overwrite bad data yet"]
    G --> F
    D --> F
    F["First-run layout"] --> H["Form is the hero<br/>subject focused, chips 15 / 25 / 45 / 60"]
    F --> I["Stats strip<br/>This week: 0 min<br/>Streak: Start today"]
    F --> J["List area: Your sessions will show up here"]
    H --> K([User fills the form])
    K --> L[["Flow 2: Log a session"]]
```

## Flow 2: Logging a session

```mermaid
flowchart TD
    A([User edits form]) --> B{"Chip<br/>tapped?"}
    B -- Yes --> C["Fill minutes with chip value"]
    B -- No --> D
    C --> D([Submit: button or Enter])
    D --> E{"Already<br/>submitting?"}
    E -- Yes --> Z1([Ignore double submit])
    E -- No --> V["Validate all fields"]

    V --> S{"Subject"}
    S -- "Empty or whitespace" --> SE1["Enter a subject."]
    S -- "Over 50 chars" --> SE2["Keep the subject under 50 characters."]
    S -- "Valid after trim" --> M

    V --> M{"Minutes"}
    M -- "Empty" --> ME1["Enter how many minutes you studied."]
    M -- "Not a whole number" --> ME2["Use a whole number, like 45."]
    M -- "Below 1" --> ME3["Must be at least 1 minute."]
    M -- "Above 720" --> ME4["That's over 12 hours. Check the number, or split it into sessions."]
    M -- "Valid" --> N

    V --> N{"Notes"}
    N -- "Over 280 chars" --> NE1["Notes are limited to 280 characters."]
    N -- "Empty or valid" --> OK

    SE1 & SE2 & ME1 & ME2 & ME3 & ME4 & NE1 --> ERR["Show each error under its field<br/>aria-invalid and aria-describedby<br/>focus first invalid field<br/>re-validate on input from now on"]
    ERR --> A

    OK{"Any errors?"} -- Yes --> ERR
    OK -- No --> W["Write sessions to localStorage"]
    W --> WF{"Write<br/>succeeded?"}
    WF -- No --> FE["Form-level error: Couldn't save.<br/>Your browser may be blocking storage.<br/>Entry stays in the form"]
    FE --> A
    WF -- Yes --> U["Add session to top of list<br/>recompute weekly total and streak"]
    U --> T["Toast: Logged 45 min of Math"]
    T --> R["Clear minutes and notes<br/>keep subject"]
    R --> Z2([Ready for next entry])
```

## Flow 3: Coming back

```mermaid
flowchart TD
    A([Open app on a later day]) --> B["Render skeleton"]
    B --> C["Load and validate localStorage"]
    C --> D["Compute today and this Monday<br/>from local date"]
    D --> E["Weekly total = sum of minutes<br/>for sessions since Monday"]
    D --> F{"Streak state"}

    F -- "No sessions" --> S1["NEW<br/>Start your streak today."]
    F -- "Logged today" --> S2["ACTIVE<br/>N-day streak. You're done for today."]
    F -- "Last session yesterday" --> S3["AT RISK<br/>Welcome back! N-day streak.<br/>Log a session today to keep it."]
    F -- "Last session 2 or more days ago" --> S4["BROKEN<br/>Welcome back! Your last streak was N days.<br/>Start a new one today."]

    S1 & S2 & S3 & S4 --> G["WelcomeBanner shows state message<br/>plus last session when one exists"]
    E --> H["StatCards: weekly total and streak"]
    G --> I["Session list<br/>newest first, grouped by day"]
    H --> I

    I --> J{"Sessions<br/>this week?"}
    J -- No --> K["Nothing logged this week yet."]
    J -- Yes --> L["Rows: subject, minutes, notes, date<br/>Today / Yesterday / formatted date"]

    L --> M([User taps Delete on a row])
    M --> N["Row shows inline: Delete? Yes / No"]
    N -- No --> L
    N -- Yes --> O["Remove session and save"]
    O --> P["Recompute weekly total and streak<br/>banner may change state"]
    P --> I
```

The streak counts consecutive local calendar days with at least one session, ending today if logged, otherwise ending yesterday. It breaks only when a full day passes with no session.

## Onboarding research

How three apps welcome a new user. Public sources were thin for all three, so each entry separates what was found from what is inference. I did not run the apps myself.

### Toggl Track

- **Found:** Signup is long, with roughly 8 to 10 screens before the app: email, password, name, how you heard about it, industry, signup reason, team members, workspace setup, and billing. After signup, a modal offers exploring alone or a guided tour. The tour uses skippable, resumable tooltips for tracking time and creating projects, then offers a second tour on Reports. The Timer page is the hub.
- **Not found:** the exact first screen, the empty state, and the time to the first entry.
- **Inference:** the first timer probably happens inside the tour, about 2 minutes in.
- Sources: [Appcues GoodUX teardown](https://goodux.appcues.com/blog/toggl-onboarding-tour), [Pageflows recording](https://pageflows.com/post/desktop-web/onboarding/toggl-track/), [Toggl help center](https://support.toggl.com/en-us/article/track-end-user-guide-pcn5n4/).

### Forest

- **Found:** The first screen is an empty patch of ground, a timer, and a tree picker. The first tree takes 3 taps: choose a tree, set the time (default 25 minutes), and tap Start. A new user has no trees and a few starter species, and coins from finished sessions unlock more. Signing in syncs across devices, but no source says an account is required.
- **Not found:** official onboarding docs, permission prompts, and the empty stats screen.
- **Unverified:** a single 2019 review reported a few explainer screens and an account prompt after the first session.
- Sources: [Theory7 guide](https://www.theory7.net/support/en-us/tips-tricks/forest-app-focus-by-planting-trees), [App Store listing](https://apps.apple.com/us/app/forest-focus-for-productivity/id866450515).

### Streaks

- **Found:** The first habit is one short setup: pick a preset or write your own, choose days, choose notifications, then tap Save Task. Notifications are chosen per task, and Health access is requested only for Health-linked tasks. Sync uses iCloud, and the App Store page mentions no sign-in. It is a one-time paid app.
- **Not found:** the first screen, the empty state, and how streaks look on day one. No fallback app was used because Loop Habit Tracker's sources were just as thin.
- **Inference:** the first habit takes under a minute.
- Sources: [App Store listing](https://apps.apple.com/us/app/streaks/id963034692), [The Sweet Setup](https://thesweetsetup.com/how-to-track-your-habits-using-streaks/), [Headway review](https://makeheadway.com/blog/streaks-app-review/).

### Recommendation for the first visit

1. **Start with the action, not a questionnaire.** Forest gets a first result in about 3 taps. Toggl asks 8 to 10 screens of questions first. This app has no account, so there is nothing to ask. The form is the first screen.
2. **Use defaults and one-tap shortcuts.** Forest defaults to 25 minutes. The minute chips (15 / 25 / 45 / 60) do the same job, so a first session takes a subject, one chip tap, and Log.
3. **Skip the tour.** Toggl's tour is skippable, but a one-field form doesn't need one. The "Start today" streak and "0 min this week" stats already say what the app does.
4. **Keep setup to the fields that matter.** Streaks asks for a title, days, and reminders. This app asks for a subject and minutes, and notes are optional.
5. **Ask for nothing else.** No sign-in, no notification or other permission prompts, and no goal setup.

## Deploy

Deploy on [Vercel](https://vercel.com/new). No environment variables are needed.
