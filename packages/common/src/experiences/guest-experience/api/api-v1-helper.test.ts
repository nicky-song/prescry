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
import { ErrorConstants } from '../../../theming/constants';
import { updateDeviceTokenSettingsAction } from '../store/settings/settings-reducer.actions';
import {
  HttpStatusCodes,
  InternalErrorCode,
  InternalResponseCode,
  TwilioErrorCodes,
} from '../../../errors/error-codes';
import { ErrorRequireUserSetPin } from '../../../errors/error-require-user-set-pin';
import { ErrorRequireUserVerifyPin } from '../../../errors/error-require-user-verify-pin';
import { ErrorUnauthorizedAccess } from '../../../errors/error-unauthorized-access';
import {
  APITypes,
  handleForbiddenError,
  handleHttpErrors,
  handleRedirectSuccessResponse,
  handleTwilioHttpErrors,
  handleTwilioTooManyRequestError,
  handleUnauthorizedRequestError,
  IRedirectResponse,
} from './api-v1-helper';
import { accountTokenClearDispatch } from '../store/settings/dispatch/account-token-clear.dispatch';
import { ErrorInviteCode } from '../../../errors/error-invite-code';
import { ErrorWaitlist } from '../../../errors/error-waitlist';
import { ErrorMaxVerificationAttempt } from '../../../errors/error-max-verification-attempts';
import { ErrorTwilioInvalidEmail } from '../../../errors/error-twilio-invalid-email';
import { TwilioErrorMessage } from './api-response-messages';
import { ErrorProviderLocationDetails } from '../../../errors/error-provider-location-details';
import { rootStackNavigationMock } from '../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { ErrorUserDataMismatch } from '../../../errors/error-data-mismatch-create-account';
import { ErrorActivationRecordMismatch } from '../../../errors/error-activation-record-mismatch';
import { ErrorNewDependentPrescription } from '../../../errors/error-caregiver-new-dependent-prescription';

jest.mock('../store/settings/dispatch/account-token-clear.dispatch');
const accountTokenClearDispatchMock = accountTokenClearDispatch as jest.Mock;

jest.mock('../store/settings/settings-reducer.actions', () => ({
  updateDeviceTokenSettingsAction: jest.fn().mockReturnValue(jest.fn()),
  updateTokenSettingsAction: jest.fn().mockReturnValue(jest.fn()),
}));

const mockUpdateDeviceTokenSettingsAction =
  updateDeviceTokenSettingsAction as jest.Mock;
const mockReduxDispatchHandler = jest.fn();
const mockResponse = {
  data: { deviceToken: 'deviceToken' },
  responseCode: 2001,
} as IRedirectResponse;

describe('handleForbiddenError', () => {
  beforeEach(() => {
    accountTokenClearDispatchMock.mockReset();
  });

  it('should return ErrorMaxPinAttempt with errorMaxPinVerificationAttemptReached message if code is SHOW_FORGET_PIN', () => {
    const error = handleForbiddenError(InternalErrorCode.SHOW_FORGET_PIN);
    expect(error).toBeInstanceOf(ErrorMaxPinAttempt);
    expect(error).toEqual(
      new Error(ErrorConstants.errorMaxPinVerificationAttemptReached)
    );
  });

  it('should return ErrorBadRequest error message if code = REQUIRE_USER_VERIFY_PIN and API TYPE is GET_MEMBERS', () => {
    const error = handleForbiddenError(
      InternalResponseCode.REQUIRE_USER_VERIFY_PIN
    );
    expect(error).toBeInstanceOf(ErrorRequireUserVerifyPin);
  });

  it('should return ErrorBadRequest error message if code = REQUIRE_USER_VERIFY_PIN and API TYPE is GET_PENDING_PRESCRIPTION', () => {
    const error = handleForbiddenError(
      InternalResponseCode.REQUIRE_USER_VERIFY_PIN
    );
    expect(error).toBeInstanceOf(ErrorRequireUserVerifyPin);
  });

  it('should return ErrorBadRequest error message if code = REQUIRE_USER_VERIFY_PIN and API TYPE is UPDATE_MEMBER', () => {
    const error = handleForbiddenError(
      InternalResponseCode.REQUIRE_USER_VERIFY_PIN
    );
    expect(error).toBeInstanceOf(ErrorRequireUserVerifyPin);
  });

  it('should return ErrorInvalidAuthToken if code is undefined', () => {
    const error = handleForbiddenError();
    expect(error).toBeInstanceOf(ErrorInvalidAuthToken);
    expect(error).toEqual(new Error(ErrorConstants.errorInvalidAuthToken));
  });
});

describe('handleHttpErrors()', () => {
  it('should return TooManyRequestError if http status code is TOO_MANY_REQUESTS', () => {
    const error = handleHttpErrors(
      HttpStatusCodes.TOO_MANY_REQUESTS,
      'message',
      APITypes.GET_MEMBERS
    );

    expect(error).toBeInstanceOf(TooManyRequestError);
    expect(error).toEqual(new Error(ErrorConstants.errorTooManyRequests));
  });

  it('should return ErrorInvalidAuthToken with apiType and code if http status code is UNAUTHORIZED_REQUEST', () => {
    const code = 101;
    const error = handleHttpErrors(
      HttpStatusCodes.UNAUTHORIZED_REQUEST,
      'message',
      APITypes.GET_MEMBERS,
      code
    );
    expect(error).toBeInstanceOf(ErrorInvalidAuthToken);
    expect(error.message).toBe(ErrorConstants.errorInvalidAuthToken);
  });

  it('returns ErrorNotFound with expected errorMessage if status is NOT_FOUND and api type is GEOLOCATION', () => {
    const errorMessageMock = 'error-message-mock';
    const errorResponseMock = new Error(errorMessageMock);

    const error = handleHttpErrors(
      HttpStatusCodes.NOT_FOUND,
      'message',
      APITypes.GEOLOCATION,
      undefined,
      errorResponseMock
    );

    const expectedError = new ErrorNotFound(errorMessageMock);
    expect(error).toEqual(expectedError);
  });

  it('returns ErrorNotFound with expected errorMessage if status is NOT_FOUND and api type is AUTOCOMPLETE_GEOLOCATION', () => {
    const errorMessageMock = 'error-message-mock';
    const errorResponseMock = new Error(errorMessageMock);

    const error = handleHttpErrors(
      HttpStatusCodes.NOT_FOUND,
      'message',
      APITypes.AUTOCOMPLETE_GEOLOCATION,
      undefined,
      errorResponseMock
    );

    const expectedError = new ErrorNotFound(errorMessageMock);
    expect(error).toEqual(expectedError);
  });

  it('returns ErrorNotFound with expected errorMessage if status is NOT_FOUND and api type is UPDATE_LANGUAGE_CODE', () => {
    const errorMessageMock = 'error-message-mock';
    const errorResponseMock = new Error(errorMessageMock);

    const error = handleHttpErrors(
      HttpStatusCodes.NOT_FOUND,
      'message',
      APITypes.UPDATE_LANGUAGE_CODE,
      undefined,
      errorResponseMock
    );

    const expectedError = new ErrorNotFound(errorMessageMock);
    expect(error).toEqual(expectedError);
  });

  it.each([
    [undefined, ErrorConstants.errorNotFound],
    [new Error('error'), 'error'],
  ])(
    'returns ErrorNotFound if http status code is NOT_FOUND (error response: %p)',
    (errorResponseMock: undefined | Error, expectedMessage: string) => {
      const error = handleHttpErrors(
        HttpStatusCodes.NOT_FOUND,
        'message',
        APITypes.GET_MEMBERS,
        undefined,
        errorResponseMock
      );

      const expectedError = new ErrorNotFound(expectedMessage);
      expect(error).toEqual(expectedError);
    }
  );

  it('should return ErrorInternalServer if http status code is INTERNAL_SERVER_ERROR', () => {
    const error = handleHttpErrors(
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      'message',
      APITypes.GET_MEMBERS
    );
    expect(error).toBeInstanceOf(ErrorInternalServer);
    expect(error).toEqual(new Error(ErrorConstants.errorInternalServer()));
  });

  it('should return ErrorInternalServer if http status code is SERVER_DATA_ERROR', () => {
    const error = handleHttpErrors(
      HttpStatusCodes.SERVER_DATA_ERROR,
      'message',
      APITypes.GET_MEMBERS
    );
    expect(error).toBeInstanceOf(ErrorInternalServer);
    expect(error).toEqual(new Error(ErrorConstants.errorInternalServer()));
  });

  it('should return ErrorInternalServer if http status code is SERVICE_UNAVAILABLE', () => {
    const error = handleHttpErrors(
      HttpStatusCodes.SERVICE_UNAVAILABLE,
      'message',
      APITypes.GET_MEMBERS
    );
    expect(error).toBeInstanceOf(ErrorInternalServer);
    expect(error).toEqual(new Error(ErrorConstants.errorInternalServer()));
  });

  it('should call handleForbiddenErrors if http status code is FORBIDDEN_ERROR', () => {
    const helper = jest.requireActual('./api-v1-helper');
    helper.handleForbiddenError = jest.fn();
    handleHttpErrors(
      HttpStatusCodes.FORBIDDEN_ERROR,
      'message',
      APITypes.GET_MEMBERS,
      InternalResponseCode.REQUIRE_USER_VERIFY_PIN
    );

    expect(handleForbiddenError).toHaveBeenNthCalledWith(
      1,
      InternalResponseCode.REQUIRE_USER_VERIFY_PIN,
      undefined,
      undefined
    );
  });
  it('should call handleForbiddenErrors with workflow if http status code is FORBIDDEN_ERROR', () => {
    const helper = jest.requireActual('./api-v1-helper');
    helper.handleForbiddenError = jest.fn();
    handleHttpErrors(
      HttpStatusCodes.FORBIDDEN_ERROR,
      'message',
      APITypes.GET_MEMBERS,
      InternalResponseCode.REQUIRE_USER_VERIFY_PIN,
      undefined,
      'prescriptionTransfer'
    );

    expect(handleForbiddenError).toHaveBeenNthCalledWith(
      1,
      InternalResponseCode.REQUIRE_USER_VERIFY_PIN,
      undefined,
      'prescriptionTransfer'
    );
  });
  it('should call handleForbiddenErrors if http status code is FORBIDDEN_ERROR and recovery email exists', () => {
    const helper = jest.requireActual('./api-v1-helper');
    helper.handleForbiddenError = jest.fn();
    handleHttpErrors(
      HttpStatusCodes.FORBIDDEN_ERROR,
      'message',
      APITypes.GET_MEMBERS,
      InternalResponseCode.REQUIRE_USER_VERIFY_PIN,
      {
        code: InternalResponseCode.REQUIRE_USER_VERIFY_PIN,
        details: { recoveryEmailExists: true },
      }
    );

    expect(handleForbiddenError).toHaveBeenNthCalledWith(
      1,
      InternalResponseCode.REQUIRE_USER_VERIFY_PIN,
      true,
      undefined
    );
  });
  it('should return ErrorBadRequest if http status code is BAD_REQUEST', () => {
    const error = handleHttpErrors(
      HttpStatusCodes.BAD_REQUEST,
      'message',
      APITypes.GET_MEMBERS
    );
    expect(error).toBeInstanceOf(ErrorBadRequest);
    expect(error).toEqual(new Error(ErrorConstants.errorBadRequest));
  });

  it('should return ErrorBadRequest with error message from API if the response has MAX_DEPENDENT_LIMIT_REACHED code and api type is CREATE_BOOKING', () => {
    const errorMessage = 'some error occured';
    const errorResponse = {
      code: InternalResponseCode.MAX_DEPENDENT_LIMIT_REACHED,
      details: {},
      message: errorMessage,
    };
    const error = handleHttpErrors(
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.errorForCreateBooking,
      APITypes.CREATE_BOOKING,
      InternalResponseCode.MAX_DEPENDENT_LIMIT_REACHED,
      errorResponse
    );
    expect(error).toBeInstanceOf(ErrorBadRequest);
    expect(error.message).toBe(errorMessage);
  });

  it('should return ErrorBadRequest with default dependent error message if the response does not has MAX_DEPENDENT_LIMIT_REACHED code and api type is CREATE_BOOKING', () => {
    const errorMessage = 'some error occured';
    const errorResponse = {
      details: {},
      message: errorMessage,
    };
    const error = handleHttpErrors(
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.errorForCreateBooking,
      APITypes.CREATE_BOOKING,
      undefined,
      errorResponse
    );
    expect(error).toBeInstanceOf(ErrorBadRequest);
    expect(error.message).toBe(ErrorConstants.errorInvalidDependentInformation);
  });
  it('should return ErrorUserDataMismatch if http status code is BAD_REQUEST and api type is CREATE_ACCOUNT', () => {
    const errorResponse = {
      code: InternalResponseCode.ACCOUNT_PERSON_DATA_MISMATCH,
      details: {},
    };
    const error = handleHttpErrors(
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.errorForCreateAccount,
      APITypes.CREATE_ACCOUNT,
      InternalResponseCode.ACCOUNT_PERSON_DATA_MISMATCH,
      errorResponse
    );
    expect(error).toBeInstanceOf(ErrorUserDataMismatch);
  });
  it('should return ErrorActivationRecordMismatch if http status code is BAD_REQUEST and api type is CREATE_ACCOUNT', () => {
    const errorResponse = {
      code: InternalResponseCode.ACTIVATION_PERSON_DATA_MISMATCH,
      details: {},
    };
    const error = handleHttpErrors(
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.errorForCreateAccount,
      APITypes.CREATE_ACCOUNT,
      InternalResponseCode.ACTIVATION_PERSON_DATA_MISMATCH,
      errorResponse
    );
    expect(error).toBeInstanceOf(ErrorActivationRecordMismatch);
  });
  it('should return ErrorMaxPinAttempt if http status code is BAD_REQUEST and api type is VERIFY_PIN', () => {
    const errorResponse = {
      details: {
        pinVerificationAttempt: 5,
      },
    };
    const error = handleHttpErrors(
      HttpStatusCodes.BAD_REQUEST,
      'max attempts failed',
      APITypes.VERIFY_PIN,
      undefined,
      errorResponse
    );
    expect(error).toBeInstanceOf(ErrorMaxPinAttempt);
    expect(error).toEqual(new Error('max attempts failed'));
    expect((error as ErrorMaxPinAttempt).numberOfFailedAttempts).toBe(5);
  });

  it('should return ErrorMaxPinAttempt if error response code 2007', () => {
    const errorResponse = {
      details: {
        pinVerificationAttempt: 5,
      },
    };
    const error = handleHttpErrors(
      HttpStatusCodes.BAD_REQUEST,
      'max attempts failed',
      APITypes.GET_MEMBERS,
      2007,
      errorResponse
    );
    expect(error).toBeInstanceOf(ErrorMaxPinAttempt);
    expect(error).toEqual(new Error('max attempts failed'));
    expect((error as ErrorMaxPinAttempt).numberOfFailedAttempts).toBe(5);
  });

  it('should return ErrorInviteCode when expected', () => {
    const details = { code: InternalResponseCode.INVITE_CODE_EXPIRED };
    const error = handleHttpErrors(
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.errorForGettingInviteCodeDetails,
      APITypes.PROCESS_INVITE_CODE,
      undefined,
      details
    );

    expect(error).toBeInstanceOf(ErrorInviteCode);
  });

  it('should return ErrorProviderLocationDetails when status code is bad request and api type is provider location details', () => {
    const details = { code: InternalResponseCode.INVITE_CODE_EXPIRED };
    const error = handleHttpErrors(
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.errorForGettingProviderLocationDetails,
      APITypes.PROVIDER_LOCATION_DETAILS,
      undefined,
      details
    );

    expect(error).toBeInstanceOf(ErrorProviderLocationDetails);
  });

  it('should return ErrorProviderLocationDetails when status code is not found and api type is provider location details', () => {
    const details = { code: InternalResponseCode.INVITE_CODE_EXPIRED };
    const error = handleHttpErrors(
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.errorForGettingProviderLocationDetails,
      APITypes.PROVIDER_LOCATION_DETAILS,
      undefined,
      details
    );

    expect(error).toBeInstanceOf(ErrorProviderLocationDetails);
  });

  it('should return ErrorPhoneNumberMismatched when expected', () => {
    const error = handleHttpErrors(
      HttpStatusCodes.UNAUTHORIZED_REQUEST,
      ErrorConstants.errorForGettingPrescriptionInfo,
      APITypes.GET_PRESCRIPTION_INFO
    );
    expect(error).toBeInstanceOf(ErrorPhoneNumberMismatched);
  });

  it('should return ErrorNewDependentPrescription when expected', () => {
    const details = {
      code: InternalResponseCode.CAREGIVER_NEW_DEPENDENT_PRESCRIPTION,
    };

    const error = handleHttpErrors(
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.errorForGettingPrescriptionInfo,
      APITypes.GET_PRESCRIPTION_INFO,
      undefined,
      details
    );
    expect(error).toBeInstanceOf(ErrorNewDependentPrescription);
  });

  it('should return ErrorMaxVerificationAttempt when expected', () => {
    const details = {
      details: { reachedMaxVerificationAttempts: true },
      message: 'test-message',
    };
    const error = handleHttpErrors(
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.errorForVerifyingIdentity,
      APITypes.VERIFY_IDENTITY,
      undefined,
      details
    );

    expect(error).toBeInstanceOf(ErrorMaxVerificationAttempt);
  });

  it('should return ErrorBadRequest when expected for verifying pin', () => {
    const details = {
      details: { reachedMaxVerificationAttempts: false },
      message: 'test-message',
    };
    const error = handleHttpErrors(
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.errorForVerifyingIdentity,
      APITypes.VERIFY_IDENTITY,
      undefined,
      details
    );

    expect(error).toBeInstanceOf(ErrorBadRequest);
  });

  it('should return ErrorBadRequest when expected for updating favorited pharmacies', () => {
    const details = {
      details: { reachedMaxVerificationAttempts: false },
      message: 'test-message',
    };
    const error = handleHttpErrors(
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.errorForUpdateFavoritedPharmacies,
      APITypes.UPDATE_FAVORITED_PHARMACIES,
      undefined,
      details
    );

    expect(error).toBeInstanceOf(ErrorBadRequest);
  });

  it('should return ErrorBadRequest when expected for updating feature known', () => {
    const details = {
      details: { reachedMaxVerificationAttempts: false },
      message: 'test-message',
    };
    const error = handleHttpErrors(
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.errorForUpdateFeatureKnown,
      APITypes.UPDATE_FEATURE_KNOWN,
      undefined,
      details
    );

    expect(error).toBeInstanceOf(ErrorBadRequest);
  });

  it('should return ErrorBadRequest when expected for updating language code', () => {
    const details = {
      details: { reachedMaxVerificationAttempts: false },
      message: 'test-message',
    };
    const error = handleHttpErrors(
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.errorForUpdateLanguageCode,
      APITypes.UPDATE_LANGUAGE_CODE,
      undefined,
      details
    );

    expect(error).toBeInstanceOf(ErrorBadRequest);
  });

  it('should return ErrorMaxVerificationAttempt when expected', () => {
    const details = {
      details: { reachedMaxVerificationAttempts: true },
      message: 'test-message',
    };
    const error = handleHttpErrors(
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.errorForResetPin,
      APITypes.RESET_PIN,
      undefined,
      details
    );

    expect(error).toBeInstanceOf(ErrorMaxVerificationAttempt);
  });

  it('should return ErrorWaitlist when expected', () => {
    const details = { code: InternalResponseCode.WAITLIST_MISSING_INFORMATION };
    const error = handleHttpErrors(
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.errorForJoinWaitlist,
      APITypes.JOIN_WAITLIST,
      undefined,
      details
    );

    expect(error).toBeInstanceOf(ErrorWaitlist);
  });

  it('should return Error with custom message if http status code is other than in the list', () => {
    const customMessage = 'message';
    const error = handleHttpErrors(411, customMessage, APITypes.GET_MEMBERS);
    expect(error).toEqual(new Error(customMessage));
  });

  it('should return ErrorBadRequest when expected for reset pin verification', () => {
    const details = {
      details: { reachedMaxVerificationAttempts: false },
      message: 'invalid code error message',
    };
    const error = handleHttpErrors(
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.errorForResetPin,
      APITypes.RESET_PIN,
      undefined,
      details
    );

    expect(error).toBeInstanceOf(ErrorBadRequest);
  });

  it('should return ErrorBadRequest when expected while getting pharmacies  ', () => {
    const error = handleHttpErrors(
      HttpStatusCodes.BAD_REQUEST,
      'message',
      APITypes.GET_PHARMACIES
    );

    expect(error).toBeInstanceOf(ErrorBadRequest);
  });

  it('returns ErrorUserDataMismatch if http status code is NOT_FOUND and ApiType is CREATE_ACOUNT', () => {
    const error = handleHttpErrors(
      HttpStatusCodes.NOT_FOUND,
      'message',
      APITypes.CREATE_ACCOUNT,
      3012
    );

    const expectedError = new ErrorUserDataMismatch(
      ErrorConstants.errorForCreateAccount,
      3012
    );
    expect(error).toEqual(expectedError);
  });
  it('returns ErrorActivationRecordMismatch if http status code is NOT_FOUND and ApiType is CREATE_ACOUNT', () => {
    const error = handleHttpErrors(
      HttpStatusCodes.NOT_FOUND,
      'message',
      APITypes.CREATE_ACCOUNT,
      3013
    );

    const expectedError = new ErrorActivationRecordMismatch(
      ErrorConstants.errorForCreateAccount,
      3013
    );
    expect(error).toEqual(expectedError);
  });
});

describe('handleUnauthorizedRequestError()', () => {
  it('should return ErrorUnauthorizedAccess error with errorUnauthorizedToUpdateMemberContactInfo message if API TYPE is UPDATE_MEMBER', () => {
    const error = handleUnauthorizedRequestError(APITypes.UPDATE_MEMBER);
    expect(error).toBeInstanceOf(ErrorUnauthorizedAccess);
    expect(error).toEqual(
      new Error(ErrorConstants.errorUnauthorizedToUpdateMemberContactInfo)
    );
  });

  it('should return ErrorPhoneNumberMismatched with errorPhoneNumberMismatched message if API TYPE is GET_MEMBERS', () => {
    const code = InternalErrorCode.UNAUTHORIZED_ACCESS_PHONE_NUMBER_MISMATCHED;
    const error = handleUnauthorizedRequestError(APITypes.GET_MEMBERS, code);
    expect(error).toBeInstanceOf(ErrorPhoneNumberMismatched);
    expect(error).toEqual(new Error(ErrorConstants.errorPhoneNumberMismatched));
  });

  it('should return ErrorUnauthorizedAlertUrl with errorUnauthorizedAlertUrlAccess message if API TYPE is GET_PENDING_PRESCRIPTION', () => {
    const code = InternalErrorCode.UNAUTHORIZED_ACCESS_PHONE_NUMBER_MISMATCHED;
    const error = handleUnauthorizedRequestError(
      APITypes.GET_PENDING_PRESCRIPTION,
      code
    );
    expect(error).toBeInstanceOf(ErrorUnauthorizedAlertUrl);
    expect(error).toEqual(
      new Error(ErrorConstants.errorUnauthorizedAlertUrlAccess)
    );
  });

  it('should return ErrorInvalidAuthToken with errorInvalidAuthToken message if API TYPE is other than in the list', () => {
    const error = handleUnauthorizedRequestError(APITypes.APPOINTMENTS_LIST);
    expect(error).toBeInstanceOf(ErrorInvalidAuthToken);
    expect(error).toEqual(new Error(ErrorConstants.errorInvalidAuthToken));
  });

  it('should return ErrorShowPinFeatureWelcomeScreen if code is REQUIRE_USER_SHOW_PIN_FEATURE_WELCOME_SCREEN', () => {
    const error = handleUnauthorizedRequestError(
      APITypes.GET_MEMBERS,
      InternalResponseCode.REQUIRE_USER_SHOW_PIN_FEATURE_WELCOME_SCREEN
    );
    expect(error).toBeInstanceOf(ErrorShowPinFeatureWelcomeScreen);
  });

  it('should return ErrorRequireUserRegistration if code is REQUIRE_USER_REGISTRATION', () => {
    const error = handleUnauthorizedRequestError(
      APITypes.GET_MEMBERS,
      InternalResponseCode.REQUIRE_USER_REGISTRATION
    );
    expect(error).toBeInstanceOf(ErrorRequireUserRegistration);
  });

  it('should return ErrorRequireUserSetPin if code is REQUIRE_USER_SET_PIN', () => {
    const error = handleUnauthorizedRequestError(
      APITypes.GET_MEMBERS,
      InternalResponseCode.REQUIRE_USER_SET_PIN
    );
    expect(error).toBeInstanceOf(ErrorRequireUserSetPin);
  });

  it('should return ErrorRequireUserVerifyPin if code is REQUIRE_USER_VERIFY_PIN', () => {
    const error = handleUnauthorizedRequestError(
      APITypes.GET_MEMBERS,
      InternalResponseCode.REQUIRE_USER_VERIFY_PIN
    );
    expect(error).toBeInstanceOf(ErrorRequireUserVerifyPin);
  });
});

describe('handleTwilioHttpErrors()', () => {
  it('should return TooManyRequestError if http status code is TOO_MANY_REQUESTS ', () => {
    const error = handleTwilioHttpErrors(
      HttpStatusCodes.TOO_MANY_REQUESTS,
      APITypes.SEND_ONE_TIME_PASSWORD,
      TwilioErrorCodes.MAX_SEND_ATTEMPTS_REACHED
    );
    expect(error).toBeInstanceOf(TooManyRequestError);
    expect(error).toEqual(
      new Error(ErrorConstants.errorTwilioMaxSendCodeAttempts)
    );
  });

  it('should return ErrorTwilioPermissionDenied with errorInSendingOneTimePassword message if API TYPE is SEND_ONE_TIME_PASSWORD', () => {
    const code = TwilioErrorCodes.PERMISSION_DENIED;
    const error = handleTwilioHttpErrors(
      HttpStatusCodes.UNAUTHORIZED_REQUEST,
      APITypes.SEND_ONE_TIME_PASSWORD,
      code
    );
    expect(error).toBeInstanceOf(ErrorTwilioPermissionDenied);
    expect(error).toEqual(
      new Error(ErrorConstants.errorInSendingOneTimePassword)
    );
  });

  it('should return ErrorTwilioPermissionDenied with errorUnableToLogin message if API TYPE is LOGIN', () => {
    const code = TwilioErrorCodes.PERMISSION_DENIED;
    const error = handleTwilioHttpErrors(
      HttpStatusCodes.UNAUTHORIZED_REQUEST,
      APITypes.LOGIN,
      code
    );
    expect(error).toBeInstanceOf(ErrorTwilioPermissionDenied);
    expect(error).toEqual(new Error(ErrorConstants.errorUnableToLogin));
  });

  it('should return ErrorTwilioPermissionDenied error with errorUnableToVerifyVerificationCode message if API TYPE is VERIFY_ONE_TIME_PASSWORD', () => {
    const error = handleTwilioHttpErrors(
      HttpStatusCodes.UNAUTHORIZED_REQUEST,
      APITypes.VERIFY_ONE_TIME_PASSWORD,
      TwilioErrorCodes.PERMISSION_DENIED
    );
    expect(error).toBeInstanceOf(ErrorTwilioPermissionDenied);
    expect(error).toEqual(
      new Error(ErrorConstants.errorUnableToVerifyVerificationCode)
    );
  });

  it('should return ErrorTwilioInvalidEmail error with INVALID_EMAIL_FORMAT message if API TYPE is SEND_VERIFICATION_CODE', () => {
    const error = handleTwilioHttpErrors(
      HttpStatusCodes.BAD_REQUEST,
      APITypes.SEND_VERIFICATION_CODE,
      TwilioErrorCodes.INVALID_EMAIL_FORMAT
    );
    expect(error).toBeInstanceOf(ErrorTwilioInvalidEmail);
    expect(error).toEqual(new Error(TwilioErrorMessage.INVALID_EMAIL_FORMAT));
  });

  it('should return undefined if API TYPE is other than in the list', () => {
    const error = handleTwilioHttpErrors(
      HttpStatusCodes.UNAUTHORIZED_REQUEST,
      APITypes.APPOINTMENTS_LIST
    );
    expect(error).toBeUndefined();
  });
});

describe('handleTwilioTooManyRequestError()', () => {
  it('should return TooManyRequestError with errorTwilioMaxSendCodeAttempts message if API TYPE is SEND_ONE_TIME_PASSWORD', () => {
    const code = TwilioErrorCodes.MAX_SEND_ATTEMPTS_REACHED;
    const error = handleTwilioTooManyRequestError(
      APITypes.SEND_ONE_TIME_PASSWORD,
      code
    );
    expect(error).toBeInstanceOf(TooManyRequestError);
    expect(error).toEqual(
      new Error(ErrorConstants.errorTwilioMaxSendCodeAttempts)
    );
  });

  it('should return TooManyRequestError with errorTwilioMaxVerifyDeviceAttempts message if API TYPE is LOGIN', () => {
    const code = TwilioErrorCodes.MAX_SEND_ATTEMPTS_REACHED;
    const error = handleTwilioTooManyRequestError(APITypes.LOGIN, code);
    expect(error).toBeInstanceOf(TooManyRequestError);
    expect(error).toEqual(
      new Error(ErrorConstants.errorTwilioMaxVerifyDeviceAttempts)
    );
  });

  it('should return TooManyRequestError with errorTwilioMaxVerifyCodeAttempts message if API TYPE is VERIFY_ONE_TIME_PASSWORD', () => {
    const code = TwilioErrorCodes.MAX_VERIFICATION_CHECK_ATTEMPTS_REACHED;
    const error = handleTwilioTooManyRequestError(
      APITypes.VERIFY_ONE_TIME_PASSWORD,
      code
    );
    expect(error).toBeInstanceOf(TooManyRequestError);
    expect(error).toEqual(
      new Error(ErrorConstants.errorTwilioMaxVerifyCodeAttempts)
    );
  });

  it('should return undefined if API TYPE is other than in the list', () => {
    const error = handleTwilioTooManyRequestError(
      APITypes.VERIFY_ONE_TIME_PASSWORD
    );
    expect(error).toBeUndefined();
  });
});

describe('handleRedirectSuccessResponse()', () => {
  it('should update device token and remove old auth token in settings', async () => {
    const dispatchMock = jest.fn();

    await handleRedirectSuccessResponse(
      mockResponse,
      dispatchMock,
      rootStackNavigationMock
    );

    expect(mockUpdateDeviceTokenSettingsAction).toHaveBeenCalledWith(
      'deviceToken'
    );
    expect(accountTokenClearDispatchMock).toHaveBeenCalledWith(dispatchMock);
  });

  it('should navigate to create PIN screen if InternalResponseCode is 2001', async () => {
    await handleRedirectSuccessResponse(
      mockResponse,
      mockReduxDispatchHandler,
      rootStackNavigationMock
    );
    expect(rootStackNavigationMock.navigate).toBeCalledWith('CreatePin');
  });

  it('should navigate to login PIN screen if InternalResponseCode is 2002', async () => {
    mockResponse.responseCode = 2002;
    await handleRedirectSuccessResponse(
      mockResponse,
      mockReduxDispatchHandler,
      rootStackNavigationMock
    );
    expect(rootStackNavigationMock.navigate).toBeCalledWith('LoginPin');
  });
  it('should navigate to Pin Feature welcome screen if InternalResponseCode is 2011', async () => {
    mockResponse.responseCode = 2011;
    await handleRedirectSuccessResponse(
      mockResponse,
      mockReduxDispatchHandler,
      rootStackNavigationMock
    );
    expect(rootStackNavigationMock.navigate).toBeCalledWith(
      'PinFeatureWelcome'
    );
  });
});
