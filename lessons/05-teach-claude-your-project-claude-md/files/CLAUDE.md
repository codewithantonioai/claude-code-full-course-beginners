# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when
working with code in this repository.

## Project

A habit tracker in plain HTML, CSS and JavaScript. There are no
frameworks, no dependencies and no build step. Keep it that way.

## Commands

- Run: \`python3 -m http.server\`, then open \`http://localhost:8000\`.
  Serving is required because browsers block ES modules over
  \`file://\`.
- Test: \`node --test\` (no test files exist yet). Run one file with
  \`node --test streak.test.js\`.
- There is no lint or build step.

## Architecture

- \`streak.js\` is a pure ES module with no DOM or localStorage
  access. It holds all streak logic (\`toDateKey\`, \`currentStreak\`).
  Node imports it directly because \`package.json\` sets \`"type":
  "module"\`. Keep it free of browser APIs so \`node --test\` can load
  it.
- \`app.js\` is the only file that touches the DOM and localStorage.
  It keeps \`habits\` in memory as \`[{ id, name, completedDates:
  ['YYYY-MM-DD', ...] }]\`, persists the whole array as JSON under
  the key \`habits.v1\`, and re-renders the entire list after every
  change. Any change to the stored shape should bump that key or
  migrate old data.
- \`index.html\` loads \`app.js\` as a module, and \`style.css\` provides
  the dark theme through CSS variables in \`:root\`.

## Conventions that matter

- Dates are local calendar days stored as \`YYYY-MM-DD\` strings. Use
  \`toDateKey\`, not \`toISOString\`, which uses UTC and gives the wrong
  day near midnight.
- \`currentStreak(completedDates, today)\` takes \`today\` as a key
  string, so tests never depend on the clock. If today isn't done
  yet, the streak still counts back from yesterday.
- Day stepping uses \`setDate(getDate() - 1)\`, not 24-hour
  subtraction, so DST changes don't break it.
- Habit names are rendered with \`textContent\`, never \`innerHTML\`.

## Rules

- Every change to \`streak.js\` needs a test in \`streak.test.js\`. Run
  \`node --test\` and show the output before you say you're done.
