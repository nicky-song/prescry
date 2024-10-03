// Copyright 2018 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';
import {
  ErrorConstants,
  SuccessConstants,
} from '../../constants/response-messages';
import {
  ErrorFailureResponse,
  SuccessResponse,
} from '../../utils/response-helper';

export type HealthControllerState = 'starting' | 'live' | 'failed';

export class HealthController {
  public static state: HealthControllerState = 'starting';
  public static failureReason: string;

  public readiness = (_: Request, response: Response) =>
    getHealthStatusResponse(HealthController.state, response);

  public liveness = (_: Request, response: Response) =>
    getHealthStatusResponse(HealthController.state, response);
}

export const getHealthStatusResponse = (
  state: HealthControllerState,
  response: Response
) => {
  if (state === 'live') {
    return SuccessResponse(response, SuccessConstants.SUCCESS_OK);
  }

  if (state === 'starting') {
    return ErrorFailureResponse(
      response,
      HttpStatusCodes.SERVICE_UNAVAILABLE,
      new Error(ErrorConstants.SERVER_IS_STARTING)
    );
  }

  return ErrorFailureResponse(
    response,
    HttpStatusCodes.INTERNAL_SERVER_ERROR,
    new Error(HealthController.failureReason)
  );
};
