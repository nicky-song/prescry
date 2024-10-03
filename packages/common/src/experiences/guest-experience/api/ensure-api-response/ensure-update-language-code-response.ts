// Copyright 2022 Prescryptive Health, Inc.

import { ErrorApiResponse } from '../../../../errors/error-api-response';
import { IApiResponse } from '../../../../models/api-response';
import {
  ErrorConstants,
  GuestExperienceUiApiResponseConstants,
} from '../../../../theming/constants';
import { guestExperienceCustomEventLogger } from '../../guest-experience-logger.middleware';

export const ensureUpdateLanguageCodeResponse = (
  responseJson: unknown,
  url: string
) => {
  const updateLanguageCodeResponse = responseJson as IApiResponse;
  const isValid = updateLanguageCodeResponse.status === 'success';

  if (!isValid) {
    guestExperienceCustomEventLogger(
      GuestExperienceUiApiResponseConstants.GUEST_EXPERIENCE_UI_API_RESPONSE_ERROR,
      {
        ExpectedFrom: url,
        ExpectedInterface: 'IApiResponse',
        Message: GuestExperienceUiApiResponseConstants.message,
      }
    );
    throw new ErrorApiResponse(ErrorConstants.errorForUpdateLanguageCode);
  }
  return updateLanguageCodeResponse;
};
