// Copyright 2022 Prescryptive Health, Inc.

import { ErrorConstants } from '../../../../theming/constants';
import { medicineCabinetStateMock } from '../../__mocks__/medicine-cabinet-state.mock';
import { ensureGetAccumulatorsResponse } from './ensure-accumulators.response';

describe('ensureGetAccumulatorResponse()', () => {
  it('should throw error if response data is invalid', () => {
    const mockResponseJson = {};
    expect(() => ensureGetAccumulatorsResponse(mockResponseJson)).toThrowError(
      ErrorConstants.errorInternalServer()
    );
  });

  it('should return responseJson if response data is valid', () => {
    const mockResponseJson = {
      data: medicineCabinetStateMock.accumulators,
    };
    const result = ensureGetAccumulatorsResponse(mockResponseJson);
    expect(result).toEqual(mockResponseJson);
  });
});
