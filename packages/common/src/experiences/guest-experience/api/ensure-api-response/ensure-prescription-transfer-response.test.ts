// Copyright 2021 Prescryptive Health, Inc.

import { ErrorConstants } from '../../../../theming/constants';
import { ensurePrescriptionTransferResponse } from './ensure-prescription-transfer-response';

describe('ensurePrescriptionTransferResponse()', () => {
  it('should throw error if response data is invalid', () => {
    const mockResponseJson = {};
    expect(() =>
      ensurePrescriptionTransferResponse(mockResponseJson)
    ).toThrowError(ErrorConstants.errorInternalServer());
  });

  it('should return responseJson if response data is valid', () => {
    const mockResponseJson = {
      message: 'message',
      status: 'success',
    };
    const result = ensurePrescriptionTransferResponse(mockResponseJson);
    expect(result).toEqual(mockResponseJson);
  });
});
