// Copyright 2022 Prescryptive Health, Inc.

import { ErrorApiResponse } from '../../../../errors/error-api-response';
import {
  IFavoritedPharmacyResponse,
  IFavoritedPharmacyResponseData,
} from '../../../../models/api-response/favorited-pharmacy-response';

import {
  ErrorConstants,
  GuestExperienceUiApiResponseConstants,
} from '../../../../theming/constants';
import { guestExperienceCustomEventLogger } from '../../guest-experience-logger.middleware';

export const ensureGetFavoritedPharmacyResponse = (
  jsonResponse: unknown,
  url: string
): IFavoritedPharmacyResponse => {
  const favoritedPharmacyResponse = jsonResponse as IFavoritedPharmacyResponse;
  if (!favoritedPharmacyResponse?.data?.favoritedPharmacies) {
    guestExperienceCustomEventLogger(
      GuestExperienceUiApiResponseConstants.GUEST_EXPERIENCE_UI_API_RESPONSE_ERROR,
      {
        ExpectedFrom: url,
        ExpectedInterface: 'IFavoritedPharmacyResponse',
        Message: GuestExperienceUiApiResponseConstants.message,
      }
    );
    throw new ErrorApiResponse(ErrorConstants.errorInternalServer());
  } else if (favoritedPharmacyResponse.data.favoritedPharmacies !== undefined)
    return favoritedPharmacyResponse;
  return {
    data: { favoritedPharmacies: [] } as IFavoritedPharmacyResponseData,
  } as IFavoritedPharmacyResponse;
};
