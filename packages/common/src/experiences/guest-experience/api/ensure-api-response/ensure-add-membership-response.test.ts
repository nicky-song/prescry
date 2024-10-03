// Copyright 2020 Prescryptive Health, Inc.

import { ErrorConstants } from '../../../../theming/constants';
import { ensureAddMembershipResponse } from './ensure-add-membership-response';

describe('ensureAddMembershipResponse()', () => {
  it('should throw error if response data is invalid', () => {
    const mockResponseJson = {};
    expect(() => ensureAddMembershipResponse(mockResponseJson)).toThrowError(
      ErrorConstants.errorInternalServer()
    );
  });

  it('should return responseJson if response data is valid', () => {
    const mockResponseJson = {
      status: 'success',
      message: 'Authentication successful!',
    };
    const result = ensureAddMembershipResponse(mockResponseJson);
    expect(result).toEqual(mockResponseJson);
  });
});
