// Copyright 2018 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import {
  KnownFailureResponse,
  SuccessResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import { getLocationForRequest } from '../helpers/get-location-for-request';
import {
  ErrorConstants,
  SuccessConstants,
} from '../../../constants/response-messages';
import { HttpStatusCodes } from '../../../constants/error-codes';
import { IGeolocationResponseData } from '@phx/common/src/models/api-response/geolocation-response';
import { IConfiguration } from '../../../configuration';

export async function getGeolocationHandler(
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
