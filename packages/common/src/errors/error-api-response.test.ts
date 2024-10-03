// Copyright 2021 Prescryptive Health, Inc.

import { ErrorApiResponse } from './error-api-response';

describe('ErrorBadRequest', () => {
  it('should create instance of ErrorBadRequest', () => {
    const error = new ErrorApiResponse('fake-error');
    expect(error).toBeInstanceOf(ErrorApiResponse);
    expect(error).toEqual(new Error('fake-error'));
  });
});
