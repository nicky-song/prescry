// Copyright 2021 Prescryptive Health, Inc.

import { ErrorProviderLocationDetails } from './error-provider-location-details';

describe('ErrorProviderLocationDetails', () => {
  it('should create instance of ErrorProviderLocationDetails', () => {
    const expectedError = new Error('fake-error');
    const error = new ErrorProviderLocationDetails(
      'fake-error',
      'fake-api-type',
      12345
    );
    expect(error).toBeInstanceOf(ErrorProviderLocationDetails);
    expect(error).toEqual(expectedError);
    expect(error.apiType).toEqual('fake-api-type');
    expect(error.code).toEqual(12345);
  });
});
