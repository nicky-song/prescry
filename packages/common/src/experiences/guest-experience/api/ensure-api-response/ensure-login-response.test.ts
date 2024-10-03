// Copyright 2021 Prescryptive Health, Inc.

import { ErrorConstants } from '../../../../theming/constants';
import { ensureLoginResponse } from './ensure-login-response';

describe('ensureLoginResponse()', () => {
  it('should throw error if response data is invalid', () => {
    const mockResponseJson = {};
    expect(() => ensureLoginResponse(mockResponseJson)).toThrowError(
      ErrorConstants.errorInternalServer()
    );
  });

  it('should return responseJson if response data is valid', () => {
    const mockResponseJson = {
      message: 'Authentication successful!',
      status: 'success',
    };
    const result = ensureLoginResponse(mockResponseJson);
    expect(result).toEqual(mockResponseJson);
  });
});
