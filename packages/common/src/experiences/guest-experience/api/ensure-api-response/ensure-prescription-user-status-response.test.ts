// Copyright 2021 Prescryptive Health, Inc.

import { ErrorConstants } from '../../../../theming/constants';
import { ensurePrescriptionUserStatusResponse } from './ensure-prescription-user-status-response';

describe('ensurePrescriptionUserStatusResponse()', () => {
  it('should throw error if response data is invalid', () => {
    const mockResponseJson = {};
    expect(() =>
      ensurePrescriptionUserStatusResponse(mockResponseJson)
    ).toThrowError(ErrorConstants.errorInternalServer());
  });

  it('should return responseJson if response data is valid', () => {
    const mockResponseJson = {
      message: 'message',
      status: 'success',
      data: {
        personExists: false,
      },
    };
    const result = ensurePrescriptionUserStatusResponse(mockResponseJson);
    expect(result).toEqual(mockResponseJson);
  });
});
