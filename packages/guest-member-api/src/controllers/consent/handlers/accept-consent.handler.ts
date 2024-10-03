// Copyright 2020 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { IHealthRecordEvent } from '../../../models/health-record-event';
import { publishHealthRecordEventMessage } from '../../../utils/service-bus/health-record-event-helper';
import {
  ErrorConstants,
  SuccessConstants,
} from '../../../constants/response-messages';

import {
  KnownFailureResponse,
  SuccessResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import { acceptConsentEventBuilder } from '../builders/accept-consent-event.builder';
import { IConsentEvent } from '../../../models/consent-event';
import { getRequiredRequestQuery } from '../../../utils/request/get-request-query';
import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';
import { getServiceDetailsByServiceType } from '../../../utils/external-api/get-service-details-by-service-type';
import { IConfiguration } from '../../../configuration';

export async function acceptConsentHandler(
  request: Request,
  response: Response,
  configuration: IConfiguration
) {
  try {
    const serviceType = getRequiredRequestQuery(request, 'servicetype');
    const validServiceType = await getServiceDetailsByServiceType(
      configuration,
      serviceType
    );
    if (validServiceType) {
      const acceptConsentEventMessage: IHealthRecordEvent<IConsentEvent> =
        acceptConsentEventBuilder(request, response, serviceType);
      await publishHealthRecordEventMessage(acceptConsentEventMessage);
      return SuccessResponse(response, SuccessConstants.SUCCESS_OK);
    }
    return KnownFailureResponse(
      response,
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.QUERYSTRING_INVALID
    );
  } catch (error) {
    return UnknownFailureResponse(
      response,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      error as Error
    );
  }
}
