// Copyright 2022 Prescryptive Health, Inc.

import {
  ErrorConstants,
  GuestExperienceUiApiResponseConstants,
} from '../../../../theming/constants';
import { guestExperienceCustomEventLogger } from '../../guest-experience-logger.middleware';
import { ensureUpdateLanguageCodeResponse } from './ensure-update-language-code-response';

jest.mock('../../guest-experience-logger.middleware');
const guestExperienceCustomEventLoggerMock =
  guestExperienceCustomEventLogger as jest.Mock;

const urlMock = 'url-mock';

describe('ensureUpdateLanguageCodeResponse()', () => {
  it('should throw error if response data is invalid', () => {
    const mockResponseJson = {};
    expect(() =>
      ensureUpdateLanguageCodeResponse(mockResponseJson, urlMock)
    ).toThrowError(ErrorConstants.errorForUpdateLanguageCode);
    expect(guestExperienceCustomEventLoggerMock).toHaveBeenCalledTimes(1);
    expect(guestExperienceCustomEventLoggerMock).toHaveBeenNthCalledWith(
      1,
      GuestExperienceUiApiResponseConstants.GUEST_EXPERIENCE_UI_API_RESPONSE_ERROR,
      {
        ExpectedFrom: urlMock,
        ExpectedInterface: 'IApiResponse',
        Message: GuestExperienceUiApiResponseConstants.message,
      }
    );
  });

  it('should return responseJson if response data is valid', () => {
    const mockResponseJson = {
      message: 'message',
      status: 'success',
    };
    const result = ensureUpdateLanguageCodeResponse(mockResponseJson, urlMock);
    expect(result).toEqual(mockResponseJson);
  });
});
