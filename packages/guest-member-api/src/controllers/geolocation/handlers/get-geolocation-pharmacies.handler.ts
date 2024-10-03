// Copyright 2018 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import {
  KnownFailureResponse,
  SuccessResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import {
  ErrorConstants,
  SuccessConstants,
} from '../../../constants/response-messages';
import { HttpStatusCodes } from '../../../constants/error-codes';
import { IGeolocationResponseData } from '@phx/common/src/models/api-response/geolocation-response';
import { IConfiguration } from '../../../configuration';
import { ApiConstants } from '../../../constants/api-constants';
import { searchAndCacheNearbyPharmaciesForCoordinates } from '../../../utils/external-api/search-and-cache-nearby-pharmacies-for-coordinates';
import { getLocationForRequest } from '../helpers/get-location-for-request';

export async function getGeolocationPharmaciesHandler(
  request: Request,
  response: Response,
  configuration: IConfiguration
) {
  try {
    const { location, errorCode, message } = await getLocationForRequest(
      request,
      configuration
    );
    if (location) {
      if (location.latitude !== undefined && location.longitude !== undefined) {
        await searchAndCacheNearbyPharmaciesForCoordinates(
          configuration,
          location.latitude,
          location.longitude,
          ApiConstants.NEARBY_PHARMACIES_DEFAULT_DISTANCE,
          ApiConstants.NEARBY_PHARMACIES_DEFAULT_LIMIT
        );
      }
      return SuccessResponse<IGeolocationResponseData>(
        response,
        SuccessConstants.SUCCESS_OK,
        {
          location,
        }
      );
    }
    return KnownFailureResponse(
      response,
      errorCode ?? HttpStatusCodes.NOT_FOUND,
      message ?? ErrorConstants.INTERNAL_SERVER_ERROR
    );
  } catch (error) {
    return UnknownFailureResponse(
      response,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      error as Error
    );
  }
}
