// Copyright 2022 Prescryptive Health, Inc.

import { ErrorConstants } from '../../../../theming/constants';
import { alternativePlanComboGenericMock } from '../../__mocks__/claim-alert.mock';
import { ensureGetClaimAlertResponse } from './ensure-claim-alert.response';

describe('ensureGetClaimAlertResponse()', () => {
  it('should throw error if response data is invalid', () => {
    const mockResponseJson = {};
    expect(() => ensureGetClaimAlertResponse(mockResponseJson)).toThrowError(
      ErrorConstants.errorInternalServer()
    );
  });

  it('should return responseJson if response data is valid', () => {
    const mockResponseJson = {
      data: alternativePlanComboGenericMock,
    };
    const result = ensureGetClaimAlertResponse(mockResponseJson);
    expect(result).toEqual(mockResponseJson);
  });
});
