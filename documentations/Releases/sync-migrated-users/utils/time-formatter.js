// Copyright 2022 Prescryptive Health, Inc.

export const now = () => new Date().getTime();

export function formatDuration(duration) {
  const portions = [];

  const msInHour = 1000 * 60 * 60;
  const hours = Math.trunc(duration / msInHour);
  if (hours > 0) {
    portions.push(hours + 'h');
    duration = duration - hours * msInHour;
  }

  const msInMinute = 1000 * 60;
  const minutes = Math.trunc(duration / msInMinute);
  if (minutes > 0) {
    portions.push(minutes + 'm');
    duration = duration - minutes * msInMinute;
  }

  const msInSecond = 1000;
  const seconds = Math.trunc(duration / msInSecond);
  if (seconds > 0) {
    portions.push(seconds + 's');
    duration = duration - seconds * msInSecond;
  }

  const ms = Math.trunc(duration);
  if (ms > 0) {
    portions.push(ms + 'ms');
  }

  return portions.join(' ');
}
