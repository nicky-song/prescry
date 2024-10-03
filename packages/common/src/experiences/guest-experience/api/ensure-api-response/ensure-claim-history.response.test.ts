// Copyright 2022 Prescryptive Health, Inc.

import { ErrorConstants } from '../../../../theming/constants';
import { medicineCabinetStateMock } from '../../__mocks__/medicine-cabinet-state.mock';
import { ensureGetClaimHistoryResponse } from './ensure-claim-history.response';

describe('ensureGetClaimHistoryResponse()', () => {
  it('should throw error if response data is invalid', () => {
    const mockResponseJson = {};
    expect(() => ensureGetClaimHistoryResponse(mockResponseJson)).toThrowError(
      ErrorConstants.errorInternalServer()
    );
  });

  it('should return responseJson if response data is valid', () => {
    const mockResponseJson = {
      data: medicineCabinetStateMock.prescriptions,
    };
    const result = ensureGetClaimHistoryResponse(mockResponseJson);
    expect(result).toEqual(mockResponseJson);
  });
});
