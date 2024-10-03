// Copyright 2020 Prescryptive Health, Inc.

import { Response } from 'express';
import { IPerson } from '@phx/common/src/models/person';
import { InternalResponseCode } from '../../../constants/error-codes';
import { SuccessConstants } from '../../../constants/response-messages';
import { ITermsAndConditionsWithAuthTokenAcceptance } from '../../../models/terms-and-conditions-acceptance-info';
import { SuccessResponse } from '../../../utils/response-helper';
import { publishAccountUpdateMessage } from '../../../utils/service-bus/account-update-helper';
import { publishAccountUpdateMessageAndAddToRedis } from '../../../utils/account/account.helper';

export interface IVerifyOneTimePasswordControllerResponseData {
  deviceToken: string;
  recoveryEmailExists?: boolean;
}

export async function memberRegistrationRequiredResponse(
  phoneNumber: string,
  termsAndConditionsAcceptances: ITermsAndConditionsWithAuthTokenAcceptance,
  token: string,
  response: Response
): Promise<Response> {
  await publishAccountUpdateMessage({
    phoneNumber,
    termsAndConditionsAcceptances,
  });
  /* TODO: store in HRE as patient account doesn't exist. Do this change right before initial migration script execution*/
  return SuccessResponse<IVerifyOneTimePasswordControllerResponseData>(
    response,
    SuccessConstants.PHONE_NUMBER_VERIFIED_SUCCESSFULLY_LOGIN,
    { deviceToken: token },
    undefined,
    undefined,
    undefined,
    InternalResponseCode.REQUIRE_USER_REGISTRATION
  );
}

export async function createPinResponse(
  phoneNumber: string,
  termsAndConditionsAcceptance: ITermsAndConditionsWithAuthTokenAcceptance,
  token: string,
  member: IPerson,
  response: Response,
  redisPhoneNumberRegistrationKeyExpiryTime: number
): Promise<Response> {
  await publishAccountUpdateMessageAndAddToRedis(
    {
      dateOfBirth: member.dateOfBirth,
      firstName: member.firstName,
      lastName: member.lastName,
      phoneNumber,
      termsAndConditionsAcceptances: termsAndConditionsAcceptance,
      recentlyUpdated: true,
    },
    redisPhoneNumberRegistrationKeyExpiryTime
  );
  return SuccessResponse<IVerifyOneTimePasswordControllerResponseData>(
    response,
    SuccessConstants.CREATE_WITH_PIN,
    { deviceToken: token },
    undefined,
    undefined,
    undefined,
    InternalResponseCode.REQUIRE_USER_SHOW_PIN_FEATURE_WELCOME_SCREEN
  );
}

export function phoneLoginSuccessResponse(
  accountKey: string | undefined,
  token: string,
  response: Response,
  recoveryEmailExists = false
): Response<IVerifyOneTimePasswordControllerResponseData> {
  const customCode = accountKey
    ? InternalResponseCode.REQUIRE_USER_VERIFY_PIN
    : InternalResponseCode.REQUIRE_USER_SET_PIN;

  const message = accountKey
    ? SuccessConstants.PHONE_NUMBER_VERIFIED_SUCCESSFULLY_VERIFY_PIN
    : SuccessConstants.PHONE_NUMBER_VERIFIED_SUCCESSFULLY_SET_PIN;

  return SuccessResponse<IVerifyOneTimePasswordControllerResponseData>(
    response,
    message,
    { deviceToken: token, recoveryEmailExists },
    undefined,
    undefined,
    undefined,
    customCode
  );
}
