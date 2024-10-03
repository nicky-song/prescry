// Copyright 2021 Prescryptive Health, Inc.

import { ErrorConstants } from '../../../../theming/constants';
import { ensureUpdateRecoveryEmailResponse } from './ensure-update-recovery-email-response';

describe('ensureUpdateRecoveryEmailResponse()', () => {
  it('should throw error if response data is invalid', () => {
    const mockResponseJson = {};
    expect(() =>
      ensureUpdateRecoveryEmailResponse(mockResponseJson)
    ).toThrowError(ErrorConstants.errorInternalServer());
  });

  it('should return responseJson if response data is valid', () => {
    const mockResponseJson = {
      message: 'message',
      status: 'success',
    };
    const result = ensureUpdateRecoveryEmailResponse(mockResponseJson);
    expect(result).toEqual(mockResponseJson);
  });
});
