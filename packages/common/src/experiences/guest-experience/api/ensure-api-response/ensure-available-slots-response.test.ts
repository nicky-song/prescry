// Copyright 2020 Prescryptive Health, Inc.

import { ErrorConstants } from '../../../../theming/constants';
import { ensureAvailableSlotsResponse } from './ensure-available-slots-response';

describe('ensureAvailableSlotsResponse()', () => {
  it('should throw error if response data is invalid', () => {
    const mockResponseJson = {};
    expect(() => ensureAvailableSlotsResponse(mockResponseJson)).toThrowError(
      ErrorConstants.errorInternalServer()
    );
  });

  it('should return responseJson if response data is valid', () => {
    const mockResponseJson = { data: { slots: [], unAvailableDays: [] } };
    const result = ensureAvailableSlotsResponse(mockResponseJson);
    expect(result).toEqual(mockResponseJson);
  });
});
