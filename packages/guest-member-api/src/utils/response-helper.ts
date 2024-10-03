// Copyright 2018 Prescryptive Health, Inc.

import { Response } from 'express';
import { ErrorWithCode } from '@phx/common/src/errors/error-with-code';
import { RequestHeaders } from '@phx/common/src/experiences/guest-experience/api/api-request-headers';
import { HttpStatusCodes, TwilioErrorCodes } from '../constants/error-codes';
import {
  ErrorConstants,
  TwilioErrorMessage,
} from '../constants/response-messages';
import { logTelemetryException } from './app-insight-helper';
import { GuestApiError } from './custom-error-helper';
import {
  trackPhoneNumberWithMaxAttemptsReachedEvent,
  trackUnsupportedPhoneNumberEvent,
} from './custom-event-helper';
import { logger } from './server-helper';
import { InternalStringResponseCode } from '@phx/common/src/experiences/guest-experience/api/response-codes';
import { ITwilioError } from '../models/twilio-error';
import RestException from 'twilio/lib/base/RestException';
import { ICommonBusinessMonitoringEvent } from '../models/common-business-monitoring-event';
import { publishCommonBusinessEventMessage } from './service-bus/common-business-event.helper';
import { publishCommonMonitoringEventMessage } from './service-bus/common-monitoring-event.helper';

export function SuccessResponse<T>(
  response: Response,
  message: string | null,
  data?: T,
  memberInfoRequestId?: string,
  prescriptionInfoRequestId?: string,
  responseHttpStatus?: number,
  responseCode?: number
) {
  return response
    .header(RequestHeaders.memberInfoRequestId, memberInfoRequestId)
    .header(RequestHeaders.prescriptionInfoRequestId, prescriptionInfoRequestId)
    .status(responseHttpStatus || HttpStatusCodes.SUCCESS)
    .json({
      data,
      message,
      responseCode,
      status: 'success',
    });
}
export function SuccessResponseWithoutHeaders<T>(
  response: Response,
  message: string | null,
  responseCode?: number,
  data?: T
) {
  return response.status(HttpStatusCodes.SUCCESS).json({
    data,
    message,
    responseCode,
    status: 'success',
  });
}
export function SuccessResponseWithInternalResponseCode<T>(
  response: Response,
  message: string | null,
  data?: T,
  responseHttpStatus?: number,
  responseCode?: InternalStringResponseCode
) {
  return response.status(responseHttpStatus || HttpStatusCodes.SUCCESS).json({
    data,
    message,
    responseCode,
  });
}

export const ErrorFailureResponse = (
  response: Response,
  statusCode: number,
  error: Error
) => {
  if (error instanceof ErrorWithCode) {
    const errorWithCode = error as ErrorWithCode<number>;
    return KnownFailureResponse(
      response,
      statusCode,
      errorWithCode.message,
      errorWithCode,
      errorWithCode.code
    );
  }
  return UnknownFailureResponse(response, error.message, error);
};

export const KnownFailureResponse = (
  response: Response,
  statusCode: number,
  message: string,
  errorObj?: Error,
  internalCode?: number,
  errorDetails?: object,
  serviceBusEvent?: ICommonBusinessMonitoringEvent
) => {
  if (errorObj) {
    logger.info(errorObj.message);
    logTelemetryException({
      exception: new GuestApiError(errorObj.message, errorObj),
    });
  } else {
    logger.info(message);
    logTelemetryException({ exception: new GuestApiError(message) });
  }

  if (serviceBusEvent) {
    const { topic, eventData } = serviceBusEvent;
    if (topic === 'Business') {
      publishCommonBusinessEventMessage(eventData);
    } else if (topic === 'Monitoring') {
      publishCommonMonitoringEventMessage(eventData);
    }
  }

  return response.status(statusCode).json({
    code: internalCode,
    details: errorDetails,
    message,
    status: 'failure',
  });
};

export const UnknownFailureResponse = (
  response: Response,
  message: string,
  errorObj?: Error
) => {
  if (errorObj) {
    logger.error(errorObj.message);
    logTelemetryException({
      exception: new GuestApiError(errorObj.message, errorObj),
    });
  } else {
    logger.error(message);
    logTelemetryException({ exception: new GuestApiError(message) });
  }

  return response.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
    message,
    status: 'error',
  });
};

export const validatePhoneNumberErrorType = (
  status: number,
  code: number | undefined,
  phoneNumber: string
): ITwilioError => {
  if (
    status === HttpStatusCodes.BAD_REQUEST &&
    code === TwilioErrorCodes.INVALID_PARAMETER
  ) {
    return {
      isKnownError: true,
      message: TwilioErrorMessage.UNABLE_TO_SEND_CODE,
      type: 'Twilio',
    };
  }
  if (code === TwilioErrorCodes.INVALID_PHONE_NUMBER) {
    return {
      isKnownError: true,
      message: TwilioErrorMessage.INVALID_PHONE_NUMBER,
      type: 'Twilio',
    };
  }
  if (
    status === HttpStatusCodes.TOO_MANY_REQUESTS &&
    (code === TwilioErrorCodes.MAX_SEND_ATTEMPTS_REACHED ||
      code === TwilioErrorCodes.MAX_VERIFICATION_CHECK_ATTEMPTS_REACHED)
  ) {
    trackPhoneNumberWithMaxAttemptsReachedEvent(phoneNumber);
    return {
      isKnownError: true,
      message: TwilioErrorMessage.TOO_MANY_TIMES,
      type: 'Twilio',
    };
  }

  if (
    status === HttpStatusCodes.FORBIDDEN_ERROR &&
    code === TwilioErrorCodes.UNSUPPORTED_LANDLINE_NUMBER
  ) {
    trackUnsupportedPhoneNumberEvent(phoneNumber);
    return {
      isKnownError: true,
      message: TwilioErrorMessage.UNSUPPORTED_LANDLINE_NUMBER,
      type: 'Twilio',
    };
  }

  return {
    isKnownError: false,
    message: ErrorConstants.INTERNAL_SERVER_ERROR,
  };
};

export const errorResponseWithTwilioErrorHandling = (
  response: Response,
  phoneNumber: string,
  error: RestException
) => {
  const errorValidator = validatePhoneNumberErrorType(
    error.status,
    error.code,
    phoneNumber
  );
  if (errorValidator.isKnownError) {
    return KnownFailureResponse(
      response,
      error.status,
      errorValidator.message,
      error,
      error.code
    );
  }
  return UnknownFailureResponse(
    response,
    ErrorConstants.INTERNAL_SERVER_ERROR,
    error
  );
};
