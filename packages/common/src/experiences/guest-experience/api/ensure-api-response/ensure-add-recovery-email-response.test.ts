// Copyright 2021 Prescryptive Health, Inc.

import { ErrorConstants } from '../../../../theming/constants';
import { ensureAddRecoveryEmailResponse } from './ensure-add-recovery-email-response';

describe('ensureAddRecoveryEmailResponse()', () => {
  it('should throw error if response data is invalid', () => {
    const mockResponseJson = {};
    expect(() => ensureAddRecoveryEmailResponse(mockResponseJson)).toThrowError(
      ErrorConstants.errorInternalServer()
    );
  });

  it('should return responseJson if response data is valid', () => {
    const mockResponseJson = {
      message: 'message',
      status: 'success',
    };
    const result = ensureAddRecoveryEmailResponse(mockResponseJson);
    expect(result).toEqual(mockResponseJson);
  });
});
