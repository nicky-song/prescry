// Copyright 2018 Prescryptive Health, Inc.

export class GuestApiError extends Error {
  constructor(message: string | undefined, originalError?: Error) {
    super(message);
    this.name = 'GuestApiError';
    if (originalError) {
      this.stack = originalError.stack;
    }
  }
}
