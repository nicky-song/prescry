// Copyright 2022 Prescryptive Health, Inc.

export function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
