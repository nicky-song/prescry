// Copyright 2018 Prescryptive Health, Inc.

import { ErrorApiResponse } from '../../../../errors/error-api-response';
import {
  IAddPinResponse,
  IApiResponse,
  IGetPendingPrescriptionResponse,
  IMembersApiResponse,
  IVerifyOneTimePassword,
  IVerifyOneTimePasswordV2,
  IVerifyPinResponse,
} from '../../../../models/api-response';
import {
  ErrorConstants,
  GuestExperienceUiApiResponseConstants,
} from '../../../../theming/constants';
import { guestExperienceCustomEventLogger } from '../../guest-experience-logger.middleware';
import { IRedirectResponse } from '../api-v1-helper';

export interface ICustomPropertiesForLoggingCustomEvent {
  ExpectedFrom: string;
  ExpectedInterface: string;
  Message: string;
}

export const ensureApiResponse = (responseJson: unknown) => {
  const apiResponse = responseJson as IApiResponse;
  const isValid = apiResponse.status === 'success';

  if (!isValid) {
    throw new ErrorApiResponse(ErrorConstants.errorInternalServer());
  }
  return apiResponse;
};

export const EnsureGetPendingPrescriptionResponse = (
  jsonResponse: unknown,
  url: string
): IGetPendingPrescriptionResponse => {
  const potentialPrescriptions =
    jsonResponse as IGetPendingPrescriptionResponse;
  const isValid =
    potentialPrescriptions.data &&
    potentialPrescriptions.data.pendingPrescriptionList &&
    potentialPrescriptions.data.pendingPrescriptionList.prescriptions;

  if (!isValid) {
    guestExperienceCustomEventLogger(
      GuestExperienceUiApiResponseConstants.GUEST_EXPERIENCE_UI_API_RESPONSE_ERROR,
      {
        ExpectedFrom: url,
        ExpectedInterface: 'IGetPendingPrescriptionResponse',
        Message: GuestExperienceUiApiResponseConstants.message,
      }
    );
    throw new ErrorApiResponse(ErrorConstants.errorInternalServer());
  }

  return potentialPrescriptions;
};

export const ensureVerifyOneTimePasswordResponse = (
  jsonResponse: unknown,
  url: string
): IVerifyOneTimePassword | IVerifyOneTimePasswordV2 => {
  const potentialToken = jsonResponse as IVerifyOneTimePasswordV2;
  const isValid = potentialToken.data && potentialToken.data.deviceToken;

  if (!isValid) {
    guestExperienceCustomEventLogger(
      GuestExperienceUiApiResponseConstants.GUEST_EXPERIENCE_UI_API_RESPONSE_ERROR,
      {
        ExpectedFrom: url,
        ExpectedInterface: 'IVerifyOneTimePasswordV2',
        Message: GuestExperienceUiApiResponseConstants.message,
      }
    );
    throw new ErrorApiResponse(ErrorConstants.errorInternalServer());
  }
  return potentialToken;
};

export const EnsureGetMemberContactInfoResponse = (
  jsonResponse: unknown,
  url: string
): IMembersApiResponse => {
  const potentialMember = jsonResponse as IMembersApiResponse;
  const isValid = potentialMember.data && potentialMember.data.memberDetails;
  if (!isValid) {
    guestExperienceCustomEventLogger(
      GuestExperienceUiApiResponseConstants.GUEST_EXPERIENCE_UI_API_RESPONSE_ERROR,
      {
        ExpectedFrom: url,
        ExpectedInterface: 'IMembersApiResponse',
        Message: GuestExperienceUiApiResponseConstants.message,
      }
    );
    throw new ErrorApiResponse(ErrorConstants.errorInternalServer());
  }
  return potentialMember;
};

export const EnsureRedirectResponse = (responseJson: unknown) => {
  const redirectResponse = responseJson as IRedirectResponse;
  const isValid = redirectResponse.data && redirectResponse.data.deviceToken;

  if (!isValid) {
    throw new ErrorApiResponse(ErrorConstants.errorInternalServer());
  }
  return redirectResponse;
};

export const EnsureAddPinResponse = (responseJson: unknown) => {
  const addPinResponse = responseJson as IAddPinResponse;
  const isValid = addPinResponse.data && addPinResponse.data.accountToken;

  if (!isValid) {
    throw new ErrorApiResponse(ErrorConstants.errorInternalServer());
  }
  return addPinResponse;
};

export const EnsureVerifyPinResponse = (responseJson: unknown) => {
  const verifyPinResponse = responseJson as IVerifyPinResponse;
  const isValid = verifyPinResponse.data && verifyPinResponse.data.accountToken;

  if (!isValid) {
    throw new ErrorApiResponse(ErrorConstants.errorInternalServer());
  }
  return verifyPinResponse;
};
