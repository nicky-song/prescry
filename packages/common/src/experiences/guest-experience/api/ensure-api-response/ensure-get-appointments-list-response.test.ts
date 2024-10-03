// Copyright 2020 Prescryptive Health, Inc.

import { ErrorConstants } from '../../../../theming/constants';
import { ensureGetAppointmentsListResponse } from './ensure-get-appointments-list-response';

describe('ensureGetAppointmentsResponse()', () => {
  it('should throw error if response data is invalid', () => {
    const mockResponseJson = {};
    expect(() =>
      ensureGetAppointmentsListResponse(mockResponseJson)
    ).toThrowError(ErrorConstants.errorInternalServer());
  });

  it('should return responseJson if response data is valid', () => {
    const mockResponseJson = { data: { appointments: {} } };
    const result = ensureGetAppointmentsListResponse(mockResponseJson);
    expect(result).toEqual(mockResponseJson);
  });
});
