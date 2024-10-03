// Copyright 2022 Prescryptive Health, Inc.

import { ErrorApiResponse } from '../../../../errors/error-api-response';
import { IFavoritedPharmacyResponse } from '../../../../models/api-response/favorited-pharmacy-response';
import { IPharmacy } from '../../../../models/pharmacy';
import {
  ErrorConstants,
  GuestExperienceUiApiResponseConstants,
} from '../../../../theming/constants';
import { guestExperienceCustomEventLogger } from '../../guest-experience-logger.middleware';
import { ensureGetFavoritedPharmacyResponse } from './ensure-get-favorited-pharmacy-response';

jest.mock('../../../../errors/error-api-response');
jest.mock('../../guest-experience-logger.middleware');
const guestExperienceCustomEventLoggerMock =
  guestExperienceCustomEventLogger as jest.Mock;

jest.mock('../../../../theming/constants', () => ({
  ErrorConstants: {
    errorInternalServer: jest
      .fn()
      .mockReturnValue('error-internal-server-mock'),
  },
  GuestExperienceUiApiResponseConstants: {
    GUEST_EXPERIENCE_UI_API_RESPONSE_ERROR:
      'guest-experience-ui-api-response-error-mock',
    message: 'message-mock',
  },
}));

describe('ensureGetFavoritedPharmacyResponse', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns expected FavoritedPharmacyResponse', () => {
    const favoritedPharmaciesMock: IPharmacy[] = [
      {
        name: 'pharmacy-mock',
      } as IPharmacy,
    ];
    const jsonResponseMock: IFavoritedPharmacyResponse = {
      data: { favoritedPharmacies: favoritedPharmaciesMock },
      message: 'message-mock',
      status: 'status-mock',
    };
    const urlMock = 'url-mock';

    const ensuredFavoritedPharmacyResponse = ensureGetFavoritedPharmacyResponse(
      jsonResponseMock,
      urlMock
    );

    expect(ensuredFavoritedPharmacyResponse).toEqual(jsonResponseMock);
  });

  it('calls guestExperienceCustomEventLogger + ErrorApiResponse when favoritedPharmacies is not valid', () => {
    const jsonResponseMock = {};
    const urlMock = 'url-mock';

    try {
      ensureGetFavoritedPharmacyResponse(jsonResponseMock, urlMock);
    } catch (e) {
      expect(guestExperienceCustomEventLoggerMock).toHaveBeenCalledTimes(1);
      expect(guestExperienceCustomEventLoggerMock).toHaveBeenNthCalledWith(
        1,
        GuestExperienceUiApiResponseConstants.GUEST_EXPERIENCE_UI_API_RESPONSE_ERROR,
        {
          ExpectedFrom: urlMock,
          ExpectedInterface: 'IFavoritedPharmacyResponse',
          Message: GuestExperienceUiApiResponseConstants.message,
        }
      );

      expect(ErrorApiResponse).toHaveBeenCalledTimes(1);
      expect(ErrorApiResponse).toHaveBeenNthCalledWith(
        1,
        ErrorConstants.errorInternalServer()
      );
    }
  });
});
