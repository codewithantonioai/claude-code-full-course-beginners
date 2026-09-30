# Lesson 4 · Build the app and run it

▶ [Watch this lesson](https://youtu.be/hRQTNbuSjHs?t=559) (starts at 9:19)

## Goal

Lesson four. Claude builds the app from its plan, and we run it in a real browser.

## Commands and files (as shown in the video)

### `streak.js` · code streak

```js
export function toDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return \`\${y}-\${m}-\${d}\
```

### Terminal · term server

```bash
```

## Recap

So: auto mode lets Claude work without asking, with a classifier watching for risky actions. It checks the parts it can run. And it tells you what it didn't check, so you know what to look at. Next, we teach it about our project.
