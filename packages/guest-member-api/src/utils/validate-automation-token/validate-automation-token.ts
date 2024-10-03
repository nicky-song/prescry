// Copyright 2021 Prescryptive Health, Inc.

import { Response, Request } from 'express';
import { TokenExpiredError, verify } from 'jsonwebtoken';
import { RequestHeaders } from '@phx/common/src/experiences/guest-experience/api/api-request-headers';
import { ErrorJsonWebTokenExpired } from '@phx/common/src/errors/error-jsonwebtoken-expired';
import { ErrorDeviceTokenInvalid } from '@phx/common/src/errors/error-device-token-invalid';
import { isArray } from 'util';

import { ErrorConstants } from '../../constants/response-messages';
import { IConfiguration } from '../../configuration';
import { HttpStatusCodes } from '../../constants/error-codes';
export type ValidateAutomationTokenResponseType = {
  status: boolean;
  errorMessage?: string;
  errorRequest?: number;
};

export const validateAutomationToken = (
  request: Request,
  response: Response,
  configuration: IConfiguration,
  number: string
): ValidateAutomationTokenResponseType => {
  const rawToken = getAutomationToken(request);

  if (!rawToken) {
    return { status: false };
  }

  try {
    const token = verifyJsonAutomationToken(
      rawToken,
      configuration.jwtTokenSecretKey
    );

    const { phoneNumber, name, code } = token;

    if (checkIfPhoneNumberAndNameIsValid(phoneNumber, name)) {
      if (number.includes(phoneNumber?.slice(1))) {
        response.locals.code = code;
        return { status: true };
      } else {
        return {
          status: true,
          errorMessage: ErrorConstants.WRONG_PHONE_NUMBER_ADDED,
          errorRequest: HttpStatusCodes.BAD_REQUEST,
        };
      }
    } else {
      return {
        status: true,
        errorMessage: ErrorConstants.AUTOMATION_PHONE_NUMBER_MISSING,
        errorRequest: HttpStatusCodes.BAD_REQUEST,
      };
    }
  } catch (error) {
    if (
      error instanceof ErrorJsonWebTokenExpired ||
      error instanceof ErrorDeviceTokenInvalid
    ) {
      return {
        status: true,
        errorMessage: error.message,
        errorRequest: HttpStatusCodes.UNAUTHORIZED_REQUEST,
      };
    }
    return {
      status: true,
      errorMessage: (error as Error).message,
      errorRequest: HttpStatusCodes.INTERNAL_SERVER_ERROR,
    };
  }
};

export function getAutomationToken(request: Request): string | undefined {
  const token = request.headers[RequestHeaders.automationTokenRequestHeader];

  if (token && !isArray(token)) {
    return token;
  }
  return;
}

const AutomationUserName = 'AUTOMATION_USER';
export function checkIfPhoneNumberAndNameIsValid(
  phoneNumber: string,
  name: string
) {
  return phoneNumber.startsWith('X') && name === AutomationUserName;
}

export interface IAutomationTokenPayload {
  phoneNumber: string;
  code: string;
  name: string;
}

export const verifyJsonAutomationToken = (
  token: string,
  jwtTokenSecretKey: string
): IAutomationTokenPayload => {
  try {
    const payload = verify(token, jwtTokenSecretKey) as IAutomationTokenPayload;

    return payload;
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new ErrorJsonWebTokenExpired(error);
    }
    throw new ErrorDeviceTokenInvalid(error as Error);
  }
};
