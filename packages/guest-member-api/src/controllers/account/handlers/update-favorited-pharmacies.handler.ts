// Copyright 2022 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import {
  SuccessResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import { getRequiredResponseLocal } from '../../../utils/request/request-app-locals.helper';
import { publishAccountUpdateMessage } from '../../../utils/service-bus/account-update-helper';
import {
  ErrorConstants,
  SuccessConstants,
} from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import { IUpdateFavoritedPharmaciesRequestBody } from '@phx/common/src/models/api-request-body/update-favorited-pharmacies.request-body';
import { IConfiguration } from '../../../configuration';
import { updatePatientAccountFavorites } from '../../../utils/patient-account/update-patient-account-favorites';
import { getEndpointVersion } from '../../../utils/request/get-endpoint-version';

export const updateFavoritedPharmaciesHandler = async (
  request: Request,
  response: Response,
  configuration: IConfiguration
) => {
  const version = getEndpointVersion(request);
  const isV2Endpoint = version === 'v2';
  try {
    const { favoritedPharmacies } =
      request.body as IUpdateFavoritedPharmaciesRequestBody;

    const account = getRequiredResponseLocal(response, 'account');

    await publishAccountUpdateMessage({
      phoneNumber: account?.phoneNumber,
      favoritedPharmacies,
      isFavoritedPharmaciesFeatureKnown: true,
      recentlyUpdated: true,
    });

    if (isV2Endpoint) {
      const patientAccount = getRequiredResponseLocal(
        response,
        'patientAccount'
      );
      const updatedFavorites =
        patientAccount.userPreferences?.favorites?.filter(
          (x) => x.type !== 'pharmacies'
        ) ?? [];

      updatedFavorites.push({
        type: 'pharmacies',
        value: favoritedPharmacies,
      });
      await updatePatientAccountFavorites(
        configuration,
        patientAccount,
        updatedFavorites
      );
    }

    return SuccessResponse(
      response,
      SuccessConstants.UPDATE_FAVORITED_PHARMACIES_SUCCESS
    );
  } catch (error) {
    return UnknownFailureResponse(
      response,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      error as Error
    );
  }
};
