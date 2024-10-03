// Copyright 2020 Prescryptive Health, Inc.

import { ErrorInternalServer } from './error-internal-server';

describe('ErrorInternalServer', () => {
  it('should create instance of ErrorShowSupportScreen', () => {
    const error = new ErrorInternalServer('fake-error');
    expect(error).toBeInstanceOf(ErrorInternalServer);
    expect(error).toEqual(new Error('fake-error'));
  });
  it('should create assign apiType property if provided', () => {
    const error = new ErrorInternalServer('fake-error', 'fake-api');
    expect(error).toBeInstanceOf(ErrorInternalServer);
    expect(error.apiType).toEqual('fake-api');
  });
});
