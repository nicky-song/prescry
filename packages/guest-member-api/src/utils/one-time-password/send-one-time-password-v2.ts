// Copyright 2022 Prescryptive Health, Inc.

import { IConfiguration } from '../../configuration';
import { HttpStatusCodes } from '../../constants/error-codes';
import { ErrorConstants } from '../../constants/response-messages';
import { EndpointError } from '../../errors/endpoint.error';
import {
  authorizeContact,
  ContactType,
  IAuthorizeContactProps,
} from '../external-api/patient-account/authorize-contact';
import { IConfirmContactResponse } from '../external-api/patient-account/confirm-contact';
import { ISendOneTimePasswordResponse } from './send-one-time-password';

export const sendOneTimePasswordV2 = async (
  configuration: IConfiguration,
  contactValue: string,
  contactType: ContactType = 'phone'
): Promise<ISendOneTimePasswordResponse> => {
  try {
    const authorizeContactProps: IAuthorizeContactProps = {
      contactType,
      contact: contactValue,
    };

    const sendOTPResponse: IConfirmContactResponse = await authorizeContact(
      configuration,
      authorizeContactProps
    );

    return {
      isCodeSent: true,
      contactHash: sendOTPResponse.contactHash,
    };
  } catch (error) {
    if (
      error instanceof EndpointError &&
      error.errorCode === HttpStatusCodes.BAD_REQUEST
    ) {
      return {
        isCodeSent: false,
        errorStatus: error.errorCode,
        errorMessage: getSendOTPBadRequestErrorMessage(error.message),
      };
    }

    throw error;
  }
};

const getSendOTPBadRequestErrorMessage = (error: string): string => {
  switch (error) {
    case ErrorConstants.SEND_OTP_CONTACT_NULL:
    case ErrorConstants.SEND_OTP_CONTACT_INVALID_PHONE_NUMBER:
      return error;
    case ErrorConstants.SEND_OTP_CONTACT_TOO_MANY_ATTEMPTS_RESPONSE:
      return ErrorConstants.SEND_OTP_CONTACT_TOO_MANY_ATTEMPTS;
    default:
      return ErrorConstants.INTERNAL_SERVER_ERROR;
  }
};
