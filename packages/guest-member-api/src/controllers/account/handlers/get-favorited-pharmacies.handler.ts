// Copyright 2022 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { ErrorConstants } from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import {
  SuccessResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import { IConfiguration } from '../../../configuration';
import { getFavoritedPharmaciesByNcpdpList } from '../helpers/get-favorited-pharmacies-by-ncpdp-list';
import { getRequiredResponseLocal } from '../../../utils/request/request-app-locals.helper';
import { IFavoritedPharmacyResponseData } from '@phx/common/src/models/api-response/favorited-pharmacy-response';
import { getEndpointVersion } from '../../../utils/request/get-endpoint-version';

export async function getFavoritedPharmaciesHandler(
  request: Request,
  response: Response,
  configuration: IConfiguration,
) {
  const version = getEndpointVersion(request);
  const isV2Version = version === 'v2';
  try {
    let ncpdpList;

    if (isV2Version) {
      const patientAccount = await getRequiredResponseLocal(
        response,
        'patientAccount'
      );

      ncpdpList = patientAccount.userPreferences?.favorites?.find(
        (x) => x.type === 'pharmacies'
      )?.value;
    } else {
      const accountInfo = await getRequiredResponseLocal(response, 'account');
      ncpdpList = accountInfo.favoritedPharmacies;
    }

    if (!ncpdpList || !ncpdpList.length) {
      return SuccessResponse<IFavoritedPharmacyResponseData>(response, null, {
        favoritedPharmacies: [],
      });
    }

    const favoritedPharmacies = await getFavoritedPharmaciesByNcpdpList(
      ncpdpList,
      configuration
    );

    return SuccessResponse<IFavoritedPharmacyResponseData>(response, null, {
      favoritedPharmacies,
    });
  } catch (error) {
    return UnknownFailureResponse(
      response,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      error as Error
    );
  }
}
