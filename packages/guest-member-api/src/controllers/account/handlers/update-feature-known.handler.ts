// Copyright 2022 Prescryptive Health, Inc.

import { Response } from 'express';
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

export const updateFeatureKnownHandler = async (response: Response) => {
  try {
    const account = getRequiredResponseLocal(response, 'account');

    await publishAccountUpdateMessage({
      phoneNumber: account?.phoneNumber,
      isFavoritedPharmaciesFeatureKnown: true,
    });

    return SuccessResponse(
      response,
      SuccessConstants.UPDATE_FEATURE_KNOWN_SUCCESS
    );
  } catch (error) {
    return UnknownFailureResponse(
      response,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      error as Error
    );
  }
};
