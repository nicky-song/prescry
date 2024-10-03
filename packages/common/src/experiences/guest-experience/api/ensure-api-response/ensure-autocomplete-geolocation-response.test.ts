// Copyright 2022 Prescryptive Health, Inc.

import { ErrorConstants } from '../../../../theming/constants';
import { ensureAutocompleteGeolocationResponse } from './ensure-autocomplete-geolocation-response';

describe('ensureAutocompleteGeolocationResponse()', () => {
  it('should throw error if response data is invalid', () => {
    const mockResponseJson = {};
    expect(() =>
      ensureAutocompleteGeolocationResponse(mockResponseJson)
    ).toThrowError(ErrorConstants.errorInternalServer());
  });

  it('should return responseJson if response data is valid', () => {
    const mockResponseJson = { data: {} };
    const result = ensureAutocompleteGeolocationResponse(mockResponseJson);
    expect(result).toEqual(mockResponseJson);
  });
});
