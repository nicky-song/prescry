// Copyright 2020 Prescryptive Health, Inc.

import { ErrorConstants } from '../../../../theming/constants';
import { ensureProviderLocationsResponse } from './ensure-provider-locations-response';

describe('ensureProviderLocationsResponse()', () => {
  it('should throw error if response data is invalid', () => {
    const mockResponseJson = {};
    expect(() =>
      ensureProviderLocationsResponse(mockResponseJson)
    ).toThrowError(ErrorConstants.errorInternalServer());
  });

  it('should return responseJson if response data is valid', () => {
    const mockResponseJson = {
      data: { locationList: [], surveyQuestions: [] },
    };
    const result = ensureProviderLocationsResponse(mockResponseJson);
    expect(result).toEqual(mockResponseJson);
  });
});
