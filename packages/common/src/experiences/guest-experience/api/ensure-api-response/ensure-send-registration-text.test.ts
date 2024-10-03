// Copyright 2020 Prescryptive Health, Inc.

import { ErrorConstants } from '../../../../theming/constants';
import { ensureSendRegistrationText } from './ensure-send-registration-text';

describe('ensureSendRegistrationText()', () => {
  it('should throw error if response data is invalid', () => {
    const mockResponseJson = {};
    expect(() => ensureSendRegistrationText(mockResponseJson)).toThrowError(
      ErrorConstants.errorInternalServer()
    );
  });

  it('should return responseJson if response data is valid', () => {
    const mockResponseJson = {
      message: 'fake-message',
      status: 'success',
    };
    const result = ensureSendRegistrationText(mockResponseJson);
    expect(result).toEqual(mockResponseJson);
  });
});
