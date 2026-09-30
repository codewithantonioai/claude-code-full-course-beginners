import { test } from 'node:test';
import assert from 'node:assert/strict';
import { currentStreak, lastDays } from './streak.js';

test('currentStreak counts three days in a row ending today', () => {
  const done = ['2026-09-28', '2026-09-29', '2026-09-30'];
  assert.equal(currentStreak(done, '2026-09-30'), 3);
});

test('currentStreak still counts back from yesterday when today is not done', () => {
  const done = ['2026-09-28', '2026-09-29'];
  assert.equal(currentStreak(done, '2026-09-30'), 2);
});

test('currentStreak resets to 0 after a one-day gap', () => {
  // Done 09-27 and 09-28, missed 09-29, and today (09-30) is not done.
  const done = ['2026-09-27', '2026-09-28'];
  assert.equal(currentStreak(done, '2026-09-30'), 0);
});

test('currentStreak stops at a gap in the middle of the history', () => {
  // 09-28 is missing, so only 09-29 and 09-30 count.
  const done = ['2026-09-26', '2026-09-27', '2026-09-29', '2026-09-30'];
  assert.equal(currentStreak(done, '2026-09-30'), 2);
});

test('currentStreak is 0 for an empty list', () => {
  assert.equal(currentStreak([], '2026-09-30'), 0);
});
