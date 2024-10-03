// Copyright 2021 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import {
  ErrorConstants,
  SuccessConstants,
} from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import {
  KnownFailureResponse,
  SuccessResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import { HttpStatusCodes } from '../../../constants/error-codes';
import { IConfiguration } from '../../../configuration';
import { getRequestQuery } from '../../../utils/request/get-request-query';
import { ApiConstants } from '../../../constants/api-constants';

import { IPharmacy } from '@phx/common/src/models/pharmacy';
import { getGeolocationByZip } from '../../geolocation/helpers/get-geolocation-by-zip';
import {
  IPharmacySearchAndCacheResponse,
  searchAndCacheNearbyPharmaciesForCoordinates,
} from '../../../utils/external-api/search-and-cache-nearby-pharmacies-for-coordinates';
export async function pharmacySearchHandler(
  request: Request,
  response: Response,
  configuration: IConfiguration
) {
  try {
    const zipCode = getRequestQuery(request, 'zipcode');
    const latitude = getRequestQuery(request, 'latitude');
    const longitude = getRequestQuery(request, 'longitude');
    const startVal = getRequestQuery(request, 'start');
    const start = startVal && !isNaN(Number(startVal)) ? Number(startVal) : 0;
    const limitVal = getRequestQuery(request, 'limit');
    const limit =
      limitVal && !isNaN(Number(limitVal))
        ? Number(limitVal)
        : ApiConstants.NUM_PHARMACY_LIMIT;

    const distance =
      getRequestQuery(request, 'distance') ||
      ApiConstants.PHARMACY_SEARCH_RADIUS_MILES;

    if (!zipCode && (!latitude || !longitude)) {
      return KnownFailureResponse(
        response,
        HttpStatusCodes.BAD_REQUEST,
        ErrorConstants.QUERYSTRING_INVALID
      );
    }
    const coordinates = { latitude: 0, longitude: 0 };
    if (latitude && longitude) {
      coordinates.latitude = latitude;
      coordinates.longitude = longitude;
    } else if (zipCode) {
      const coord = getGeolocationByZip(zipCode);
      if (!coord) {
        return KnownFailureResponse(
          response,
          HttpStatusCodes.BAD_REQUEST,
          ErrorConstants.INVALID_ZIPCODE_SEARCH
        );
      }
      coordinates.latitude = coord.latitude;
      coordinates.longitude = coord.longitude;
    }
    const coordinateSearchResponse: IPharmacySearchAndCacheResponse =
      await searchAndCacheNearbyPharmaciesForCoordinates(
        configuration,
        coordinates.latitude,
        coordinates.longitude,
        distance,
        start > 0 ? start + limit : limit
      );
    const { pharmacies } = coordinateSearchResponse;
    if (pharmacies) {
      return SuccessResponse<IPharmacy[]>(
        response,
        SuccessConstants.DOCUMENT_FOUND,
        start > 0 ? pharmacies.slice(start) : pharmacies
      );
    }
    return KnownFailureResponse(
      response,
      coordinateSearchResponse.errorCode ||
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      coordinateSearchResponse.message ||
        ErrorConstants.ERROR_COORDINATES_SEARCH
    );
  } catch (error) {
    return UnknownFailureResponse(
      response,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      error as Error
    );
  }
}
