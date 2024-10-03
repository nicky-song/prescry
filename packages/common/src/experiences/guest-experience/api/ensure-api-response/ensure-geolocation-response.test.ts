// Copyright 2021 Prescryptive Health, Inc.

import { ErrorConstants } from '../../../../theming/constants';
import { ensureGeolocationResponse } from './ensure-geolocation-response';

describe('ensureGeolocationResponse()', () => {
  it('should throw error if response data is invalid', () => {
    const mockResponseJson = {};
    expect(() => ensureGeolocationResponse(mockResponseJson)).toThrowError(
      ErrorConstants.errorInternalServer()
    );
  });

  it('should return responseJson if response data is valid', () => {
    const mockResponseJson = { data: {} };
    const result = ensureGeolocationResponse(mockResponseJson);
    expect(result).toEqual(mockResponseJson);
  });
});
