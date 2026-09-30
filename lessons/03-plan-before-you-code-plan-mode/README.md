# Lesson 3 · Plan before you code: plan mode

▶ [Watch this lesson](https://youtu.be/hRQTNbuSjHs?t=366) (starts at 6:06)

## Goal

Lesson three. Before Claude writes a single line, we make it plan.

## Commands and files (as shown in the video)

### `build-a-habit-tracker-hashed-corbato.md` · plan file

```
# Habit Tracker: Plan

## Context
The repo is empty. Build a small habit tracker in plain HTML, CSS
and JS, with no frameworks and no build step. The user can add a
habit, mark it done for today, and see the current streak (days in a
row). Data lives in localStorage. Streak logic sits in its own pure
module so it can be tested later with \`node --test\`.

## Files (all in repo root)
- \`index.html\`: page shell with an add-habit form and an empty \`<ul
  id="habits">\`. Loads \`app.js\` via \`<script type="module">\`.
- \`style.css\`: minimal responsive styling, with a distinct look for
  the "done today" state.
- \`streak.js\`: pure ES module with no DOM or localStorage access.
  Exports:
  - \`toDateKey(date)\` returns the local-time \`YYYY-MM-DD\` string. It
    avoids \`toISOString\`, which uses UTC and gives wrong days near
    midnight.
  - \`currentStreak(completedDates, today)\` returns the count of
    consecutive days ending at \`today\`. If today isn't done yet but
    yesterday is, the streak still counts through yesterday, so it
    doesn't show 0 until the day ends. It returns 0 otherwise.
  - Both take \`today\` as a parameter, so tests don't depend on the
    clock.
- \`app.js\`: UI and persistence.
  - State is \`[{ id, name, completedDates: ['YYYY-MM-DD', ...] }]\`,
    stored under one localStorage key (\`habits.v1\`).
  - \`load()\` and \`save()\` wrap \`JSON.parse\` in try/catch and fall
    back to \`[]\` on corrupt data.
  - \`render()\` rebuilds the list. Each row shows the name, the
    streak (\`currentStreak\`), a "Done today" toggle, and a delete
    button.
  - Handlers: add (trim the name, ignore empty), toggle today (add
    or remove today's key, no duplicates), delete.
  - Use \`textContent\`, not \`innerHTML\`, for habit names to avoid
    injection.
- \`package.json\`: \`{ "type": "module" }\` so Node treats \`streak.js\`
  as ESM for \`node --test\`. It has no dependencies and no build.

## Notes and decisions
- Dates are local calendar days, stored as strings. Streak
  calculation walks backwards one day at a time using local \`Date\`
  arithmetic. It uses \`setDate(getDate() - 1)\`, not 24h subtraction,
  so DST changes don't break it.
- ES modules don't load over \`file://\` in most browsers, so serve
  the folder with \`python3 -m http.server\` and open
  \`localhost:8000\`. This isn't a build step.
- Tests are out of scope now. The module design (pure functions with
  injected \`today\`) is what makes \`node --test\` easy later.

## Verification
1. \`python3 -m http.server\`, then open the page. Add a habit and
confirm it appears and survives a reload.
2. Click "Done today": the streak becomes 1 and the state persists
on reload. Click again to undo.
3. Quick logic check in Node, with no test files added:
   \`node -e "import('./streak.js').then(m=>console.log(m.currentStre
   ak(['2026-09-28','2026-09-29','2026-09-30'],'2026-09-30')))"\`
   should print 3. A gap or a stale last date should print 0.
4. Edge cases: empty name is rejected, corrupt localStorage doesn't
crash the page, and a habit with a done-yesterday-only history still
shows its streak.
```

## Recap

So: a good prompt gives a goal, constraints, and a way to check. Shift tab takes you to plan mode, where Claude plans without touching your code. And you read the plan before you approve it. Next, we watch it build the app.
