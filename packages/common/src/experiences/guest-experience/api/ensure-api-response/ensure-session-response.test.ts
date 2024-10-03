// Copyright 2020 Prescryptive Health, Inc.

import { ErrorConstants } from '../../../../theming/constants';
import { ensureSessionResponse } from './ensure-session-response';
describe('ensureSessionResponse()', () => {
  it('should throw error if response data is invalid', () => {
    const mockResponseJson = {};
    expect(() => ensureSessionResponse(mockResponseJson)).toThrowError(
      ErrorConstants.errorInternalServer()
    );
  });

  it('should return responseJson if response data is valid', () => {
    const mockResponseJson = {
      message: 'fake-message',
      responseCode: 'SESSION_VALID',
    };
    const result = ensureSessionResponse(mockResponseJson);
    expect(result).toEqual(mockResponseJson);
  });
});
