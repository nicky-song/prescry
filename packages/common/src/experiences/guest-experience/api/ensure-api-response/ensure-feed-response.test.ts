// Copyright 2020 Prescryptive Health, Inc.

import { ErrorConstants } from '../../../../theming/constants';
import { ensureFeedResponse } from './ensure-feed-response';

describe('ensureFeedResponse()', () => {
  it('should throw error if response data is invalid', () => {
    const mockResponseJson = {};
    expect(() => ensureFeedResponse(mockResponseJson)).toThrowError(
      ErrorConstants.errorInternalServer()
    );
  });

  it('should return responseJson if response data is valid', () => {
    const mockResponseJson = { data: { feedItems: [] } };
    const result = ensureFeedResponse(mockResponseJson);
    expect(result).toEqual(mockResponseJson);
  });
});
