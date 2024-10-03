// Copyright 2021 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';
import {
  SuccessConstants,
  ErrorConstants,
} from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import { IConfiguration } from '../../../configuration';
import {
  SuccessResponse,
  KnownFailureResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import {
  createUnlockSlotEndpointHelper,
  IUnlockSlotEndpointResponse,
} from '../helpers/unlock-slot-endpoint.helper';

export async function unlockSlotHandler(
  request: Request,
  response: Response,
  configuration: IConfiguration
) {
  try {
    const bookingId: string = request.params.id as string;
    if (!bookingId) {
      return KnownFailureResponse(
        response,
        HttpStatusCodes.BAD_REQUEST,
        ErrorConstants.MISSING_BOOKINGID
      );
    }
    const apiResponse: IUnlockSlotEndpointResponse =
      await createUnlockSlotEndpointHelper(configuration, bookingId);
    if (!apiResponse.errorCode) {
      return SuccessResponse(response, SuccessConstants.SUCCESS_OK);
    }
    return KnownFailureResponse(
      response,
      apiResponse.errorCode || HttpStatusCodes.INTERNAL_SERVER_ERROR,
      apiResponse.message
    );
  } catch (error) {
    return UnknownFailureResponse(
      response,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      error as Error
    );
  }
}
