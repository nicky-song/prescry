// Copyright 2021 Prescryptive Health, Inc.

import { ErrorApiResponse } from '../../../../errors/error-api-response';
import { IMemberInfoResponse } from '../../../../models/api-response/member-info-response';
import {
  ErrorConstants,
  GuestExperienceUiApiResponseConstants,
} from '../../../../theming/constants';
import { guestExperienceCustomEventLogger } from '../../guest-experience-logger.middleware';

export const ensureGetMemberProfileResponse = (
  jsonResponse: unknown,
  url: string
): IMemberInfoResponse => {
  const potentialMember = jsonResponse as IMemberInfoResponse;
  const isValid = potentialMember.data && potentialMember.data.account;
  if (!isValid) {
    guestExperienceCustomEventLogger(
      GuestExperienceUiApiResponseConstants.GUEST_EXPERIENCE_UI_API_RESPONSE_ERROR,
      {
        ExpectedFrom: url,
        ExpectedInterface: 'IMemberProfileApiResponse',
        Message: GuestExperienceUiApiResponseConstants.message,
      }
    );
    throw new ErrorApiResponse(ErrorConstants.errorInternalServer());
  }
  return potentialMember;
};
