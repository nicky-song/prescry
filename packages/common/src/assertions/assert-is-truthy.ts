// Copyright 2022 Prescryptive Health, Inc.

export function assertIsTruthy<T>(
  value: T,
  errorMessage = 'Value is falsy'
): asserts value is NonNullable<T> {
  if (!value) {
    throw new Error(errorMessage);
  }
}
