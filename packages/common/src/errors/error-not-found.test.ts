// Copyright 2021 Prescryptive Health, Inc.

import { ErrorNotFound } from './error-not-found';

describe('ErrorNotFound', () => {
  it('should create instance of ErrorNotFound', () => {
    const error = new ErrorNotFound('fake-error');
    expect(error).toBeInstanceOf(ErrorNotFound);
    expect(error).toEqual(new Error('fake-error'));
  });
});
