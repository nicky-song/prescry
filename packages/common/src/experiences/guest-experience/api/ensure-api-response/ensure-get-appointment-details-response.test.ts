// Copyright 2020 Prescryptive Health, Inc.

import { ErrorConstants } from '../../../../theming/constants';
import { ensureGetAppointmentDetailsResponse } from './ensure-get-appointment-details-response';

describe('ensureGetAppointmentDetailsResponse()', () => {
  it('should throw error if response data is invalid', () => {
    const mockResponseJson = {};
    expect(() =>
      ensureGetAppointmentDetailsResponse(mockResponseJson)
    ).toThrowError(ErrorConstants.errorInternalServer());
  });

  it('should return responseJson if response data is valid', () => {
    const mockResponseJson = { data: { appointment: {} } };
    const result = ensureGetAppointmentDetailsResponse(mockResponseJson);
    expect(result).toEqual(mockResponseJson);
  });
});
