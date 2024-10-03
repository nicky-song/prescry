// Copyright 2022 Prescryptive Health, Inc.

import { ErrorConstants } from '../../../../theming/constants';
import { ensureVerifyPrescriptionResponse } from './ensure-verify-prescription-response';

describe('ensureVerifyPrescriptionResponse()', () => {
  it('should throw error if response data is invalid', () => {
    const mockResponseJson = {};
    expect(() =>
      ensureVerifyPrescriptionResponse(mockResponseJson)
    ).toThrowError(ErrorConstants.errorInternalServer());
  });

  it('should return responseJson if response data is valid', () => {
    const mockResponseJson = { data: { phoneNumber: '+11234567890' } };
    const result = ensureVerifyPrescriptionResponse(mockResponseJson);
    expect(result).toEqual(mockResponseJson);
  });
});
