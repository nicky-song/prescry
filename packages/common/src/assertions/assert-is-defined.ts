// Copyright 2022 Prescryptive Health, Inc.

export function assertIsDefined<T>(
  value: T,
  errorMessage = 'Value is not defined'
): asserts value is NonNullable<T> {
  if (value === undefined || value === null) {
    throw new Error(errorMessage);
  }
}
