// Copyright 2021 Prescryptive Health, Inc.

import { ErrorConstants } from '../../../../theming/constants';
import { medicineCabinetStateMock } from '../../__mocks__/medicine-cabinet-state.mock';
import { ensureGetMedicineCabinetResponse } from './ensure-medicine-cabinet.response';

describe('ensureGetMedicineCabinetResponse()', () => {
  it('should throw error if response data is invalid', () => {
    const mockResponseJson = {};
    expect(() =>
      ensureGetMedicineCabinetResponse(mockResponseJson)
    ).toThrowError(ErrorConstants.errorInternalServer());
  });

  it('should return responseJson if response data is valid', () => {
    const mockResponseJson = {
      data: medicineCabinetStateMock.prescriptions,
    };
    const result = ensureGetMedicineCabinetResponse(mockResponseJson);
    expect(result).toEqual(mockResponseJson);
  });
});
