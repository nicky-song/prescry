// Copyright 2022 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import {
  ErrorConstants,
  SuccessConstants,
  TwilioErrorMessage,
} from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import { IConfiguration } from '../../../../../src/configuration';
import { SuccessResponse } from '../../../../../src/utils/response-helper';
import { UnknownFailureResponse } from '../../../../../src/utils/response-helper';
import { KnownFailureResponse } from '../../../../../src/utils/response-helper';
import { Twilio } from 'twilio';
import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';
import { sendOneTimePasswordV2 } from '../../../../utils/one-time-password/send-one-time-password-v2';
import { sendOneTimePassword } from '../../../../utils/one-time-password/send-one-time-password';
import { getEndpointVersion } from '../../../../utils/request/get-endpoint-version';
export interface ISendOTPResponse {
  contactHash?: string;
}

export async function sendOneTimePasswordHandler(
  request: Request,
  response: Response,
  twilioClient: Twilio,
  configuration: IConfiguration,
) {
  try {
    const version = getEndpointVersion(request);
    const isV2Endpoint = version === 'v2';

    const helperResponse = !isV2Endpoint
      ? await sendOneTimePassword(
          request,
          response,
          twilioClient,
          configuration,
          request.body.phoneNumber
        )
      : await sendOneTimePasswordV2(configuration, request.body.phoneNumber);

    if (!helperResponse.isCodeSent) {
      return KnownFailureResponse(
        response,
        helperResponse.errorStatus ??
          helperResponse.errorCode ??
          HttpStatusCodes.INTERNAL_SERVER_ERROR,
        helperResponse.errorMessage ?? TwilioErrorMessage.UNABLE_TO_SEND_CODE,
        undefined,
        helperResponse.errorCode
      );
    }

    return SuccessResponse<ISendOTPResponse>(
      response,
      SuccessConstants.SEND_SUCCESS_MESSAGE,
      { contactHash: helperResponse.contactHash }
    );
  } catch (error) {
    return UnknownFailureResponse(
      response,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      error as Error
    );
  }
}
