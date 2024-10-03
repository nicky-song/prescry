// Copyright 2022 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { IConfiguration } from '../../../configuration';
import { IGeolocationAutocompleteResponseData } from '@phx/common/src/models/api-response/geolocation-response';
import {
  ErrorConstants,
  SuccessConstants,
} from '../../../constants/response-messages';
import { getRequestQuery } from '../../../utils/request/get-request-query';
import {
  KnownFailureResponse,
  SuccessResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import { getGeolocationsByQuery } from '../helpers/get-geolocations-by-query';
import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';

export async function getGeolocationAutocompleteHandler(
  request: Request,
  response: Response,
  configuration: IConfiguration
) {
  try {
    const query = getRequestQuery(request, 'query');
    if (!query) {
      return SuccessResponse<IGeolocationAutocompleteResponseData>(
        response,
        SuccessConstants.SUCCESS_OK,
        {
          locations: [],
        }
      );
    }
    const result = await getGeolocationsByQuery(query, configuration);
    if (result && result.locations) {
      return SuccessResponse<IGeolocationAutocompleteResponseData>(
        response,
        SuccessConstants.DOCUMENT_FOUND,
        {
          locations: result.locations,
        }
      );
    }
    return KnownFailureResponse(
      response,
      result.errorCode ?? HttpStatusCodes.INTERNAL_SERVER_ERROR,
      result.message ?? ErrorConstants.INTERNAL_SERVER_ERROR
    );
  } catch (error) {
    return UnknownFailureResponse(
      response,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      error as Error
    );
  }
}
