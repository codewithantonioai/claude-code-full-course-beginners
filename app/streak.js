export function toDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function parseKey(key) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function previousKey(key) {
  const date = parseKey(key);
  date.setDate(date.getDate() - 1);
  return toDateKey(date);
}

// The last `count` day keys ending at `today`, oldest first.
export function lastDays(today, count) {
  const days = [];
  let day = today;
  for (let i = 0; i < count; i++) {
    days.push(day);
    day = previousKey(day);
  }
  return days.reverse();
}

// `today` is a 'YYYY-MM-DD' key. If today isn't done yet, the streak
// still counts back from yesterday.
export function currentStreak(completedDates, today) {
  const done = new Set(completedDates);
  let day = done.has(today) ? today : previousKey(today);
  let count = 0;
  while (done.has(day)) {
    count++;
    day = previousKey(day);
  }
  return count;
}
