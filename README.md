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

## First-run check

I used the live app at <https://mpcs-51238-assignment-3-green.vercel.app> as a brand-new user with the goal **"Log three study sessions this week."**

**How this was done, and its limits.** An automated agent drove Chrome (Playwright) in a fresh profile with no stored data, at a desktop size (1280×800) and a phone size (390×844), and I read screenshots at each step. "The next day" was simulated by faking the browser clock 1, 2 and 6 days ahead against the data from day one. This is not a person with fresh eyes, a real phone, or a screen reader, so treat it as a careful walkthrough, not user testing. Nothing was fixed during the check itself; the fixes that followed are listed under [What I changed](#what-i-changed).

### What happened

| Step | Result |
|---|---|
| First load | 200 in about 0.4 s. The banner reads "Start your streak today", the stats show 0 min and 0 days, and the Subject field is already focused. |
| Impatient first click (empty submit) | Errors appeared under both fields ("Enter a subject.", "Enter how many minutes you studied."), and focus moved to Subject. |
| Session 1 (Math, 45 min chip, on Today) | 3 actions. Banner became "1-day streak. You're done for today." This week showed 45 min and a toast confirmed it. |
| Session 2 (Reading, 25 min, with notes, on Log) | Stayed on `/log` with a toast. Minutes and notes cleared, subject kept. |
| Session 3 (Coding, 60 min chip, on Today) | This week showed 2 h 10 min. |
| History | All three sessions were listed under "Today" with the notes and a Delete button on each. |
| Next day | Banner: "Welcome back! 1-day streak. Log a session today to keep it." The streak card said "Log today to keep it". Logging again made it a 2-day streak. |
| Two days later | "Your last streak was 1 day. Start a new one today." The streak card showed 0 days. |
| Next Monday | This week reset to 0 min, as expected. |

**Verdict:** the main task works, and history and the streak survive a reload and a day change. All three sessions were logged without any real stumbling block. Every problem below is about clarity and phone layout, not correctness. I found no bugs in the streak states.

### Where I got confused

1. **Nothing counts sessions.** My goal was three sessions, but the app only shows minutes ("2 h 10 min"). I had to count rows in Recent or History to know I was done. This was the biggest mismatch with the goal.
2. **Two places to log.** Today has a form and so does Log. The only difference is a Notes field, and nothing says so. On Today there is no hint that notes exist, so a new user can't tell why the nav has both.
3. **The banner and the streak card say the same thing.** On every return visit "1-day streak" appears in the banner and again in the Streak card. "Last time: …" also repeats the top row of Recent. That is three places for one fact.
4. **"Weeks start on Monday" under the weekly total** reads as filler. It answers a question a new user hasn't asked, in the spot where a count or a hint would be more useful.
5. **Retyping the subject.** Subject is kept only if you log the same subject again. Three different subjects meant three fresh entries with no suggestions.
6. **Nothing says data stays in this browser.** A new user is never told that clearing site data, switching browsers or devices, or using a private window loses the history. This matters most for something built around a streak.

### What was slow

- **Speed is fine.** The first load took about 0.4 s, and route changes felt immediate.
- **On a phone, the first useful action is slow to reach.** The banner and two stacked full-width stat cards come before the form. At 390×844, the Subject field is at 684 px, and the **Log session button is at 920 px**, off the first screen. The banner says "Log your first session below", but "below" is off-screen. This undercuts the "useful right away" goal on first visit.
- Three sessions took about three actions each (type the subject, tap a chip, press Log). Any session on Log needs a trip through the nav and back.

### Smaller things I noticed

- **The toast covers content on a phone.** It sits at the bottom of the screen and hid the "Today" group heading and part of the first Recent row for about 4 seconds.
- **The focus box overlaps the "SUBJECT" label.** On first load the auto-focused field's outline clips the top of the label, which looks like a glitch.
- **The Log button jumps down when errors appear.** It shifts by the height of the messages, so the cursor or finger lands off it.
- **Touch targets are small.** Measured sizes: quick-minute chips 72×30 px, nav links 28 px tall, Delete 85×32 px. These meet the WCAG 2.2 minimum of 24 px but not the common 44 px guideline.
- **The 60 min chip wraps** to a second row on a phone, leaving a lone chip.
- **Today's Recent list shows only three sessions.** "All history" appears only once there are more than three.

### What was missing

- A **sessions-this-week count** (and optionally a goal like "3 of 3").
- **Subject suggestions** from recent subjects.
- A one-line note about where data is stored.
- Editing a session (out of scope on purpose; delete is the only fix for a typo).
- Any way to export or clear all data.

### Suggested priorities

1. ~~Show a sessions-this-week count, replacing the "Weeks start on Monday" note.~~ Done (`1e897cb`).
2. ~~On phones, put the quick log first or shrink the stat cards, so the form and button fit on the first screen.~~ Done (`b9d594f`, `bd47a99`).
3. ~~Add the "stored in this browser" note.~~ Done (`1fc098a`).
4. Merge or trim the repeated streak and last-session text, and explain how Log differs from Today. Partly done: "Last time" is gone and `/log` is explained (`6a9b318`), but the banner and the Streak card still overlap.
5. ~~Subject suggestions, toast position on phones, and touch target sizes.~~ Done (`5eeb861`, `02fb941`, `50f00a2`).

### What I changed

Fixes that followed from the checks, one commit each. The first four came from the first pass:

1. **Session count on the weekly card** (`1e897cb`). The "This week" card shows minutes with the number of sessions since Monday under it, and the "Weeks start on Monday" line is gone. The count sits under the minutes, not on one line like "3 sessions · 2 h 10 min", so it fits on phones.
2. **Phone first-screen fit** (`b9d594f`). Below the `sm` breakpoint the stat cards sit side by side with smaller numerals and tighter spacing. At 390×844 the Log session button ends at 736 to 821 px in the new, active, at-risk and broken states, so it no longer needs scrolling.
3. **"Saved in this browser only." note** (`1fc098a`). One line under the quick log form on `/`.
4. **Repeated text removed, `/log` explained** (`6a9b318`). The banner no longer shows "Last time: …", which Recent already covers, and `/log` has a one-line note that it is the same form as Today, plus notes.

Then the items first left for later, and two features:

5. **44 px tap targets** (`50f00a2`). Chips, nav links and Delete/Yes/No.
6. **Focus outline** (`6a3210c`). It no longer clips field labels.
7. **Small phones** (`bd47a99`). The quick log fits at 375×667 and 360×740 as well as 390×844.
8. **Toast position** (`02fb941`). The message sits in the flow next to the Log button, so it never covers content.
9. **Subject suggestions** (`5eeb861`). The last four distinct subjects appear as chips under Subject, after the first session.
10. **Encouragement messages** (`0c8e7f9`). A first-session message, and milestones at 3, 7, 14 and 30 days in the toast and banner.

And two from the second pass:

11. **First-session toast reworded** (`3342399`). "Come back tomorrow to keep your streak going.", so it no longer contradicts the banner.
12. **Session count on History** (`d423145`). "This week: 2 h 10 min · 3 sessions", matching Today.

Text I touched was rechecked for contrast after each round: 0 failures, lowest ratio 5.01:1.

**Left for later:**

- The banner and the Streak card still repeat each other.
- The milestone message shows in both the toast and the banner.
- The Monday week and the streak can disagree (3-day streak, 2 sessions this week).
- Chip casing follows the latest entry, and long subject names make wide chips and long toasts.
- No "3 of 3" goal state.
- No editing a session, and no export or clear-all.

### Second pass

Same live app, same goal (**"Log three study sessions this week"**), new browser profile for each size, at 390×844 and 1280×800. I went through the first visit and the main task, then simulated later days by editing the `date` on the saved sessions in localStorage and reloading. I also tried a returning user with six different subjects, a 3-day streak milestone, and the first-session message. Nothing was fixed during this pass.

**Limits.** This is automated: Playwright driving desktop Chrome, with me reading screenshots and page text. There was no real phone (the 390×844 run is an emulated viewport with touch, so real thumb reach, the on-screen keyboard and mobile Safari are untested), no screen reader (I only checked that the live regions exist and what text they hold), and no real person with fresh eyes. Dates were changed by editing storage, not by waiting days. The first-load times (about 1.0 to 1.1 s here, 0.4 s before) are one run each on a different network, so they are not a comparison.

**What I did.** Math 45 min and then Reading 25 min with notes, then Coding 60 min. After that I shifted the dates back by one day at a time, logged Chemistry and then Writing, and finally shifted three days to break the streak.

| Step | Result |
|---|---|
| First load | 200. "Start your streak today", Subject focused, Log session button ends at 562 px of 844 (it was at 920 in the first pass). "Saved in this browser only." is visible. |
| Empty submit | Both errors appear under their fields and focus moves to Subject. Same as before. |
| Session 1 (Math, 45) | Toast: "First session logged. Come back tomorrow to start a streak." The banner shows "1-day streak. You're done for today." |
| Reload | The first-session message does not come back. A Math chip now sits under Subject. |
| Session 2 (on `/log`) | Stays on `/log`, toast reads "Logged 25 min of Reading." and the subject chips show Reading and Math. |
| Session 3 (on Today) | This week reads "2 h 10 min, 3 sessions". Tapping a chip fills Subject. |
| Next day | "Welcome back! 1-day streak. Log a session today to keep it." Chips: Coding, Reading, Math. |
| Day 2 and day 3 | Day 3 toast: "Three days in a row. A habit is forming! Logged 25 min of Writing." The banner shows the same milestone sentence. The chips are the last four distinct subjects: Writing, Chemistry, Coding, Reading. |
| Three days later | "Your last streak was 3 days. Start a new one today." There is no milestone message and the week shows 0 min, 0 sessions. |
| Console | No errors in either size. |

**Verdict:** the main task works at both sizes, and the app now answers most of what confused me the first time. I found no bugs, and nothing from the new features broke the layout or the earlier fixes.

**What improved since the first pass**

1. **The goal is countable.** "This week" shows "3 sessions" under the minutes, so I no longer count rows in Recent.
2. **The phone first screen works.** The Log session button ends at 562 to 634 px of 844 across the first visit, after logging and the milestone day. The milestone toast and banner fit on screen without covering anything.
3. **The toast no longer covers the list.** It sits beside or under the Log button, and long messages wrap in place.
4. **Subject suggestions.** After the first session, the last four distinct subjects appear as chips, newest first. Three different subjects took one tap each instead of retyping. Nothing appears on the first visit, as intended.
5. **The storage note is there**, and "Last time" and "Weeks start on Monday" are gone. `/log` says it is the same form plus notes.
6. **The first-session message** tells a new user what to do next, and it appears once.
7. **The focus outline no longer clips the SUBJECT label**, and the first screen no longer needs scrolling.

**Still confusing or rough**

1. **The first-session toast contradicts the banner.** After session 1 the banner says "1-day streak. You're done for today." while the toast beside the button says "Come back tomorrow to start a streak." Both are on screen together, and a new user could wonder whether the streak has started. This is the one thing a new feature introduced.
2. **The milestone is said twice.** On day 3 the same sentence appears in the toast and in the banner. It is nice, but it repeats the same fact in two places again, which was complaint 3 in the first pass.
3. **The banner and the Streak card still overlap.** On every return visit, "1-day streak" and "Done for today" appear in both, as before.
4. **The weekly count and the streak disagree across Monday.** Today was a Tuesday, so shifting sessions back two days put them in the previous week. On day 3 the banner says "3-day streak" while This week shows 2 sessions. That is correct by the Monday rule, but it can look wrong, and nothing explains it.
5. **History shows minutes but not a count.** Its "This week" line reads "2 h 10 min" while Today shows "3 sessions" for the same week.
6. **Chip spelling follows the latest entry.** A "math" typed in lower case replaces "Math" in the chips, because the latest spelling wins. That is by design, but it can look like a duplicate or a loss of the earlier spelling.
7. **Long subjects.** A 50-character subject makes a chip about 160 px wide, and the toast repeats the whole text ("Logged 25 min of Organic chemistry reaction mechanisms and synthesi."). It works, but it is clumsy.
8. **There is still no goal or "done" state** for "three sessions". The count helps, but nothing says "3 of 3". This was left out on purpose.
9. **Unchanged from before:** no editing a session, no export or clear, and Recent shows only three sessions.

**Did the new features break anything?** Not that I could find. On the first screen the subject chips and the longer messages move the Log button down by 50 to 72 px, but it still ends well inside 844 px. On desktop it ends at 780 to 782 px of 800, so there is very little spare room there. My own script briefly saw duplicate chips on `/log`. That was the previous page staying hidden in the page after a client-side route change, not something a user sees. I confirmed that only one form and one set of chips is visible.

**What the second pass cannot say.** Whether the encouragement messages feel right or are noise, whether the chips are found without being told, and whether the phone layout holds on real devices. Those need real people and real phones.

## Deploy

Deploy on [Vercel](https://vercel.com/new). No environment variables are needed.
