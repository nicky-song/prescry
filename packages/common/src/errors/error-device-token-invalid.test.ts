// Copyright 2021 Prescryptive Health, Inc.

import { ErrorConstants } from '../experiences/guest-experience/api/api-response-messages';
import { ErrorDeviceTokenInvalid } from './error-device-token-invalid';

describe('ErrorDeviceTokenInvalid', () => {
  it('should create instance of ErrorDeviceTokenInvalid', () => {
    const error = new ErrorDeviceTokenInvalid(new Error('fake-error'));
    expect(error).toBeInstanceOf(ErrorDeviceTokenInvalid);
    expect(error).toEqual(new Error(ErrorConstants.INVALID_TOKEN));
  });
});
