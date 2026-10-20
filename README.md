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

## Deploy

Deploy on [Vercel](https://vercel.com/new). No environment variables are needed.
