// Copyright 2018 Prescryptive Health, Inc.

import { Request } from 'express';
import { ErrorConstants } from '../../../constants/response-messages';
import { HttpStatusCodes } from '../../../constants/error-codes';
import { getRequestQuery } from '../../../utils/request/get-request-query';
import { ILocationResponse } from '@phx/common/src/models/api-response/geolocation-response';
import { getNearbyGeolocation } from './get-nearby-geolocation';
import { getGeolocationByIp } from './get-geolocation-by-ip';
import { getGeolocationByZip } from './get-geolocation-by-zip';
import { IConfiguration } from '../../../configuration';

export async function getLocationForRequest(
  request: Request,
  configuration: IConfiguration
): Promise<ILocationResponse> {
  const zipCode = getRequestQuery(request, 'zipcode');
  const latitude = getRequestQuery(request, 'latitude');
  const longitude = getRequestQuery(request, 'longitude');
  if (!zipCode && (!latitude || !longitude)) {
    const ip =
      (request.headers['x-forwarded-for'] as string) ||
      request.connection.remoteAddress;
    if (!ip) {
      return {
        message: ErrorConstants.NO_IP_FOUND,
        errorCode: HttpStatusCodes.BAD_REQUEST,
      };
    }

    const result = await getGeolocationByIp(ip, configuration);
    if (result && result.location) {
      return {
        location: result.location,
      };
    }
    return {
      errorCode: result.errorCode ?? HttpStatusCodes.NOT_FOUND,
      message: result.message ?? ErrorConstants.INTERNAL_SERVER_ERROR,
    };
  }
  const nearestLocation = zipCode
    ? getGeolocationByZip(zipCode)
    : getNearbyGeolocation(Number(latitude), Number(longitude));
  if (nearestLocation) {
    return {
      location: nearestLocation,
    };
  }
  return {
    message: ErrorConstants.INVALID_ZIPCODE_SEARCH,
    errorCode: HttpStatusCodes.NOT_FOUND,
  };
}
