// Copyright 2021 Prescryptive Health, Inc.

import { ErrorConstants } from '../../../../theming/constants';
import { ensureCreateAccountResponse } from './ensure-create-account.response';

describe('ensureCreateAccountResponse()', () => {
  it('should throw error if response data is invalid', () => {
    const mockResponseJson = {};
    expect(() => ensureCreateAccountResponse(mockResponseJson)).toThrowError(
      ErrorConstants.errorInternalServer()
    );
  });

  it('should return responseJson if response data is valid', () => {
    const mockResponseJson = { data: { deviceToken: 'token' } };
    const result = ensureCreateAccountResponse(mockResponseJson);
    expect(result).toEqual(mockResponseJson);
  });
});
