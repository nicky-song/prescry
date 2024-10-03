// Copyright 2021 Prescryptive Health, Inc.

import { ErrorConstants } from '../../../../theming/constants';
import { ensureSearchPharmacyResponse } from './ensure-search-pharmacy-response';

describe('ensureSearchPharmacyResponse()', () => {
  it('should throw error if response data is null', () => {
    const mockResponseJson = {};
    expect(() => ensureSearchPharmacyResponse(mockResponseJson)).toThrowError(
      ErrorConstants.errorInternalServer()
    );
  });

  it('should return responseJson if response is valid', () => {
    const mockResponseJson = { data: [] };
    const result = ensureSearchPharmacyResponse(mockResponseJson);
    expect(result).toEqual(mockResponseJson);
  });
});
