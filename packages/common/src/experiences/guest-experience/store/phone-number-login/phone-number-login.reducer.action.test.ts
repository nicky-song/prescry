// Copyright 2018 Prescryptive Health, Inc.

import { ErrorBadRequest } from '../../../../errors/error-bad-request';
import { ErrorInternalServer } from '../../../../errors/error-internal-server';
import { TooManyRequestError } from '../../../../errors/error-too-many-requests';
import { PhoneNumberDialingCode } from '../../../../theming/constants';
import { sendOneTimePassword } from '../../api/api-v1';
import { guestExperienceExceptionLogger } from '../../guest-experience-logger.middleware';
import { handleTwilioErrorAction } from '../../store/error-handling.actions';
import { internalErrorDispatch } from '../error-handling/dispatch/internal-error.dispatch';
import { dataLoadingAction } from '../modal-popup/modal-popup.reducer.actions';
import { RootState } from '../root-reducer';
import { phoneNumberVerificationNavigateDispatch } from '../navigation/dispatch/sign-in/phone-number-verification-navigate.dispatch';
import {
  navigateToPhoneNumberVerification,
  navigateToPhoneNumberVerificationLoadingAction,
  onSetPhoneNumberAction,
  onUnsupportedPhoneNumberTypeAction,
  PhoneNumberLoginActionsKeys,
  updatePhoneNumberWithCountryCodeAction,
} from './phone-number-login.reducer.action';
import { Workflow } from '../../../../models/workflow';
import { rootStackNavigationMock } from '../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';

jest.mock(
  '../navigation/dispatch/sign-in/phone-number-verification-navigate.dispatch'
);

jest.mock('../../api/api-v1', () => ({
  sendOneTimePassword: jest.fn(),
}));

jest.mock('../../guest-experience-logger.middleware', () => ({
  guestExperienceExceptionLogger: jest.fn(),
}));

jest.mock('../../store/error-handling.actions', () => ({
  handleTwilioErrorAction: jest.fn(),
}));

jest.mock('../error-handling/dispatch/internal-error.dispatch');

jest.mock('../modal-popup/modal-popup.reducer.actions', () => ({
  dataLoadingAction: jest.fn(),
}));

const mockReduxDispatchHandler = jest.fn();
const phoneVerificationNavigateDispatchMock =
  phoneNumberVerificationNavigateDispatch as jest.Mock;
const mockSendOneTimePassword = sendOneTimePassword as jest.Mock;
const mockGuestExperienceExceptionLogger =
  guestExperienceExceptionLogger as jest.Mock;
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
      },
    },
  },
  features: {},
  phoneLogin: {},
  settings: {},
} as unknown as RootState;
const mockGetState = jest.fn().mockReturnValue(mockState);
const mockInternalErrorDispatch = internalErrorDispatch as jest.Mock;
const mockHandleTwilioErrorAction = handleTwilioErrorAction as jest.Mock;
const mockDataLoadingAction = dataLoadingAction as jest.Mock;

beforeEach(() => {
  mockReduxDispatchHandler.mockReset();
  phoneVerificationNavigateDispatchMock.mockReset();
  mockSendOneTimePassword.mockReset();
  mockInternalErrorDispatch.mockReset();
  mockHandleTwilioErrorAction.mockReset();
  mockDataLoadingAction.mockReset();
});
const phoneNumberMock = '1234567890';
const phoneMockWithCountryCode = '+11234567890';
const phoneMockWithAlternateCountryCode = '+911234567890';
describe('onSetPhoneNumberAction', () => {
  it('should issue SET_LOGIN_PHONE_NUMBER action with phone number ', () => {
    const registeredNumber = {
      phoneNumber: '1234567890',
    };
    const action = onSetPhoneNumberAction(registeredNumber.phoneNumber);
    expect(action).toMatchObject({
      payload: registeredNumber,
      type: PhoneNumberLoginActionsKeys.SET_LOGIN_PHONE_NUMBER,
    });
  });
});

describe('onUnsupportedPhoneNumberTypeAction', () => {
  it('should issue SET_NUMBER_IS_UNSUPPORTED action with boolean value ', () => {
    const action = onUnsupportedPhoneNumberTypeAction(true);
    expect(action).toMatchObject({
      payload: { phoneNumberTypeIsUnsupported: true },
      type: PhoneNumberLoginActionsKeys.SET_NUMBER_IS_UNSUPPORTED,
    });
  });
});

describe('updatePhoneNumberWithCountryCodeAction', () => {
  it('should issue SET_LOGIN_PHONE_NUMBER action with phone number and country code ', () => {
    const countryCode = '+1';

    const action = updatePhoneNumberWithCountryCodeAction(
      countryCode,
      phoneNumberMock
    );
    expect(action).toMatchObject({
      payload: {
        phoneNumber: `${countryCode}${phoneNumberMock}`,
      },
      type: PhoneNumberLoginActionsKeys.SET_LOGIN_PHONE_NUMBER,
    });
  });
});

describe('navigateToPhoneNumberVerification', () => {
  it('should call updatePhoneNumberWithCountryCodeAction if phone length is equal to 10', async () => {
    const phonNumberLoginReducer = jest.requireActual(
      './phone-number-login.reducer.action'
    );

    phonNumberLoginReducer.updatePhoneNumberWithCountryCodeAction = jest.fn();

    const actionDispatcher = navigateToPhoneNumberVerification({
      phoneNumber: phoneNumberMock,
      navigation: rootStackNavigationMock,
    });
    await actionDispatcher(mockReduxDispatchHandler, mockGetState);

    expect(updatePhoneNumberWithCountryCodeAction).toHaveBeenCalledWith(
      PhoneNumberDialingCode,
      phoneNumberMock
    );
  });

  it.each([[undefined], [true]])(
    'should not call updatePhoneNumberWithCountryCodeAction if country code is already present in the reducer (isBlockchain: %p)',
    async (isBlockchainMock?: boolean) => {
      const mockStateWithCode: RootState = {
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
        features: {},
        phoneLogin: {},
        settings: {
          automationToken: 'automation-token',
        },
      } as unknown as RootState;

      mockGetState.mockReturnValueOnce(mockStateWithCode);
      const phonNumberLoginReducer = jest.requireActual(
        './phone-number-login.reducer.action'
      );

      phonNumberLoginReducer.updatePhoneNumberWithCountryCodeAction = jest.fn();
      const actionDispatcher = navigateToPhoneNumberVerification({
        phoneNumber: phoneMockWithCountryCode,
        navigation: rootStackNavigationMock,
        isBlockchain: isBlockchainMock,
      });
      await actionDispatcher(mockReduxDispatchHandler, mockGetState);

      expect(updatePhoneNumberWithCountryCodeAction).not.toBeCalled();
      expect(mockSendOneTimePassword).toBeCalledWith(
        mockStateWithCode.config.apis.guestExperienceApi,
        phoneMockWithCountryCode,
        mockStateWithCode.settings.automationToken,
        isBlockchainMock
      );
    }
  );

  it('should call SendOneTimePassword api with phoneNumberWithCode and navigate user to phoneVerificationScreen', async () => {
    const phonNumberLoginReducer = jest.requireActual(
      './phone-number-login.reducer.action'
    );

    phonNumberLoginReducer.updatePhoneNumberWithCountryCodeAction = jest.fn();

    const actionDispatcher = navigateToPhoneNumberVerification({
      phoneNumber: phoneNumberMock,
      navigation: rootStackNavigationMock,
    });
    await actionDispatcher(mockReduxDispatchHandler, mockGetState);

    expect(updatePhoneNumberWithCountryCodeAction).toHaveBeenCalledWith(
      PhoneNumberDialingCode,
      phoneNumberMock
    );

    expect(mockSendOneTimePassword).toHaveBeenNthCalledWith(
      1,
      mockState.config.apis.guestExperienceApi,
      phoneMockWithCountryCode,
      undefined,
      undefined
    );
    expect(phoneVerificationNavigateDispatchMock).toHaveBeenCalledWith(
      rootStackNavigationMock,
      {
        account: {
          firstName: '',
          lastName: '',
          dateOfBirth: '',
          phoneNumber: '',
          email: '',
          isTermAccepted: false,
          prescriptionId: undefined,
        },
        phoneNumber: phoneNumberMock,
        workflow: undefined,
      }
    );
  });

  it('should call SendOneTimePassword api with phoneNumberWithCode and navigate user to phoneVerificationScreen with workflow props if passed', async () => {
    const phonNumberLoginReducer = jest.requireActual(
      './phone-number-login.reducer.action'
    );
    const workflow: Workflow = 'prescriptionTransfer';
    phonNumberLoginReducer.updatePhoneNumberWithCountryCodeAction = jest.fn();

    const actionDispatcher = navigateToPhoneNumberVerification({
      phoneNumber: phoneNumberMock,
      workflow,
      navigation: rootStackNavigationMock,
    });
    await actionDispatcher(mockReduxDispatchHandler, mockGetState);

    expect(updatePhoneNumberWithCountryCodeAction).toHaveBeenCalledWith(
      PhoneNumberDialingCode,
      phoneNumberMock
    );

    expect(mockSendOneTimePassword).toHaveBeenNthCalledWith(
      1,
      mockState.config.apis.guestExperienceApi,
      phoneMockWithCountryCode,
      undefined,
      undefined
    );
    expect(phoneVerificationNavigateDispatchMock).toHaveBeenCalledWith(
      rootStackNavigationMock,
      {
        account: {
          firstName: '',
          lastName: '',
          dateOfBirth: '',
          phoneNumber: '',
          email: '',
          isTermAccepted: false,
          prescriptionId: undefined,
        },
        phoneNumber: phoneNumberMock,
        workflow,
      }
    );
  });
  it('should navigate user correctly for prescription invite flow', async () => {
    const phonNumberLoginReducer = jest.requireActual(
      './phone-number-login.reducer.action'
    );
    const workflow: Workflow = 'prescriptionTransfer';
    const prescriptionIdMock = 'test-prescription-id';
    phonNumberLoginReducer.updatePhoneNumberWithCountryCodeAction = jest.fn();

    const actionDispatcher = navigateToPhoneNumberVerification({
      navigation: rootStackNavigationMock,
      phoneNumber: phoneNumberMock,
      workflow,
      prescriptionId: prescriptionIdMock,
    });
    await actionDispatcher(mockReduxDispatchHandler, mockGetState);

    expect(updatePhoneNumberWithCountryCodeAction).toHaveBeenCalledWith(
      PhoneNumberDialingCode,
      phoneNumberMock
    );

    expect(mockSendOneTimePassword).toHaveBeenNthCalledWith(
      1,
      mockState.config.apis.guestExperienceApi,
      phoneMockWithCountryCode,
      undefined,
      undefined
    );
    expect(phoneVerificationNavigateDispatchMock).toHaveBeenCalledWith(
      rootStackNavigationMock,
      {
        account: {
          firstName: '',
          lastName: '',
          dateOfBirth: '',
          phoneNumber: '',
          email: '',
          isTermAccepted: false,
          prescriptionId: prescriptionIdMock,
        },
        phoneNumber: phoneNumberMock,
        workflow,
      }
    );
  });

  it('should dispatch onUnsupportedPhoneNumberTypeAction and guestExperienceExceptionLogger for Bad Request errors ', async () => {
    const error = new ErrorBadRequest('invalid phone number');
    mockSendOneTimePassword.mockImplementation(() => {
      throw error;
    });

    const phonNumberLoginReducer = jest.requireActual(
      './phone-number-login.reducer.action'
    );

    phonNumberLoginReducer.updatePhoneNumberWithCountryCodeAction = jest.fn();

    const actionDispatcher = navigateToPhoneNumberVerification({
      phoneNumber: phoneNumberMock,
      navigation: rootStackNavigationMock,
    });
    await actionDispatcher(mockReduxDispatchHandler, mockGetState);

    expect(mockGuestExperienceExceptionLogger).toHaveBeenNthCalledWith(
      1,
      error
    );
    expect(mockReduxDispatchHandler).toHaveBeenNthCalledWith(2, {
      payload: { phoneNumberTypeIsUnsupported: false },
      type: PhoneNumberLoginActionsKeys.SET_NUMBER_IS_UNSUPPORTED,
    });
    expect(mockReduxDispatchHandler).toHaveBeenNthCalledWith(3, {
      payload: { phoneNumberTypeIsUnsupported: true },
      type: PhoneNumberLoginActionsKeys.SET_NUMBER_IS_UNSUPPORTED,
    });
  });

  it('should call handleTwilioErrorAction if api returns TooManyRequestError ', async () => {
    const errorTooManyAttempts = new TooManyRequestError('too many attempts');
    mockSendOneTimePassword.mockImplementation(() => {
      throw errorTooManyAttempts;
    });
    const actionDispatcher = navigateToPhoneNumberVerification({
      phoneNumber: phoneNumberMock,
      navigation: rootStackNavigationMock,
    });
    await actionDispatcher(mockReduxDispatchHandler, mockGetState);
    expect(mockHandleTwilioErrorAction).toHaveBeenNthCalledWith(
      1,
      mockReduxDispatchHandler,
      rootStackNavigationMock,
      errorTooManyAttempts.message
    );
    expect(mockReduxDispatchHandler).toHaveBeenNthCalledWith(2, {
      payload: { phoneNumberTypeIsUnsupported: false },
      type: PhoneNumberLoginActionsKeys.SET_NUMBER_IS_UNSUPPORTED,
    });
  });

  it('should call internalErrorDispatch if api returns other Errors ', async () => {
    const internalServerError = new ErrorInternalServer(
      'internal server error'
    );
    mockSendOneTimePassword.mockImplementation(() => {
      throw internalServerError;
    });
    const actionDispatcher = navigateToPhoneNumberVerification({
      phoneNumber: phoneNumberMock,
      navigation: rootStackNavigationMock,
    });
    await actionDispatcher(mockReduxDispatchHandler, mockGetState);

    expect(mockInternalErrorDispatch).toHaveBeenNthCalledWith(
      1,
      rootStackNavigationMock,
      internalServerError
    );
  });

  it('should call SendOneTimePassword with other country code when usecountrycode is true', async () => {
    const state = {
      ...mockState,
      features: {
        usecountrycode: true,
      },
      phoneLogin: {},
      settings: {
        automationToken: 'automation-token',
      },
    };
    mockGetState.mockReturnValue(state);
    const actionDispatcher = navigateToPhoneNumberVerification({
      phoneNumber: phoneNumberMock,
      navigation: rootStackNavigationMock,
    });
    await actionDispatcher(mockReduxDispatchHandler, mockGetState);
    expect(mockSendOneTimePassword).toHaveBeenCalledTimes(1);
    expect(mockSendOneTimePassword).toHaveBeenCalledWith(
      state.config.apis.guestExperienceApi,
      phoneMockWithAlternateCountryCode,
      'automation-token',
      undefined
    );
  });
});

describe('navigateToPhoneNumberVerificationLoadingAction', () => {
  it('should call dataLoadingAction with navigateToPhoneNumberVerification and null', async () => {
    const loginReducer = jest.requireActual(
      './phone-number-login.reducer.action'
    );

    loginReducer.navigateToPhoneNumberVerification = jest.fn();
    await navigateToPhoneNumberVerificationLoadingAction({
      phoneNumber: phoneNumberMock,
      navigation: rootStackNavigationMock,
    });
    expect(mockDataLoadingAction).toHaveBeenNthCalledWith(
      1,
      navigateToPhoneNumberVerification,
      { phoneNumber: phoneNumberMock, navigation: rootStackNavigationMock }
    );
  });

  it('should call dataLoadingAction with navigateToPhoneNumberVerification and workflow if passed', async () => {
    const loginReducer = jest.requireActual(
      './phone-number-login.reducer.action'
    );
    const workflow: Workflow = 'prescriptionTransfer';
    loginReducer.navigateToPhoneNumberVerification = jest.fn();
    await navigateToPhoneNumberVerificationLoadingAction({
      phoneNumber: phoneNumberMock,
      workflow,
      navigation: rootStackNavigationMock,
    });
    expect(mockDataLoadingAction).toHaveBeenNthCalledWith(
      1,
      navigateToPhoneNumberVerification,
      {
        phoneNumber: phoneNumberMock,
        workflow,
        navigation: rootStackNavigationMock,
      }
    );
  });
});
