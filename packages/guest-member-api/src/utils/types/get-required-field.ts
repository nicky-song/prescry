// Copyright 2018 Prescryptive Health, Inc.

import { ErrorRequestInitialization } from '@phx/common/src/errors/error-request-initialization';

export function getRequiredField<T, K extends keyof T>(
  o: T,
  key: K,
  optionalErrorCreator?: () => Error
) {
  const value = o[key];
  if (value) {
    return value as NonNullable<T[K]>;
  }
  if (!optionalErrorCreator) {
    throw new ErrorRequestInitialization(key.toString());
  }
  throw optionalErrorCreator();
}

export function getField<T, K extends keyof T>(o: T, key: K) {
  const value = o[key];
  if (value) {
    return value as NonNullable<T[K]>;
  }
  return undefined;
}
