// Copyright 2021 Prescryptive Health, Inc.

import { ErrorConstants } from '../../../../theming/constants';
import { ensureGetDrugInformationResponse } from './ensure-get-drug-information-response';

describe('ensureGetDrugInformationResponse()', () => {
  it('should throw error if response data is null', () => {
    const mockResponseJson = null;
    expect(() =>
      ensureGetDrugInformationResponse(mockResponseJson)
    ).toThrowError(ErrorConstants.errorInternalServer());
  });

  it('should return responseJson if drug found', () => {
    const mockResponseJson = { NDC: '12345' };
    const result = ensureGetDrugInformationResponse(mockResponseJson);
    expect(result).toEqual('12345');
  });

  it('should return null if drug not found', () => {
    const mockResponseJson = { message: 'NDC not found' };
    const result = ensureGetDrugInformationResponse(mockResponseJson);
    expect(result).toEqual(undefined);
  });
});
