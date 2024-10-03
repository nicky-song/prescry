// Copyright 2018 Prescryptive Health, Inc.

import { ErrorApiResponse } from '../../../../errors/error-api-response';
import { InternalResponseCode } from '../../../../errors/error-codes';
import { ErrorInvalidAuthToken } from '../../../../errors/error-invalid-auth-token';
import { TooManyRequestError } from '../../../../errors/error-too-many-requests';
import { ErrorTwilioService } from '../../../../errors/error-twilio-service';
import { ErrorConstants } from '../../../../theming/constants';
import { sendOneTimePassword, verifyOneTimePassword } from '../../api/api-v1';
import {
  GuestExperienceSettings,
  ISettings,
} from '../../guest-experience-settings';
import {
  handleAuthenticationErrorAction,
  handleCommonErrorAction,
  handleTwilioErrorAction,
} from '../error-handling.actions';
import { ICreatePinScreenRouteProps } from './../../create-pin-screen/create-pin-screen';
import { RootState } from '../root-reducer';
import {
  resetSettingsAction,
  updateDeviceTokenSettingsAction,
} from '../settings/settings-reducer.actions';
import { setMissingAccountErrorMessageAction } from '../support-error/support-error.reducer.actions';
import {
  dispatchResetVerificationCodeAction,
  dispatchVerifyCodeActionError,
  dispatchVerifyCodeResponse,
  getRedirectScreenIfNotReady,
  ISendOneTimePasswordAsyncActionArgs,
  IVerificationCodeActionParams,
  sendOneTimePasswordAction,
  sendOneTimePasswordLoadingAction,
  verifyCodeAction,
  verifyCodeLoadingAction,
} from './phone-number-verification-reducer.actions';
import { PhoneNumberVerificationActionsKeys } from './actions/phone-number-verification.actions';
import { Workflow } from '../../../../models/workflow';
import { dataLoadingAction } from '../modal-popup/modal-popup.reducer.actions';
import { rootStackNavigationMock } from '../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { ICreateAccountScreenRouteProps } from '../../screens/sign-in/create-account/create-account.screen';
import { ILocation } from '../../../../utils/api.helper';
import { getClaimAlertOrPrescriptionIdFromUrl } from '../../../../utils/claimalert-prescription.helper';
import { IFeaturesState } from '../../guest-experience-features';

const mockReduxDispatchHandler = jest.fn();
GuestExperienceSettings.update = jest.fn();

jest.mock('../modal-popup/modal-popup.reducer.actions');
const dataLoadingActionMock = dataLoadingAction as jest.Mock;

jest.mock('../settings/settings-reducer.actions', () => ({
  updateDeviceTokenSettingsAction: jest.fn(),
  resetSettingsAction: jest.fn(),
}));

jest.mock('../../api/api-v1', () => ({
  sendOneTimePassword: jest.fn().mockResolvedValue({
    message: 'Success Message',
    status: 'success',
  }),

  verifyOneTimePassword: jest.fn().mockResolvedValue({
    data: {
      token: 'fake-token',
      recoveryEmailExists: false,
    },
    message: 'Success Message',
    status: 'success',
  }),
}));

jest.mock('../support-error/support-error.reducer.actions');

jest.mock('../error-handling.actions');

jest.mock('../../../../utils/claimalert-prescription.helper');
const getClaimAlertPrescriptionInfoMock =
  getClaimAlertOrPrescriptionIdFromUrl as jest.Mock;

const mockSendOneTimePassword = sendOneTimePassword as jest.Mock;
const mockVerifyOneTimePassword = verifyOneTimePassword as jest.Mock;
const mockSetMissingAccountErrorMessageAction =
  setMissingAccountErrorMessageAction as jest.Mock;
const mockHandleAuthenticationErrorAction =
  handleAuthenticationErrorAction as jest.Mock;
const mockHandleCommonErrorAction = handleCommonErrorAction as jest.Mock;
const mockHandleTwillioErrorAction = handleTwilioErrorAction as jest.Mock;

const mockUpdateDeviceTokenSettingsAction =
  updateDeviceTokenSettingsAction as jest.Mock;
const mockResetSettingsAction = resetSettingsAction as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  mockUpdateDeviceTokenSettingsAction.mockReturnValue(
    (dispatch: unknown) => dispatch
  );
  getClaimAlertPrescriptionInfoMock.mockReturnValue(undefined);
  mockResetSettingsAction.mockReturnValue((dispatch: unknown) => dispatch);
});

mockUpdateDeviceTokenSettingsAction.mockImplementation(() => {
  return () => Promise.resolve({});
});

const verificationCodeMock = '222222';
const workflowMock: Workflow = 'startSaving';
const phoneNumberMock = '1234567890';
const phoneMockWithCountryCode = '+11234567890';
const phoneMockWithAlternateCountryCode = '+911234567890';

describe('sendOneTimePasswordAction', () => {
  const mockState: RootState = {
    config: {
      apis: {
        guestExperienceApi: {
          env: {
            host: '127.0.0.1',
            port: '4300',
            protocol: 'https',
            version: 'v1',
            url: '/api',
          },
          paths: {
            sendOneTimePassword: '/one-time-password/send',
          },
        },
      },
    } as unknown,
    features: {},
    phoneLogin: {},
    settings: {
      lastZipCode: 'unknown',
      token: 'unknown',
      automationToken: 'automation-token',
    } as ISettings,
  } as RootState;

  const mockGetState = jest.fn().mockReturnValue(mockState);

  it('mockSendOneTimePassword to be called with config, automation token and phone number passed in call', async () => {
    const argsMock: ISendOneTimePasswordAsyncActionArgs = {
      phoneNumber: phoneNumberMock,
      navigation: rootStackNavigationMock,
    };
    const actionDispatcher = sendOneTimePasswordAction(argsMock);
    await actionDispatcher(mockReduxDispatchHandler, mockGetState);
    expect(mockSendOneTimePassword).toHaveBeenCalledTimes(1);
    expect(mockSendOneTimePassword).toHaveBeenCalledWith(
      mockState.config.apis.guestExperienceApi,
      phoneMockWithCountryCode,
      mockState.settings.automationToken
    );
  });

  it('mockSendOneTimePassword to be called with countrycode config, automation token and phone number', async () => {
    const mockStateForPhoneLogin: RootState = {
      config: {
        apis: {
          guestExperienceApi: {
            env: {
              host: '127.0.0.1',
              port: '4300',
              protocol: 'https',
              version: 'v1',
              url: '/api',
            },
            paths: {
              sendOneTimePassword: '/one-time-password/send',
            },
          },
        },
      } as unknown,
      features: { usecountrycode: true },
      phoneLogin: {},
      settings: {
        lastZipCode: 'unknown',
        token: 'unknown',
      } as ISettings,
    } as RootState;

    mockGetState.mockReturnValueOnce(mockStateForPhoneLogin);

    const argsMock: ISendOneTimePasswordAsyncActionArgs = {
      phoneNumber: phoneNumberMock,
      navigation: rootStackNavigationMock,
    };
    const actionDispatcher = sendOneTimePasswordAction(argsMock);
    await actionDispatcher(mockReduxDispatchHandler, mockGetState);
    expect(mockSendOneTimePassword).toHaveBeenCalledTimes(1);
    expect(mockSendOneTimePassword).toHaveBeenCalledWith(
      mockStateForPhoneLogin.config.apis.guestExperienceApi,
      phoneMockWithAlternateCountryCode,
      undefined
    );
  });

  it('should dispatch isIncorrectCode flag as false if status is success', async () => {
    mockSendOneTimePassword.mockResolvedValueOnce({
      message: 'One Time Password sent successful',
      status: 'success',
    });

    const argsMock: ISendOneTimePasswordAsyncActionArgs = {
      phoneNumber: phoneNumberMock,
      navigation: rootStackNavigationMock,
    };
    const actionDispatcher = sendOneTimePasswordAction(argsMock);
    await actionDispatcher(mockReduxDispatchHandler, mockGetState);
    expect(mockReduxDispatchHandler.mock.calls[0][0]).toMatchObject({
      payload: {
        isIncorrectCode: false,
      },
      type: PhoneNumberVerificationActionsKeys.SET_VERIFICATION_CODE_ERROR_STATE,
    });
  });

  it('should dispatch isOneTimePasswordSent flag as true if status is success', async () => {
    mockSendOneTimePassword.mockImplementation(() => {
      return new Promise((resolve) =>
        resolve({
          message: 'One Time Password sent successful',
          status: 'success',
        })
      );
    });

    const argsMock: ISendOneTimePasswordAsyncActionArgs = {
      phoneNumber: phoneNumberMock,
      navigation: rootStackNavigationMock,
    };
    const actionDispatcher = sendOneTimePasswordAction(argsMock);
    await actionDispatcher(mockReduxDispatchHandler, mockGetState);

    expect(mockReduxDispatchHandler.mock.calls[1][0]).toMatchObject({
      payload: {
        isOneTimePasswordSent: true,
      },
      type: PhoneNumberVerificationActionsKeys.SET_SEND_ONE_TIME_PASSWORD_STATUS,
    });
  });

  it('should dispatch isOneTimePasswordSent flag as false if status is error', async () => {
    mockSendOneTimePassword.mockReturnValueOnce(
      Promise.reject({
        ok: false,
        status: 404,
      })
    );

    const argsMock: ISendOneTimePasswordAsyncActionArgs = {
      phoneNumber: phoneNumberMock,
      navigation: rootStackNavigationMock,
    };
    const actionDispatcher = sendOneTimePasswordAction(argsMock);
    await actionDispatcher(mockReduxDispatchHandler, mockGetState);

    expect(mockReduxDispatchHandler.mock.calls[0][0]).toMatchObject({
      payload: {
        isOneTimePasswordSent: false,
      },
      type: PhoneNumberVerificationActionsKeys.SET_SEND_ONE_TIME_PASSWORD_STATUS,
    });
  });

  it('should call handleTwillioErrorActionroute when TooManyRequestError is thrown', async () => {
    mockSendOneTimePassword.mockImplementation(() => {
      throw new TooManyRequestError(
        ErrorConstants.errorTwilioMaxSendCodeAttempts
      );
    });

    const argsMock: ISendOneTimePasswordAsyncActionArgs = {
      phoneNumber: phoneNumberMock,
      navigation: rootStackNavigationMock,
    };
    const actionDispatcher = sendOneTimePasswordAction(argsMock);
    await actionDispatcher(mockReduxDispatchHandler, mockGetState);
    expect(mockHandleTwillioErrorAction).toHaveBeenCalledTimes(1);
    expect(mockHandleTwillioErrorAction).toHaveBeenCalledWith(
      mockReduxDispatchHandler,
      rootStackNavigationMock,
      ErrorConstants.errorTwilioMaxSendCodeAttempts
    );
  });

  it('should call handleAuthenticationErrorAction when ErrorInvalidAuthToken is thrown', async () => {
    mockSendOneTimePassword.mockImplementation(() => {
      throw new ErrorInvalidAuthToken(ErrorConstants.errorInvalidAuthToken);
    });

    const argsMock: ISendOneTimePasswordAsyncActionArgs = {
      phoneNumber: phoneNumberMock,
      navigation: rootStackNavigationMock,
    };
    const actionDispatcher = sendOneTimePasswordAction(argsMock);
    await actionDispatcher(mockReduxDispatchHandler, mockGetState);
    expect(mockHandleAuthenticationErrorAction).toHaveBeenCalledTimes(1);
    expect(mockHandleAuthenticationErrorAction).toHaveBeenCalledWith(
      mockReduxDispatchHandler,
      rootStackNavigationMock
    );
  });

  it('should call handleCommonErrorAction for errors other than Twillio and Athentication error', async () => {
    mockSendOneTimePassword.mockImplementation(() => {
      throw new Error(ErrorConstants.errorInSendingOneTimePassword);
    });

    const argsMock: ISendOneTimePasswordAsyncActionArgs = {
      phoneNumber: phoneNumberMock,
      navigation: rootStackNavigationMock,
    };
    const actionDispatcher = sendOneTimePasswordAction(argsMock);
    await actionDispatcher(mockReduxDispatchHandler, mockGetState);
    expect(mockHandleCommonErrorAction).toHaveBeenCalledTimes(1);
    expect(mockHandleCommonErrorAction).toHaveBeenCalledWith(
      rootStackNavigationMock,
      ErrorConstants.errorInSendingOneTimePassword,
      new Error(ErrorConstants.errorInSendingOneTimePassword)
    );
  });
});

describe('verifyCodeAction', () => {
  const mockState: RootState = {
    config: {
      apis: {
        guestExperienceApi: {
          env: {
            host: '127.0.0.1',
            port: '4300',
            protocol: 'https',
            version: 'v1',
            url: '/api',
          },
          paths: {
            verifyOneTimePassword: '/one-time-password/verify',
          },
        },
      },
    } as unknown,
    features: {},
    phoneLogin: {},
    phoneVerification: {},
    settings: {
      lastZipCode: 'unknown',
      token: 'unknown',
      automationToken: 'automation-token',
    } as ISettings,
    telemetry: {
      memberInfoRequestId: 'memberInfoRequestId',
    },
  } as RootState;

  const mockGetState = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetState.mockReturnValue(mockState);
  });

  it('should dispatch isIncorrectCode flag as false and reset code and loadMemberContactInfoScreenAction if status is success and prescription identifier is not present', async () => {
    mockVerifyOneTimePassword.mockResolvedValueOnce({
      data: {
        token: 'fake-token',
      },
      message: 'OneTimePassword verification is successful',
      status: 'success',
    });

    const argsMock: IVerificationCodeActionParams = {
      phoneNumber: phoneNumberMock,
      verificationCode: verificationCodeMock,
      navigation: rootStackNavigationMock,
    };
    const actionDispatcher = verifyCodeAction(argsMock);
    await actionDispatcher(mockReduxDispatchHandler, mockGetState);
    expect(mockReduxDispatchHandler.mock.calls[0][0]).toMatchObject({
      payload: {
        verificationCode: verificationCodeMock,
      },
      type: PhoneNumberVerificationActionsKeys.SET_VERIFICATION_CODE,
    });
  });

  it('should dispatch isIncorrectCode flag as false and reset code and loadMemberContactInfoScreenAction if status is success and prescription identifier is present', async () => {
    mockVerifyOneTimePassword.mockResolvedValueOnce({
      data: {
        token: 'fake-token',
      },
      message: 'OneTimePassword verification is successful',
      status: 'success',
    });
    const prescriptionIdMock = 'test-prescription-id';

    const actionDispatcher = verifyCodeAction({
      phoneNumber: phoneNumberMock,
      verificationCode: verificationCodeMock,
      prescriptionId: prescriptionIdMock,
    } as IVerificationCodeActionParams);
    await actionDispatcher(mockReduxDispatchHandler, mockGetState);
    expect(mockReduxDispatchHandler.mock.calls[0][0]).toMatchObject({
      payload: {
        verificationCode: verificationCodeMock,
      },
      type: PhoneNumberVerificationActionsKeys.SET_VERIFICATION_CODE,
    });
  });

  it('mockVerifyOneTimePassword to be called with config, token , phone number ', async () => {
    const argsMock: IVerificationCodeActionParams = {
      phoneNumber: phoneNumberMock,
      verificationCode: verificationCodeMock,
      navigation: rootStackNavigationMock,
    };
    const actionDispatcher = verifyCodeAction(argsMock);
    await actionDispatcher(mockReduxDispatchHandler, mockGetState);
    expect(mockVerifyOneTimePassword).toHaveBeenCalledTimes(1);
    expect(mockVerifyOneTimePassword).toHaveBeenCalledWith(
      mockState.config.apis.guestExperienceApi,
      verificationCodeMock,
      phoneMockWithCountryCode,
      'automation-token'
    );
  });

  it('mockVerifyOneTimePassword to be called without duplicate country code in phone number ', async () => {
    const actionDispatcher = verifyCodeAction({
      navigation: rootStackNavigationMock,
      verificationCode: verificationCodeMock,
      phoneNumber: phoneMockWithCountryCode,
    });
    await actionDispatcher(mockReduxDispatchHandler, mockGetState);
    expect(mockVerifyOneTimePassword).toHaveBeenCalledTimes(1);
    expect(mockVerifyOneTimePassword).toHaveBeenCalledWith(
      mockState.config.apis.guestExperienceApi,
      verificationCodeMock,
      phoneMockWithCountryCode,
      'automation-token'
    );
  });

  it('mockVerifyOneTimePassword to be called with countrycode, config, token , phone number ', async () => {
    const mockStateCountryCode: RootState = {
      config: {
        apis: {
          guestExperienceApi: {
            env: {
              host: '127.0.0.1',
              port: '4300',
              protocol: 'https',
              version: 'v1',
              url: '/api',
            },
            paths: {
              verifyOneTimePassword: '/one-time-password/verify',
            },
          },
        },
      } as unknown,
      features: { usecountrycode: true },
      phoneLogin: {},
      phoneVerification: {},
      settings: {
        lastZipCode: 'unknown',
        token: 'unknown',
        automationToken: undefined,
      } as ISettings,
      telemetry: {
        memberInfoRequestId: 'memberInfoRequestId',
      },
    } as RootState;
    mockGetState.mockReturnValueOnce(mockStateCountryCode);

    const argsMock: IVerificationCodeActionParams = {
      phoneNumber: phoneNumberMock,
      verificationCode: verificationCodeMock,
      navigation: rootStackNavigationMock,
    };
    const actionDispatcher = verifyCodeAction(argsMock);

    await actionDispatcher(mockReduxDispatchHandler, mockGetState);
    expect(mockVerifyOneTimePassword).toHaveBeenCalledTimes(1);
    expect(mockVerifyOneTimePassword).toHaveBeenCalledWith(
      mockState.config.apis.guestExperienceApi,
      verificationCodeMock,
      phoneMockWithAlternateCountryCode,
      undefined
    );
  });

  it('should call handleTwilioErrorAction when TooManyRequestError is thrown', async () => {
    mockVerifyOneTimePassword.mockImplementation(() => {
      throw new ErrorTwilioService(
        ErrorConstants.errorTwilioMaxVerifyCodeAttempts
      );
    });

    const argsMock: IVerificationCodeActionParams = {
      phoneNumber: phoneNumberMock,
      verificationCode: verificationCodeMock,
      navigation: rootStackNavigationMock,
    };
    const actionDispatcher = verifyCodeAction(argsMock);
    await actionDispatcher(mockReduxDispatchHandler, mockGetState);
    expect(mockHandleTwillioErrorAction).toHaveBeenCalledTimes(1);
    expect(mockHandleTwillioErrorAction).toHaveBeenCalledWith(
      mockReduxDispatchHandler,
      rootStackNavigationMock,
      ErrorConstants.errorTwilioMaxVerifyCodeAttempts,
      'LogoutAndStartOverAtLogin'
    );
  });

  it('should call handleAuthenticationErrorAction, when ErrorInvalidAuthToken is thrown', async () => {
    mockVerifyOneTimePassword.mockImplementation(() => {
      throw new ErrorInvalidAuthToken(ErrorConstants.errorInvalidAuthToken);
    });

    const argsMock: IVerificationCodeActionParams = {
      phoneNumber: phoneNumberMock,
      verificationCode: verificationCodeMock,
      navigation: rootStackNavigationMock,
    };
    const actionDispatcher = verifyCodeAction(argsMock);
    await actionDispatcher(mockReduxDispatchHandler, mockGetState);
    expect(mockHandleAuthenticationErrorAction).toHaveBeenCalledTimes(1);
    expect(mockHandleAuthenticationErrorAction).toHaveBeenCalledWith(
      mockReduxDispatchHandler,
      rootStackNavigationMock
    );
  });

  it('should dispatch isIncorrectCode flag as true if error other than TooManyRequestError is thrown ', async () => {
    mockVerifyOneTimePassword.mockImplementation(() => {
      throw new Error('Error');
    });

    const argsMock: IVerificationCodeActionParams = {
      phoneNumber: phoneNumberMock,
      verificationCode: verificationCodeMock,
      navigation: rootStackNavigationMock,
    };
    const actionDispatcher = verifyCodeAction(argsMock);
    await actionDispatcher(mockReduxDispatchHandler, mockGetState);
    expect(mockReduxDispatchHandler.mock.calls[0][0]).toMatchObject({
      payload: {
        verificationCode: verificationCodeMock,
      },
      type: PhoneNumberVerificationActionsKeys.SET_VERIFICATION_CODE,
    });
    expect(mockReduxDispatchHandler.mock.calls[1][0]).toMatchObject({
      payload: {
        isIncorrectCode: true,
      },
      type: PhoneNumberVerificationActionsKeys.SET_VERIFICATION_CODE_ERROR_STATE,
    });
  });

  it('should navigate to SupportErrorScreen with error message when ErrorApiResponse is thrown', async () => {
    mockVerifyOneTimePassword.mockImplementation(() => {
      throw new ErrorApiResponse(ErrorConstants.errorInternalServer());
    });

    const argsMock: IVerificationCodeActionParams = {
      phoneNumber: phoneNumberMock,
      verificationCode: verificationCodeMock,
      navigation: rootStackNavigationMock,
    };
    const actionDispatcher = verifyCodeAction(argsMock);
    await actionDispatcher(mockReduxDispatchHandler, mockGetState);
    expect(mockSetMissingAccountErrorMessageAction).toHaveBeenCalledWith(
      ErrorConstants.errorInternalServer(),
      'LogoutAndStartOverAtLogin'
    );
    expect(rootStackNavigationMock.navigate).toHaveBeenCalledWith(
      'SupportError'
    );
  });
});

describe('sendOneTimePasswordLoadingAction', () => {
  it('calls data loading action', () => {
    const dataLoadingResponseMock = 'response-mock';
    dataLoadingActionMock.mockReturnValue(dataLoadingResponseMock);

    const argsMock: ISendOneTimePasswordAsyncActionArgs = {
      phoneNumber: phoneNumberMock,
      navigation: rootStackNavigationMock,
    };
    const response = sendOneTimePasswordLoadingAction(argsMock);
    expect(dataLoadingActionMock).toHaveBeenCalledWith(
      sendOneTimePasswordAction,
      argsMock
    );
    expect(response).toEqual(dataLoadingResponseMock);
  });
});

describe('verifyCodeLoadingAction', () => {
  it('calls data loading action', () => {
    const dataLoadingResponseMock = 'response-mock';
    dataLoadingActionMock.mockReturnValue(dataLoadingResponseMock);

    const argsMock: IVerificationCodeActionParams = {
      verificationCode: verificationCodeMock,
      phoneNumber: phoneNumberMock,
      workflow: workflowMock,
      navigation: rootStackNavigationMock,
    };
    const response = verifyCodeLoadingAction(argsMock);

    expect(dataLoadingActionMock).toHaveBeenCalledWith(verifyCodeAction, {
      phoneNumber: phoneNumberMock,
      verificationCode: verificationCodeMock,
      workflow: workflowMock,
      navigation: rootStackNavigationMock,
    });
    expect(response).toEqual(dataLoadingResponseMock);
  });
});

describe('dispatchResetVerificationCodeAction', () => {
  it('should set verification code as undefined', () => {
    dispatchResetVerificationCodeAction(mockReduxDispatchHandler);
    expect(mockReduxDispatchHandler).toHaveBeenCalledWith({
      payload: { verificationCode: undefined },
      type: PhoneNumberVerificationActionsKeys.SET_VERIFICATION_CODE,
    });
  });
});

describe('verifyCodeAction', () => {
  const mockState: RootState = {
    config: {
      apis: {
        guestExperienceApi: {
          env: {
            host: '127.0.0.1',
            port: '4300',
            protocol: 'https',
            version: 'v1',
            url: '/api',
          },
          paths: {
            verifyOneTimePassword: '/one-time-password/verify',
          },
        },
      },
    } as unknown,
    features: {},
    phoneLogin: {},
    phoneVerification: {},
    settings: {
      lastZipCode: 'unknown',
      token: 'unknown',
      automationToken: 'automation-token',
    } as ISettings,
    telemetry: {
      memberInfoRequestId: 'memberInfoRequestId',
    },
  } as RootState;

  const mockGetState = jest.fn().mockReturnValue(mockState);

  it('should call verifyOneTimePassword api ', async () => {
    const actionDispatcher = verifyCodeAction({
      verificationCode: verificationCodeMock,
      phoneNumber: phoneNumberMock,
      navigation: rootStackNavigationMock,
    });
    await actionDispatcher(mockReduxDispatchHandler, mockGetState);
    expect(mockVerifyOneTimePassword).toHaveBeenCalledTimes(1);
    expect(mockVerifyOneTimePassword).toHaveBeenNthCalledWith(
      1,
      mockState.config.apis.guestExperienceApi,
      verificationCodeMock,
      phoneMockWithCountryCode,
      'automation-token'
    );
  });

  it('should call verifyOneTimePassword api without adding double country code', async () => {
    const actionDispatcher = verifyCodeAction({
      navigation: rootStackNavigationMock,
      verificationCode: verificationCodeMock,
      phoneNumber: phoneMockWithCountryCode,
    });
    await actionDispatcher(mockReduxDispatchHandler, mockGetState);
    expect(mockVerifyOneTimePassword).toHaveBeenCalledTimes(1);
    expect(mockVerifyOneTimePassword).toHaveBeenNthCalledWith(
      1,
      mockState.config.apis.guestExperienceApi,
      verificationCodeMock,
      phoneMockWithCountryCode,
      'automation-token'
    );
  });

  it('should navigate to createPinScreen when response is successful and responseCode is REQUIRE_USER_SET_PIN', async () => {
    mockVerifyOneTimePassword.mockReturnValueOnce({
      data: {
        deviceToken: 'fake-device-token',
      },
      responseCode: InternalResponseCode.REQUIRE_USER_SET_PIN,
    });
    const actionDispatcher = verifyCodeAction({
      verificationCode: verificationCodeMock,
      phoneNumber: phoneNumberMock,
      navigation: rootStackNavigationMock,
    });
    await actionDispatcher(mockReduxDispatchHandler, mockGetState);
    const expectedCreatePinParams: ICreatePinScreenRouteProps = {};
    expect(rootStackNavigationMock.navigate).toHaveBeenCalledTimes(1);
    expect(rootStackNavigationMock.navigate).toHaveBeenNthCalledWith(
      1,
      'CreatePin',
      expectedCreatePinParams
    );
  });

  it('should navigate to loginPinScreen when response is successful and responseCode is REQUIRE_USER_VERIFY_PIN', async () => {
    mockVerifyOneTimePassword.mockReturnValueOnce({
      data: {
        deviceToken: 'fake-device-token',
        recoveryEmailExists: true,
      },
      responseCode: InternalResponseCode.REQUIRE_USER_VERIFY_PIN,
    });
    const actionDispatcher = verifyCodeAction({
      verificationCode: verificationCodeMock,
      phoneNumber: phoneNumberMock,
      navigation: rootStackNavigationMock,
    });
    await actionDispatcher(mockReduxDispatchHandler, mockGetState);
    expect(rootStackNavigationMock.navigate).toHaveBeenCalledTimes(1);
    expect(rootStackNavigationMock.navigate).toHaveBeenNthCalledWith(
      1,
      'LoginPin',
      {}
    );
  });

  it('should navigate to loginScreen when response is successful and responseCode is REQUIRE_USER_REGISTRATION', async () => {
    mockVerifyOneTimePassword.mockReturnValueOnce({
      data: {
        deviceToken: 'fake-device-token',
      },
      responseCode: InternalResponseCode.REQUIRE_USER_REGISTRATION,
    });
    const actionDispatcher = await verifyCodeAction({
      verificationCode: '123456',
      phoneNumber: phoneNumberMock,
      navigation: rootStackNavigationMock,
    });
    await actionDispatcher(mockReduxDispatchHandler, mockGetState);
    expect(rootStackNavigationMock.navigate).toHaveBeenCalledTimes(1);
    expect(rootStackNavigationMock.navigate).toHaveBeenNthCalledWith(
      1,
      'Login',
      {}
    );
  });
  it('should navigate to pinFeatureWelcomeScreen when response is successful and responseCode is REQUIRE_USER_SHOW_PIN_FEATURE_WELCOME_SCREEN', async () => {
    mockVerifyOneTimePassword.mockReturnValueOnce({
      data: {
        deviceToken: 'fake-device-token',
        recoveryEmailExists: true,
      },
      responseCode:
        InternalResponseCode.REQUIRE_USER_SHOW_PIN_FEATURE_WELCOME_SCREEN,
    });
    const actionDispatcher = verifyCodeAction({
      verificationCode: verificationCodeMock,
      phoneNumber: phoneNumberMock,
      navigation: rootStackNavigationMock,
    });
    await actionDispatcher(mockReduxDispatchHandler, mockGetState);
    expect(rootStackNavigationMock.navigate).toHaveBeenCalledTimes(1);
    expect(rootStackNavigationMock.navigate).toHaveBeenNthCalledWith(
      1,
      'PinFeatureWelcome',
      {}
    );
  });
});

describe('dispatchVerifyCodeActionError', () => {
  it('should call handleTwilioErrorAction when there is ErrorTwilioService', async () => {
    const error = new ErrorTwilioService('twilio error');
    await dispatchVerifyCodeActionError(
      error,
      mockReduxDispatchHandler,
      rootStackNavigationMock
    );
    expect(mockHandleTwillioErrorAction).toHaveBeenCalledTimes(1);
    expect(mockHandleTwillioErrorAction).toHaveBeenNthCalledWith(
      1,
      mockReduxDispatchHandler,
      rootStackNavigationMock,
      error.message,
      'LogoutAndStartOverAtLogin'
    );
  });

  it('should call handleAuthenticationErrorAction when there is ErrorInvalidAuthToken', async () => {
    const error = new ErrorInvalidAuthToken('invalid auth error');
    await dispatchVerifyCodeActionError(
      error,
      mockReduxDispatchHandler,
      rootStackNavigationMock
    );
    expect(mockHandleAuthenticationErrorAction).toHaveBeenCalledTimes(1);
    expect(mockHandleAuthenticationErrorAction).toHaveBeenNthCalledWith(
      1,
      mockReduxDispatchHandler,
      rootStackNavigationMock
    );
  });

  it('should dispatch setMissingAccountErrorMessageAction and should navigate to supportErrorScreen when there is ErrorApiResponse', async () => {
    const error = new ErrorApiResponse('api error');
    await dispatchVerifyCodeActionError(
      error,
      mockReduxDispatchHandler,
      rootStackNavigationMock
    );
    expect(mockSetMissingAccountErrorMessageAction).toHaveBeenCalledTimes(1);
    expect(mockSetMissingAccountErrorMessageAction).toHaveBeenNthCalledWith(
      1,
      error.message,
      'LogoutAndStartOverAtLogin'
    );
    expect(rootStackNavigationMock.navigate).toHaveBeenCalledTimes(1);
    expect(rootStackNavigationMock.navigate).toHaveBeenNthCalledWith(
      1,
      'SupportError'
    );
  });

  it('should call dispatchVerificationCodeErrorState when no matching error is found', async () => {
    const phoneNumberVerificationActions = jest.requireActual(
      './phone-number-verification-reducer.actions'
    );
    phoneNumberVerificationActions.dispatchVerificationCodeErrorState =
      jest.fn();
    const error = new Error('default error');
    await phoneNumberVerificationActions.dispatchVerifyCodeActionError(
      error,
      mockReduxDispatchHandler
    );
    expect(
      phoneNumberVerificationActions.dispatchVerificationCodeErrorState
    ).toHaveBeenCalledTimes(1);
    expect(
      phoneNumberVerificationActions.dispatchVerificationCodeErrorState
    ).toHaveBeenNthCalledWith(1, mockReduxDispatchHandler, true);
  });
});

describe('getRedirectScreenIfNotReady', () => {
  it('should return createPinScreen when response code is REQUIRE_USER_SET_PIN', () => {
    expect(
      getRedirectScreenIfNotReady(InternalResponseCode.REQUIRE_USER_SET_PIN)
    ).toBe('CreatePin');
  });

  it('should return loginPinScreen when response code is REQUIRE_USER_VERIFY_PIN', () => {
    expect(
      getRedirectScreenIfNotReady(InternalResponseCode.REQUIRE_USER_VERIFY_PIN)
    ).toBe('LoginPin');
  });

  it('should return loginScreen when response code is REQUIRE_USER_REGISTRATION', () => {
    expect(
      getRedirectScreenIfNotReady(
        InternalResponseCode.REQUIRE_USER_REGISTRATION
      )
    ).toBe('Login');
  });

  it('should return loginScreen when response code is REQUIRE_USER_REGISTRATION', () => {
    expect(
      getRedirectScreenIfNotReady(
        InternalResponseCode.REQUIRE_USER_SHOW_PIN_FEATURE_WELCOME_SCREEN
      )
    ).toBe('PinFeatureWelcome');
  });

  it('should return AccountLocked when response code is SHOW_ACCOUNT_LOCKED', () => {
    expect(
      getRedirectScreenIfNotReady(InternalResponseCode.SHOW_ACCOUNT_LOCKED)
    ).toBe('AccountLocked');
  });

  it('should return undefined when response code does not match', () => {
    expect(getRedirectScreenIfNotReady(123)).toBeUndefined();
  });
});

describe('dispatchVerifyCodeResponse', () => {
  const state = {
    config: {
      apis: {
        guestExperienceApi: {
          env: {
            host: '127.0.0.1',
            port: '4300',
            protocol: 'https',
            version: 'v1',
            url: '/api',
          },
        },
      },
    },
    phoneLogin: {},
    phoneVerification: {},
    features: {},
    settings: {
      automationToken: 'automation-token',
    } as ISettings,
  } as unknown as RootState;

  it('should call verifyOneTimePassword', async () => {
    const phoneNumberVerificationActions = jest.requireActual(
      './phone-number-verification-reducer.actions'
    );
    phoneNumberVerificationActions.getRedirectScreenIfNotReady = jest
      .fn()
      .mockReturnValue('Login');
    mockVerifyOneTimePassword.mockReturnValue({
      data: {
        token: 'fake-token',
      },
      memberInfoRequestId: 'fake-memberInfoRequestId',
    });
    await dispatchVerifyCodeResponse(mockReduxDispatchHandler, state, {
      verificationCode: verificationCodeMock,
      phoneNumber: phoneNumberMock,
      navigation: rootStackNavigationMock,
    });
    expect(mockVerifyOneTimePassword).toHaveBeenCalledTimes(1);
    expect(mockVerifyOneTimePassword).toHaveBeenNthCalledWith(
      1,
      state.config.apis.guestExperienceApi,
      verificationCodeMock,
      phoneMockWithCountryCode,
      'automation-token'
    );
  });

  it('should not add country code when it is already present', async () => {
    const phoneNumberVerificationActions = jest.requireActual(
      './phone-number-verification-reducer.actions'
    );
    phoneNumberVerificationActions.getRedirectScreenIfNotReady = jest
      .fn()
      .mockReturnValue('Login');
    mockVerifyOneTimePassword.mockReturnValue({
      data: {
        token: 'fake-token',
      },
      memberInfoRequestId: 'fake-memberInfoRequestId',
    });
    await dispatchVerifyCodeResponse(mockReduxDispatchHandler, state, {
      navigation: rootStackNavigationMock,
      verificationCode: verificationCodeMock,
      phoneNumber: phoneMockWithCountryCode,
    });
    expect(mockVerifyOneTimePassword).toHaveBeenCalledTimes(1);
    expect(mockVerifyOneTimePassword).toHaveBeenNthCalledWith(
      1,
      state.config.apis.guestExperienceApi,
      verificationCodeMock,
      phoneMockWithCountryCode,
      'automation-token'
    );
  });

  it('should call dispatchNavigateToScreen', async () => {
    const phoneNumberVerificationActions = jest.requireActual(
      './phone-number-verification-reducer.actions'
    );
    phoneNumberVerificationActions.getRedirectScreenIfNotReady = jest
      .fn()
      .mockReturnValue('Login');
    mockVerifyOneTimePassword.mockReturnValue({
      data: {
        token: 'fake-token',
      },
      memberInfoRequestId: 'fake-memberInfoRequestId',
    });
    await dispatchVerifyCodeResponse(mockReduxDispatchHandler, state, {
      verificationCode: verificationCodeMock,
      phoneNumber: phoneNumberMock,
      navigation: rootStackNavigationMock,
    });
    expect(rootStackNavigationMock.navigate).toHaveBeenCalledTimes(1);
    expect(rootStackNavigationMock.navigate).toHaveBeenNthCalledWith(
      1,
      'Login',
      {}
    );
    expect(rootStackNavigationMock.navigate).not.toHaveBeenCalledWith(
      'CreatePin',
      {}
    );
  });

  it('should call dispatchVerificationCodeErrorState', async () => {
    const phoneNumberVerificationActions = jest.requireActual(
      './phone-number-verification-reducer.actions'
    );
    phoneNumberVerificationActions.getRedirectScreenIfNotReady = jest
      .fn()
      .mockReturnValue(undefined);
    phoneNumberVerificationActions.dispatchVerificationCodeErrorState =
      jest.fn();
    mockVerifyOneTimePassword.mockReturnValue({
      data: {
        token: 'fake-token',
      },
      memberInfoRequestId: 'fake-memberInfoRequestId',
    });
    await dispatchVerifyCodeResponse(mockReduxDispatchHandler, state, {
      verificationCode: verificationCodeMock,
      phoneNumber: phoneNumberMock,
      navigation: rootStackNavigationMock,
    });
    expect(
      phoneNumberVerificationActions.dispatchVerificationCodeErrorState
    ).toHaveBeenCalledTimes(1);
    expect(
      phoneNumberVerificationActions.dispatchVerificationCodeErrorState
    ).toHaveBeenNthCalledWith(1, mockReduxDispatchHandler, true);
  });

  it('should pass workflow prop with createPinScreen if screen is createPin', async () => {
    const phoneNumberVerificationActions = jest.requireActual(
      './phone-number-verification-reducer.actions'
    );
    phoneNumberVerificationActions.getRedirectScreenIfNotReady = jest
      .fn()
      .mockReturnValue('CreatePin');
    mockVerifyOneTimePassword.mockReturnValue({
      data: {
        token: 'fake-token',
      },
      memberInfoRequestId: 'fake-memberInfoRequestId',
    });
    await dispatchVerifyCodeResponse(mockReduxDispatchHandler, state, {
      verificationCode: verificationCodeMock,
      phoneNumber: phoneNumberMock,
      workflow: workflowMock,
      navigation: rootStackNavigationMock,
    });
  });

  it('should pass workflow prop with loginPinScreen if screen is LoginPin', async () => {
    const phoneNumberVerificationActions = jest.requireActual(
      './phone-number-verification-reducer.actions'
    );
    phoneNumberVerificationActions.getRedirectScreenIfNotReady = jest
      .fn()
      .mockReturnValue('LoginPin');
    mockVerifyOneTimePassword.mockReturnValue({
      data: {
        token: 'fake-token',
      },
      memberInfoRequestId: 'fake-memberInfoRequestId',
    });
    await dispatchVerifyCodeResponse(mockReduxDispatchHandler, state, {
      verificationCode: verificationCodeMock,
      phoneNumber: phoneNumberMock,
      workflow: workflowMock,
      navigation: rootStackNavigationMock,
    });
    const expectedParams: ICreatePinScreenRouteProps = {
      workflow: workflowMock,
    };
    expect(rootStackNavigationMock.navigate).toHaveBeenCalledWith(
      'LoginPin',
      expectedParams
    );
  });

  it('should pass expected params for CreateAccount if screen is Login', async () => {
    const phoneNumberVerificationActions = jest.requireActual(
      './phone-number-verification-reducer.actions'
    );
    phoneNumberVerificationActions.getRedirectScreenIfNotReady = jest
      .fn()
      .mockReturnValue('Login');
    mockVerifyOneTimePassword.mockReturnValue({
      data: {
        token: 'fake-token',
      },
      memberInfoRequestId: 'fake-memberInfoRequestId',
    });
    await dispatchVerifyCodeResponse(mockReduxDispatchHandler, state, {
      verificationCode: verificationCodeMock,
      phoneNumber: phoneNumberMock,
      workflow: workflowMock,
      navigation: rootStackNavigationMock,
    });

    const expectedParams: ICreateAccountScreenRouteProps = {
      workflow: workflowMock,
      phoneNumber: phoneNumberMock,
      errorType: 'noAccountWithUs',
    };
    expect(rootStackNavigationMock.navigate).toHaveBeenCalledWith(
      'CreateAccount',
      expectedParams
    );
  });

  it.each([[undefined], [true]])(
    'should pass prescriptionId to createAccountNavigateDispatch if present and if screen is login',
    async (isBlockchainMock?: boolean) => {
      const phoneNumberVerificationActions = jest.requireActual(
        './phone-number-verification-reducer.actions'
      );
      phoneNumberVerificationActions.getRedirectScreenIfNotReady = jest
        .fn()
        .mockReturnValue('Login');
      mockVerifyOneTimePassword.mockReturnValue({
        data: {
          token: 'fake-token',
        },
        memberInfoRequestId: 'fake-memberInfoRequestId',
      });

      const mockState = {
        ...state,
        features: {} as IFeaturesState,
        config: {
          ...state.config,
          location: {
            pathname: '/prescription/test-prescription-id',
          } as ILocation,
        },
      };

      getClaimAlertPrescriptionInfoMock.mockReturnValueOnce({
        prescriptionId: 'test-prescription-id',
        isBlockchain: isBlockchainMock,
      });
      await dispatchVerifyCodeResponse(mockReduxDispatchHandler, mockState, {
        navigation: rootStackNavigationMock,
        verificationCode: verificationCodeMock,
        phoneNumber: phoneNumberMock,
        workflow: workflowMock,
        prescriptionId: 'test-prescription-id',
      });
      expect(rootStackNavigationMock.navigate).toHaveBeenCalledWith(
        'CreateAccount',
        {
          workflow: workflowMock,
          phoneNumber: phoneNumberMock,
          errorType: 'noAccountWithUs',
          prescriptionId: 'test-prescription-id',
          blockchain: isBlockchainMock,
        }
      );
    }
  );
  it('should navigate to login screen with claim alert id as param when claimAlertId is passed', async () => {
    const phoneNumberVerificationActions = jest.requireActual(
      './phone-number-verification-reducer.actions'
    );
    phoneNumberVerificationActions.getRedirectScreenIfNotReady = jest
      .fn()
      .mockReturnValue('Login');
    mockVerifyOneTimePassword.mockReturnValue({
      data: {
        token: 'fake-token',
      },
      memberInfoRequestId: 'fake-memberInfoRequestId',
    });
    const mockState = {
      ...state,
      features: {} as IFeaturesState,
      config: {
        ...state.config,
        location: { pathname: 'test-claim-alert-id' } as ILocation,
      },
    };
    getClaimAlertPrescriptionInfoMock.mockReturnValueOnce({
      claimAlertId: 'test-claim-alert-id',
    });
    await dispatchVerifyCodeResponse(mockReduxDispatchHandler, mockState, {
      verificationCode: verificationCodeMock,
      phoneNumber: phoneNumberMock,
      navigation: rootStackNavigationMock,
    });
    expect(rootStackNavigationMock.navigate).toHaveBeenCalledTimes(1);
    expect(rootStackNavigationMock.navigate).toHaveBeenNthCalledWith(
      1,
      'Login',
      { claimAlertId: 'test-claim-alert-id' }
    );
  });
  it.each([[undefined], [true]])(
    'should dispatchNavigateToScreen with prescriptionId if url contains prescription id and workflow is undefined (isBlockchain: %p)',
    async (isBlockchainMock?: boolean) => {
      const phoneNumberVerificationActions = jest.requireActual(
        './phone-number-verification-reducer.actions'
      );
      phoneNumberVerificationActions.getRedirectScreenIfNotReady = jest
        .fn()
        .mockReturnValue('Login');
      mockVerifyOneTimePassword.mockReturnValue({
        data: {
          token: 'fake-token',
        },
        memberInfoRequestId: 'fake-memberInfoRequestId',
      });
      const mockState = {
        ...state,
        features: {} as IFeaturesState,
        config: {
          ...state.config,
          location: { pathname: '/prescription/prescription-id' } as ILocation,
        },
      };
      getClaimAlertPrescriptionInfoMock.mockReturnValueOnce({
        prescriptionId: 'prescription-id',
        isBlockchain: isBlockchainMock,
      });
      await dispatchVerifyCodeResponse(mockReduxDispatchHandler, mockState, {
        navigation: rootStackNavigationMock,
        verificationCode: verificationCodeMock,
        phoneNumber: phoneNumberMock,
      });
      expect(rootStackNavigationMock.navigate).toHaveBeenCalledTimes(1);
      expect(rootStackNavigationMock.navigate).toHaveBeenNthCalledWith(
        1,
        'Login',
        { prescriptionId: 'prescription-id', isBlockchain: isBlockchainMock }
      );
    }
  );
  it('should navigate to account locked screen with accountLockedResponse as true when API returns account locked response', async () => {
    const phoneNumberVerificationActions = jest.requireActual(
      './phone-number-verification-reducer.actions'
    );
    phoneNumberVerificationActions.getRedirectScreenIfNotReady = jest
      .fn()
      .mockReturnValue('AccountLocked');
    mockVerifyOneTimePassword.mockReturnValue({
      data: {
        token: 'fake-token',
      },
      memberInfoRequestId: 'fake-memberInfoRequestId',
    });
    await dispatchVerifyCodeResponse(mockReduxDispatchHandler, state, {
      verificationCode: verificationCodeMock,
      phoneNumber: phoneNumberMock,
      navigation: rootStackNavigationMock,
    });

    expect(rootStackNavigationMock.navigate).toHaveBeenCalledTimes(1);
    expect(rootStackNavigationMock.navigate).toHaveBeenNthCalledWith(
      1,
      'AccountLocked',
      { accountLockedResponse: true }
    );
  });
});
