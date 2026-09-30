import { currentStreak, lastDays, toDateKey } from './streak.js';

const STORAGE_KEY = 'habits.v1';

const form = document.getElementById('add-form');
const input = document.getElementById('habit-name');
const list = document.getElementById('habits');
const error = document.getElementById('form-error');

function load() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  } catch {
    // storage unavailable or full; keep working in memory
  }
}

let habits = load();

function today() {
  return toDateKey(new Date());
}

function addHabit(name) {
  habits.push({ id: crypto.randomUUID(), name, completedDates: [] });
  save();
  render();
}

function toggleToday(id) {
  const habit = habits.find((h) => h.id === id);
  if (!habit) return;
  const key = today();
  const dates = new Set(habit.completedDates);
  if (dates.has(key)) dates.delete(key);
  else dates.add(key);
  habit.completedDates = [...dates];
  save();
  render();
}

function deleteHabit(id) {
  habits = habits.filter((h) => h.id !== id);
  save();
  render();
}

function render() {
  const key = today();
  list.replaceChildren();

  if (habits.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'empty';
    empty.textContent = 'No habits yet. Add one above.';
    list.append(empty);
    return;
  }

  for (const habit of habits) {
    const isDone = habit.completedDates.includes(key);
    const streak = currentStreak(habit.completedDates, key);

    const li = document.createElement('li');
    li.className = isDone ? 'habit done' : 'habit';

    const name = document.createElement('span');
    name.className = 'name';
    name.textContent = habit.name;

    const streakEl = document.createElement('span');
    streakEl.className = streak > 0 ? 'streak active' : 'streak';
    streakEl.textContent = `🔥 ${streak} day${streak === 1 ? '' : 's'}`;

    const toggle = document.createElement('button');
    toggle.className = 'toggle';
    toggle.type = 'button';
    toggle.textContent = isDone ? 'Done ✓' : 'Done today';
    toggle.addEventListener('click', () => toggleToday(habit.id));

    const del = document.createElement('button');
    del.className = 'delete';
    del.type = 'button';
    del.textContent = '✕';
    del.setAttribute('aria-label', `Delete ${habit.name}`);
    del.addEventListener('click', () => deleteHabit(habit.id));

    const dots = document.createElement('span');
    dots.className = 'dots';
    for (const day of lastDays(key, 7)) {
      const dot = document.createElement('span');
      const filled = habit.completedDates.includes(day);
      dot.className = filled ? 'dot filled' : 'dot';
      dot.title = day;
      dots.append(dot);
    }
    dots.setAttribute('role', 'img');
    dots.setAttribute(
      'aria-label',
      `${habit.completedDates.filter((d) => lastDays(key, 7).includes(d)).length} of the last 7 days done`,
    );

    li.append(name, streakEl, dots, toggle, del);
    list.append(li);
  }
}

// Case-insensitive, whitespace-insensitive key for duplicate detection.
function nameKey(name) {
  return name.trim().replace(/\s+/g, ' ').toLowerCase();
}

function showError(message) {
  error.textContent = message;
  error.hidden = !message;
}

input.addEventListener('input', () => showError(''));

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = input.value.trim();
  if (!name) return;
  if (habits.some((h) => nameKey(h.name) === nameKey(name))) {
    showError(`You already have a habit called "${name}".`);
    input.focus();
    return;
  }
  showError('');
  addHabit(name);
  input.value = '';
  input.focus();
});

render();
