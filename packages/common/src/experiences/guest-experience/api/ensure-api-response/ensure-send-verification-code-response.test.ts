// Copyright 2021 Prescryptive Health, Inc.

import { ErrorConstants } from '../../../../theming/constants';
import { ensureSendVerificationCodeResponse } from './ensure-send-verification-code-response';

describe('ensureSendVerificationCodeResponse()', () => {
  it('should throw error if response data is invalid', () => {
    const mockResponseJson = {};
    expect(() =>
      ensureSendVerificationCodeResponse(mockResponseJson)
    ).toThrowError(ErrorConstants.errorInternalServer());
  });

  it('should return responseJson if response data is valid', () => {
    const mockResponseJson = {
      message: 'message',
      status: 'success',
    };
    const result = ensureSendVerificationCodeResponse(mockResponseJson);
    expect(result).toEqual(mockResponseJson);
  });
});
