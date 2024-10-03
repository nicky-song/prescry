// Copyright 2021 Prescryptive Health, Inc.

import { ErrorConstants } from '../../../../theming/constants';
import { ensureProcessInviteCodeDetailsResponse } from './ensure-process-invite-code-details-response';

describe('ensureProcessInviteCodeDetailsResponse()', () => {
  it('should throw error if response data is invalid', () => {
    const mockResponse = {};
    expect(() =>
      ensureProcessInviteCodeDetailsResponse(mockResponse)
    ).toThrowError(ErrorConstants.errorInternalServer());
  });

  // it('should return responseJson if response data is valid', () => {
  //   const mockResponse = {
  //     data: {} as IProcessInviteCodeResponseData,
  //   } as IProcessInviteCodeResponse;
  //   const result = ensureProcessInviteCodeDetailsResponse(mockResponse);
  //   expect(result).toEqual(mockResponse);
  // });
});
