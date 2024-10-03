// Copyright 2021 Prescryptive Health, Inc.

import { IPrescriptionInfoResponse } from '../../../../models/api-response/prescryption-info.response';
import { ErrorConstants } from '../../../../theming/constants';
import { prescriptionInfoMock } from '../../__mocks__/prescription-info.mock';
import { ensureGetPrescriptionInfoResponse } from './ensure-get-prescription-info-response';

describe('ensureGetPrescriptionInfoResponse()', () => {
  it('throws error if response data is invalid', () => {
    const mockResponse = {};
    expect(() => ensureGetPrescriptionInfoResponse(mockResponse)).toThrowError(
      ErrorConstants.errorInternalServer()
    );
  });

  it('returns response data if valid', () => {
    const responseMock: Partial<IPrescriptionInfoResponse> = {
      data: prescriptionInfoMock,
    };

    const result = ensureGetPrescriptionInfoResponse(responseMock);
    expect(result).toEqual(responseMock);
  });
});
