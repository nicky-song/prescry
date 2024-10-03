// Copyright 2021 Prescryptive Health, Inc.

import { ErrorConstants } from '../../../../theming/constants';
import { ensureJoinWaitlistResponse } from './ensure-join-waitlist-response';

describe('ensureJoinWaitlistResponse()', () => {
  it('should throw error if response data is invalid', () => {
    const mockResponseJson = {};
    expect(() => ensureJoinWaitlistResponse(mockResponseJson)).toThrowError(
      ErrorConstants.errorInternalServer()
    );
  });

  it('should return responseJson if response data is valid', () => {
    const mockResponseJson = {
      data: {
        phoneNumber: '+16045582739',
        serviceType: 'service-type',
        identifier: '12345',
        firstName: 'first-name',
        lastName: 'last-name',
        dateOfBirth: '2000-01-01',
        zipCode: '78885',
        maxMilesAway: 10,
      },
    };
    const result = ensureJoinWaitlistResponse(mockResponseJson);
    expect(result).toEqual(mockResponseJson);
  });
});
