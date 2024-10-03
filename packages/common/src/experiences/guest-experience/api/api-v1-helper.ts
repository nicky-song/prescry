// Copyright 2018 Prescryptive Health, Inc.

import { ErrorBadRequest } from '../../../errors/error-bad-request';
import { ErrorInternalServer } from '../../../errors/error-internal-server';
import { ErrorInvalidAuthToken } from '../../../errors/error-invalid-auth-token';
import { ErrorMaxPinAttempt } from '../../../errors/error-max-pin-attempt';
import { ErrorNotFound } from '../../../errors/error-not-found';
import { ErrorPhoneNumberMismatched } from '../../../errors/error-phone-number-mismatched';
import { ErrorRequireUserRegistration } from '../../../errors/error-require-user-registration';
import { ErrorShowPinFeatureWelcomeScreen } from '../../../errors/error-show-pin-feature-welcome-screen';
import { TooManyRequestError } from '../../../errors/error-too-many-requests';
import { ErrorTwilioPermissionDenied } from '../../../errors/error-twilio-permission-denied';
import { ErrorUnauthorizedAlertUrl } from '../../../errors/error-unauthorized-alert-url';
import { IApiDataResponse } from '../../../models/api-response';
import { ErrorConstants } from '../../../theming/constants';
import {
  IUpdateSettingsAction,
  updateDeviceTokenSettingsAction,
} from '../store/settings/settings-reducer.actions';
import {
  HttpStatusCodes,
  InternalErrorCode,
  InternalResponseCode,
  TwilioErrorCodes,
} from './../../../errors/error-codes';
import { ErrorRequireUserSetPin } from './../../../errors/error-require-user-set-pin';
import { ErrorRequireUserVerifyPin } from './../../../errors/error-require-user-verify-pin';
import { ErrorUnauthorizedAccess } from './../../../errors/error-unauthorized-access';
import { TwilioErrorMessage } from './api-response-messages';
import { accountTokenClearDispatch } from '../store/settings/dispatch/account-token-clear.dispatch';
import { ErrorAddMembership } from '../../../errors/error-add-membership';
import { ErrorWaitlist } from '../../../errors/error-waitlist';
import { ErrorMaxVerificationAttempt } from '../../../errors/error-max-verification-attempts';
import { ErrorInviteCode } from '../../../errors/error-invite-code';
import { ErrorTwilioInvalidEmail } from '../../../errors/error-twilio-invalid-email';
import { Workflow } from '../../../models/workflow';
import { ErrorProviderLocationDetails } from '../../../errors/error-provider-location-details';
import { Dispatch } from 'react';
import {
  RootStackNavigationProp,
  RootStackScreenName,
} from '../navigation/stack-navigators/root/root.stack-navigator';
import { ErrorUserDataMismatch } from '../../../errors/error-data-mismatch-create-account';
import { ErrorActivationRecordMismatch } from '../../../errors/error-activation-record-mismatch';
import { ErrorNewDependentPrescription } from '../../../errors/error-caregiver-new-dependent-prescription';

export interface IResponseWithErrorCodeOrMessage {
  code?: number;
  message?: string;
}

export interface IResponseWithErrorDetails {
  details?: {
    recoveryEmailExists?: boolean;
    pinVerificationAttempt?: number;
    reachedMaxVerificationAttempts?: boolean;
  };
}

export enum APITypes {
  GET_PENDING_PRESCRIPTION = 'GET_PENDING_PRESCRIPTION',
  VERIFY_ONE_TIME_PASSWORD = 'VERIFY_ONE_TIME_PASSWORD',
  SEND_ONE_TIME_PASSWORD = 'SEND_ONE_TIME_PASSWORD',
  LOGIN = 'LOGIN',
  GET_MEMBERS = 'GET_MEMBERS',
  UPDATE_MEMBER = 'UPDATE_MEMBER',
  ADD_PIN = 'ADD_PIN ',
  VERIFY_PIN = 'VERIFY_PIN',
  UPDATE_PIN = 'UPDATE_PIN',
  HEALTH_BOT = 'HEALTH_BOT',
  FEED = 'FEED',
  TEST_RESULTS = 'TEST_RESULTS',
  TEST_RESULTS_LIST = 'TEST_RESULTS_LIST',
  PROVIDER_LOCATIONS = 'PROVIDER_LOCATIONS',
  AVAILABLE_SLOTS = 'AVAILABLE_SLOTS',
  CREATE_ACCOUNT = 'CREATE_ACCOUNT',
  CANCEL_BOOKING = 'CANCEL_BOOKING',
  CREATE_BOOKING = 'CREATE_BOOKING',
  ACCEPT_CONSENT = 'ACCEPT_CONSENT',
  SESSION = 'SESSION',
  ADD_MEMBERSHIP = 'ADD_MEMBERSHIP',
  APPOINTMENT_DETAILS = 'APPOINTMENT_DETAILS',
  APPOINTMENTS_LIST = 'APPOINTMENTS_LIST',
  IMMUNIZATION_RECORD_DETAILS = 'IMMUNIZATION_RECORD_DETAILS',
  DRUG_INFORMATION = 'DRUG_INFORMATION',
  PROVIDER_LOCATION_DETAILS = 'PROVIDER_LOCATION_DETAILS',
  PROCESS_INVITE_CODE = 'PROCESS_INVITE_CODE',
  JOIN_WAITLIST = 'JOIN_WAITLIST',
  ADD_RECOVERY_EMAIL = 'ADD_RECOVERY_EMAIL',
  RESET_PIN = 'RESET_PIN',
  VERIFY_IDENTITY = 'VERIFY_IDENTITY',
  SEND_REGISTRATION_TEXT = 'SEND_REGISTRATION_TEXT',
  SEND_VERIFICATION_CODE = 'SEND_VERIFICATION_CODE',
  GET_PRESCRIPTION_INFO = 'GET_PRESCRIPTION_INFO',
  GET_PRESCRIPTION_PHARMACIES = 'GET_PRESCRIPTION_PHARMACIES',
  SEND_PRESCRIPTION = 'SEND_PRESCRIPTION',
  LOCK_SLOT = 'LOCK_SLOT',
  UNLOCK_SLOT = 'UNLOCK_SLOT',
  GET_DRUG_FORMS = 'GET_DRUG_FORMS',
  GEOLOCATION = 'GEOLOCATION',
  AUTOCOMPLETE_GEOLOCATION = 'AUTOCOMPLETE_GEOLOCATION',
  UPDATE_RECOVERY_EMAIL = 'UPDATE_RECOVERY_EMAIL',
  UPDATE_FAVORITED_PHARMACIES = 'UPDATE_FAVORITED_PHARMACIES',
  GET_FAVORITED_PHARMACIES = 'GET_FAVORITED_PHARMACIES',
  UPDATE_FEATURE_KNOWN = 'UPDATE_FEATURE_KNOWN',
  GET_PHARMACIES = 'GET_PHARMACIES',
  GET_MEDICINE_CABINET = 'GET_MEDICINE_CABINET',
  TRANSFER_PRESCRIPTION = 'TRANSFER_PRESCRIPTION',
  VERIFY_MEMBERSHIP = 'VERIFY_MEMBERSHIP',
  GET_PRESCRIPTION_USER_STATUS = 'GET_PRESCRIPTION_USER_STATUS',
  GET_ACCUMULATORS = 'GET_ACCUMULATORS',
  GET_CLAIM_HISTORY = 'GET_CLAIM_HISTORY',
  GET_CLAIM_ALERT = 'GET_CLAIM_ALERT',
  UPDATE_LANGUAGE_CODE = 'UPDATE_LANGUAGE_CODE',
  GET_ALTERNATIVE_DRUG_PRICE = 'GET_ALTERNATIVE_DRUG_PRICE',
  VERIFY_PATIENT_INFO = 'VERIFY_PATIENT_INFO',
}

export const handleHttpErrors = (
  status: number,
  customErrorMessage: string,
  apiType: APITypes,
  code?: number,
  errorResponse?: IResponseWithErrorCodeOrMessage & IResponseWithErrorDetails,
  workflow?: Workflow
) => {
  if (status === HttpStatusCodes.TOO_MANY_REQUESTS) {
    return new TooManyRequestError(ErrorConstants.errorTooManyRequests);
  }

  const errorCode = errorResponse?.code;
  const errorMessage = errorResponse?.message ?? 'unknown';

  if (
    status === HttpStatusCodes.UNAUTHORIZED_REQUEST &&
    apiType === APITypes.PROCESS_INVITE_CODE &&
    errorCode === InternalResponseCode.INVITE_CODE_INVALID_PHONE_NUMBER
  ) {
    return new ErrorInviteCode(errorMessage, apiType);
  }

  if (
    status === HttpStatusCodes.BAD_REQUEST &&
    errorCode === InternalResponseCode.CAREGIVER_NEW_DEPENDENT_PRESCRIPTION &&
    apiType === APITypes.GET_PRESCRIPTION_INFO
  ) {
    return new ErrorNewDependentPrescription(errorMessage);
  }

  if (
    status === HttpStatusCodes.UNAUTHORIZED_REQUEST &&
    apiType === APITypes.GET_PRESCRIPTION_INFO
  ) {
    return new ErrorPhoneNumberMismatched(errorMessage);
  }

  if (status === HttpStatusCodes.UNAUTHORIZED_REQUEST) {
    return handleUnauthorizedRequestError(apiType, code, undefined, workflow);
  }

  if (
    status === HttpStatusCodes.NOT_FOUND &&
    (apiType === APITypes.GEOLOCATION ||
      apiType === APITypes.AUTOCOMPLETE_GEOLOCATION ||
      apiType === APITypes.UPDATE_LANGUAGE_CODE)
  ) {
    return new ErrorNotFound(errorMessage);
  }

  if (status === HttpStatusCodes.NOT_FOUND) {
    if (apiType === APITypes.ADD_MEMBERSHIP) {
      return new ErrorAddMembership(customErrorMessage, apiType);
    }
    if (
      (apiType === APITypes.CREATE_ACCOUNT ||
        apiType === APITypes.VERIFY_MEMBERSHIP) &&
      code === InternalResponseCode.ACCOUNT_PERSON_DATA_MISMATCH
    ) {
      return new ErrorUserDataMismatch(
        ErrorConstants.errorForCreateAccount,
        code
      );
    } else if (
      (apiType === APITypes.CREATE_ACCOUNT ||
        apiType === APITypes.VERIFY_MEMBERSHIP) &&
      code === InternalResponseCode.ACTIVATION_PERSON_DATA_MISMATCH
    ) {
      return new ErrorActivationRecordMismatch(
        ErrorConstants.errorForCreateAccount,
        code
      );
    } else {
      return new ErrorNotFound(
        errorResponse?.message ?? ErrorConstants.errorNotFound
      );
    }
  }

  if (status === HttpStatusCodes.FORBIDDEN_ERROR) {
    if (apiType === APITypes.ADD_MEMBERSHIP) {
      return new ErrorAddMembership(customErrorMessage, apiType);
    } else {
      return handleForbiddenError(
        code,
        (errorResponse as IResponseWithErrorDetails)?.details
          ?.recoveryEmailExists,
        workflow
      );
    }
  }

  if (
    status === HttpStatusCodes.INTERNAL_SERVER_ERROR ||
    status === HttpStatusCodes.SERVER_DATA_ERROR ||
    status === HttpStatusCodes.SERVICE_UNAVAILABLE
  ) {
    return new ErrorInternalServer(
      ErrorConstants.errorInternalServer(),
      apiType
    );
  }

  if (
    status === HttpStatusCodes.BAD_REQUEST &&
    apiType === APITypes.JOIN_WAITLIST
  ) {
    return new ErrorWaitlist(errorMessage, apiType, errorResponse?.code);
  }

  if (
    (status === HttpStatusCodes.BAD_REQUEST &&
      apiType === APITypes.VERIFY_PIN) ||
    code === InternalErrorCode.SHOW_FORGET_PIN
  ) {
    return new ErrorMaxPinAttempt(
      customErrorMessage,
      (errorResponse as IResponseWithErrorDetails)?.details
        ?.pinVerificationAttempt ?? 0
    );
  }

  if (
    status === HttpStatusCodes.BAD_REQUEST &&
    apiType === APITypes.PROCESS_INVITE_CODE
  ) {
    return new ErrorInviteCode(errorMessage, apiType, errorResponse?.code);
  }

  if (
    status === HttpStatusCodes.BAD_REQUEST &&
    apiType === APITypes.VERIFY_IDENTITY
  ) {
    if (
      (errorResponse as IResponseWithErrorDetails)?.details
        ?.reachedMaxVerificationAttempts
    ) {
      return new ErrorMaxVerificationAttempt(
        errorMessage,
        !!(errorResponse as IResponseWithErrorDetails)?.details
          ?.reachedMaxVerificationAttempts
      );
    }
    return new ErrorBadRequest(errorMessage);
  }

  if (
    status === HttpStatusCodes.BAD_REQUEST &&
    apiType === APITypes.RESET_PIN
  ) {
    if (
      (errorResponse as IResponseWithErrorDetails)?.details
        ?.reachedMaxVerificationAttempts
    ) {
      return new ErrorMaxVerificationAttempt(
        errorMessage,
        !!(errorResponse as IResponseWithErrorDetails)?.details
          ?.reachedMaxVerificationAttempts
      );
    }
    return new ErrorBadRequest(errorMessage);
  }

  if (
    status === HttpStatusCodes.BAD_REQUEST &&
    apiType === APITypes.GET_PHARMACIES
  ) {
    return new ErrorBadRequest(errorMessage);
  }

  if (
    (status === HttpStatusCodes.BAD_REQUEST ||
      status === HttpStatusCodes.NOT_FOUND) &&
    apiType === APITypes.PROVIDER_LOCATION_DETAILS
  ) {
    return new ErrorProviderLocationDetails(
      errorMessage,
      apiType,
      errorResponse?.code
    );
  }
  if (
    status === HttpStatusCodes.BAD_REQUEST &&
    apiType === APITypes.CREATE_ACCOUNT &&
    code === InternalResponseCode.ACCOUNT_PERSON_DATA_MISMATCH
  ) {
    return new ErrorUserDataMismatch(
      ErrorConstants.errorForCreateAccount,
      code
    );
  }
  if (
    status === HttpStatusCodes.BAD_REQUEST &&
    apiType === APITypes.CREATE_ACCOUNT &&
    code === InternalResponseCode.ACTIVATION_PERSON_DATA_MISMATCH
  ) {
    return new ErrorActivationRecordMismatch(
      ErrorConstants.errorForCreateAccount,
      code
    );
  }
  if (
    status === HttpStatusCodes.BAD_REQUEST &&
    apiType === APITypes.CREATE_BOOKING
  ) {
    if (code === InternalResponseCode.MAX_DEPENDENT_LIMIT_REACHED) {
      return new ErrorBadRequest(errorMessage);
    }
    return new ErrorBadRequest(ErrorConstants.errorInvalidDependentInformation);
  }
  if (status === HttpStatusCodes.BAD_REQUEST) {
    return new ErrorBadRequest(ErrorConstants.errorBadRequest);
  }

  return new Error(customErrorMessage);
};

export const handleUnauthorizedRequestError = (
  apiPath: APITypes,
  code?: number,
  isEmailExist?: boolean,
  workflow?: Workflow
) => {
  if (apiPath === APITypes.UPDATE_MEMBER) {
    return new ErrorUnauthorizedAccess(
      ErrorConstants.errorUnauthorizedToUpdateMemberContactInfo
    );
  }

  if (
    apiPath === APITypes.GET_MEMBERS &&
    code === InternalErrorCode.UNAUTHORIZED_ACCESS_PHONE_NUMBER_MISMATCHED
  ) {
    return new ErrorPhoneNumberMismatched(
      ErrorConstants.errorPhoneNumberMismatched
    );
  }

  if (
    apiPath === APITypes.GET_PENDING_PRESCRIPTION &&
    code === InternalErrorCode.UNAUTHORIZED_ACCESS_PHONE_NUMBER_MISMATCHED
  ) {
    return new ErrorUnauthorizedAlertUrl(
      ErrorConstants.errorUnauthorizedAlertUrlAccess
    );
  }

  if (
    code === InternalResponseCode.REQUIRE_USER_SHOW_PIN_FEATURE_WELCOME_SCREEN
  ) {
    return new ErrorShowPinFeatureWelcomeScreen();
  }

  if (code === InternalResponseCode.REQUIRE_USER_REGISTRATION) {
    return new ErrorRequireUserRegistration();
  }

  if (code === InternalResponseCode.REQUIRE_USER_SET_PIN) {
    return new ErrorRequireUserSetPin(workflow);
  }

  if (code === InternalResponseCode.REQUIRE_USER_VERIFY_PIN) {
    return new ErrorRequireUserVerifyPin(isEmailExist);
  }
  return new ErrorInvalidAuthToken(ErrorConstants.errorInvalidAuthToken);
};

export const handleForbiddenError = (
  code?: number,
  isEmailExist?: boolean,
  workflow?: Workflow
) => {
  if (code === InternalErrorCode.SHOW_FORGET_PIN) {
    return new ErrorMaxPinAttempt(
      ErrorConstants.errorMaxPinVerificationAttemptReached,
      code
    );
  }

  if (code === InternalResponseCode.REQUIRE_USER_VERIFY_PIN) {
    return new ErrorRequireUserVerifyPin(isEmailExist, workflow);
  }

  return new ErrorInvalidAuthToken(ErrorConstants.errorInvalidAuthToken);
};

export const handleTwilioHttpErrors = (
  status: number,
  apiPath: APITypes,
  code?: number
) => {
  let message;

  if (status === HttpStatusCodes.TOO_MANY_REQUESTS) {
    return handleTwilioTooManyRequestError(apiPath, code);
  }

  if (
    status === HttpStatusCodes.UNAUTHORIZED_REQUEST &&
    code === TwilioErrorCodes.PERMISSION_DENIED
  ) {
    if (apiPath === APITypes.SEND_ONE_TIME_PASSWORD) {
      message = ErrorConstants.errorInSendingOneTimePassword;
    }

    if (apiPath === APITypes.LOGIN) {
      message = ErrorConstants.errorUnableToLogin;
    }

    if (apiPath === APITypes.VERIFY_ONE_TIME_PASSWORD) {
      message = ErrorConstants.errorUnableToVerifyVerificationCode;
    }
  }

  if (
    status === HttpStatusCodes.FORBIDDEN_ERROR &&
    code === TwilioErrorCodes.UNSUPPORTED_LANDLINE_NUMBER &&
    apiPath === APITypes.SEND_ONE_TIME_PASSWORD
  ) {
    message = TwilioErrorMessage.UNSUPPORTED_LANDLINE_NUMBER;
    return message && new ErrorBadRequest(message);
  }

  if (
    status === HttpStatusCodes.BAD_REQUEST &&
    apiPath === APITypes.SEND_VERIFICATION_CODE &&
    code === TwilioErrorCodes.INVALID_EMAIL_FORMAT
  ) {
    message = TwilioErrorMessage.INVALID_EMAIL_FORMAT;
    return message && new ErrorTwilioInvalidEmail(message);
  }

  return message && new ErrorTwilioPermissionDenied(message);
};

export const handleTwilioTooManyRequestError = (
  apiPath: APITypes,
  code?: number
) => {
  let message;

  if (apiPath === APITypes.SEND_VERIFICATION_CODE) {
    message = ErrorConstants.errorTwilioMaxSendVerificationCodeAttempts;
  }

  if (
    code === TwilioErrorCodes.MAX_SEND_ATTEMPTS_REACHED &&
    apiPath === APITypes.SEND_ONE_TIME_PASSWORD
  ) {
    message = ErrorConstants.errorTwilioMaxSendCodeAttempts;
  }

  if (
    code === TwilioErrorCodes.MAX_SEND_ATTEMPTS_REACHED &&
    apiPath === APITypes.LOGIN
  ) {
    message = ErrorConstants.errorTwilioMaxVerifyDeviceAttempts;
  }

  if (
    code === TwilioErrorCodes.MAX_VERIFICATION_CHECK_ATTEMPTS_REACHED &&
    (apiPath === APITypes.VERIFY_ONE_TIME_PASSWORD ||
      apiPath === APITypes.CREATE_ACCOUNT)
  ) {
    message = ErrorConstants.errorTwilioMaxVerifyCodeAttempts;
  }

  return message && new TooManyRequestError(message);
};

export async function handleRedirectSuccessResponse(
  response: IRedirectResponse,
  dispatch: Dispatch<IUpdateSettingsAction>,
  navigation: RootStackNavigationProp
) {
  await updateDeviceTokenSettingsAction(response.data.deviceToken)(dispatch);

  let screen: RootStackScreenName | undefined;
  let removeOldToken = false;

  switch (response.responseCode) {
    case InternalResponseCode.REQUIRE_USER_SHOW_PIN_FEATURE_WELCOME_SCREEN:
      screen = 'PinFeatureWelcome';
      break;

    case InternalResponseCode.REQUIRE_USER_SET_PIN:
      screen = 'CreatePin';
      removeOldToken = true;
      break;

    case InternalResponseCode.REQUIRE_USER_VERIFY_PIN:
      screen = 'LoginPin';
      removeOldToken = true;
      break;
  }

  if (removeOldToken) {
    await accountTokenClearDispatch(dispatch);
  }

  if (screen) {
    navigation.navigate(screen);
  }
}

export type IRedirectResponse = IApiDataResponse<{
  deviceToken: string;
}>;
