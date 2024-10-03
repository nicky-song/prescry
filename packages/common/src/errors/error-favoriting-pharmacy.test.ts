// Copyright 2022 Prescryptive Health, Inc.

import { ErrorFavoritingPharmacy } from './error-favoriting-pharmacy';

describe('ErrorFavoritingPharmacy', () => {
  it('should create instance of ErrorShowSupportScreen', () => {
    const error = new ErrorFavoritingPharmacy('fake-error');
    expect(error).toBeInstanceOf(ErrorFavoritingPharmacy);
    expect(error).toEqual(new Error('fake-error'));
  });
  it('should create assign apiType property if provided', () => {
    const error = new ErrorFavoritingPharmacy('fake-error', 'fake-api');
    expect(error).toBeInstanceOf(ErrorFavoritingPharmacy);
    expect(error.apiType).toEqual('fake-api');
  });
});
