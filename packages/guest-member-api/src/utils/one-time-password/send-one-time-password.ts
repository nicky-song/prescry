// Copyright 2022 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { Twilio } from 'twilio';
import RestException from 'twilio/lib/base/RestException';
import { IConfiguration } from '../../configuration';
import { validatePhoneNumberErrorType } from '../response-helper';
import { sendOneTimePassword as twilioSendOneTmePassword } from '../twilio-helper';
import {
  ValidateAutomationTokenResponseType,
  validateAutomationToken,
} from '../validate-automation-token/validate-automation-token';

export interface ISendOneTimePasswordResponse {
  isCodeSent: boolean;
  contactHash?: string;
  errorStatus?: number;
  errorMessage?: string;
  errorCode?: number;
}

export const sendOneTimePassword = async (
  request: Request,
  response: Response,
  twilioClient: Twilio,
  configuration: IConfiguration,
  phoneNumber: string
): Promise<ISendOneTimePasswordResponse> => {
  const isAutomationTokenValid: ValidateAutomationTokenResponseType =
    validateAutomationToken(request, response, configuration, phoneNumber);

  if (isAutomationTokenValid.status) {
    if (
      isAutomationTokenValid.errorMessage &&
      isAutomationTokenValid.errorRequest
    ) {
      return {
        isCodeSent: false,
        errorCode: isAutomationTokenValid.errorRequest,
        errorMessage: isAutomationTokenValid.errorMessage,
      };
    } else {
      return {
        isCodeSent: true,
      };
    }
  }

  try {
    await twilioSendOneTmePassword(
      twilioClient,
      configuration.twilioVerificationServiceId,
      phoneNumber
    );
    return {
      isCodeSent: true,
    };
  } catch (error) {
    const errorObj = error as RestException;
    const errorValidator = validatePhoneNumberErrorType(
      errorObj.status,
      errorObj.code,
      phoneNumber
    );
    if (errorValidator.isKnownError) {
      return {
        isCodeSent: false,
        errorStatus: errorObj.status,
        errorMessage: errorValidator.message,
        errorCode: errorObj.code,
      };
    } else {
      throw error;
    }
  }
};
