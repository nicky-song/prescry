// Copyright 2021 Prescryptive Health, Inc.

import { ErrorBadRequest } from './error-bad-request';

describe('ErrorBadRequest', () => {
  it('should create instance of ErrorBadRequest', () => {
    const error = new ErrorBadRequest('fake-error');
    expect(error).toBeInstanceOf(ErrorBadRequest);
    expect(error).toEqual(new Error('fake-error'));
  });
});
