// Copyright 2021 Prescryptive Health, Inc.

import { ErrorAddMembership } from './error-add-membership';

describe('ErrorAddMembership', () => {
  it('should create instance of ErrorAddMembership', () => {
    const error = new ErrorAddMembership('fake-error');
    expect(error).toBeInstanceOf(ErrorAddMembership);
    expect(error).toEqual(new Error('fake-error'));
  });
  it('should create assign apiType property if provided', () => {
    const error = new ErrorAddMembership('fake-error', 'fake-api');
    expect(error).toBeInstanceOf(ErrorAddMembership);
    expect(error.apiType).toEqual('fake-api');
  });
});
