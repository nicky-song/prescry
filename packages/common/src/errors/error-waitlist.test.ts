// Copyright 2021 Prescryptive Health, Inc.

import { ErrorWaitlist } from './error-waitlist';

describe('ErrorWaitlist', () => {
  it('should create instance of ErrorWaitlist', () => {
    const error = new ErrorWaitlist('fake-error');
    expect(error).toBeInstanceOf(ErrorWaitlist);
    expect(error).toEqual(new Error('fake-error'));
  });
  it('should create assign apiType property if provided', () => {
    const error = new ErrorWaitlist('fake-error', 'fake-api');
    expect(error).toBeInstanceOf(ErrorWaitlist);
    expect(error.apiType).toEqual('fake-api');
  });
});
