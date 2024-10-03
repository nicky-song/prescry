// Copyright 2020 Prescryptive Health, Inc.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const polyfill = (window: any) => {
  window.__DEV__ = process.env.NODE_ENV === 'development';
};
