// Copyright 2021 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';
import {
  SuccessConstants,
  ErrorConstants,
} from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import { IConfiguration } from '../../../configuration';
import { ILockSlotResponse } from '../../../models/pharmacy-portal/lock-slot.response';
import {
  SuccessResponse,
  KnownFailureResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import {
  createLockSlotEndpointHelper,
  ILockSlotEndpointResponse,
} from '../helpers/lock-slot-endpoint.helper';
import { ILockSlotRequestBody } from '@phx/common/src/models/api-request-body/lock-slot-request-body';

export async function lockSlotHandler(
  request: Request,
  response: Response,
  configuration: IConfiguration
) {
  const lockSlotRequest = request.body as ILockSlotRequestBody;
  try {
    const apiResponse: ILockSlotEndpointResponse =
      await createLockSlotEndpointHelper(configuration, lockSlotRequest);
    if (apiResponse.data) {
      return SuccessResponse<ILockSlotResponse>(
        response,
        SuccessConstants.SUCCESS_OK,
        apiResponse.data
      );
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
