// Copyright 2021 Prescryptive Health, Inc.

import { ErrorConstants } from '../../../../theming/constants';
import { ensureResetPinResponse } from './ensure-reset-pin-response';

describe('ensureResetPinResponse()', () => {
  it('should throw error if response data is invalid', () => {
    const mockResponseJson = {};
    expect(() => ensureResetPinResponse(mockResponseJson)).toThrowError(
      ErrorConstants.errorInternalServer()
    );
  });

  it('should return responseJson if response data is valid', () => {
    const mockResponseJson = { data: { deviceToken: 'token' } };
    const result = ensureResetPinResponse(mockResponseJson);
    expect(result).toEqual(mockResponseJson);
  });
});
