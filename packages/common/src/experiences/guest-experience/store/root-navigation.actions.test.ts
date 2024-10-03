// Copyright 2018 Prescryptive Health, Inc.

import { ErrorRequireUserVerifyPin } from '../../../errors/error-require-user-verify-pin';
import {
  GuestExperienceConfig,
  IGuestExperienceConfig,
} from '../guest-experience-config';
import { ISettings } from '../guest-experience-settings';
import { ErrorConstants } from './../../../theming/constants';
import { handleCommonErrorAction } from './error-handling.actions';
import * as ActionsToTest from './root-navigation.actions';
import { RootState } from './root-reducer';
import { loginPinNavigateDispatch } from './navigation/dispatch/sign-in/login-pin-navigate.dispatch';
import { ErrorRequireUserSetPin } from '../../../errors/error-require-user-set-pin';
import { ICreatePinScreenRouteProps } from './../create-pin-screen/create-pin-screen';
import { deepLinkIfPathNameDispatch } from './start-experience/dispatch/deep-link-if-path-name.dispatch';
import { phoneNumberLoginNavigateDispatch } from './navigation/dispatch/sign-in/phone-number-login-navigate.dispatch';
import { rootStackNavigationMock } from './../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { ErrorRequireUserRegistration } from '../../../errors/error-require-user-registration';
import { dispatchResetStackToLoginScreen } from './navigation/navigation-reducer.actions';
import { ErrorInvalidAuthToken } from '../../../errors/error-invalid-auth-token';
import { IFeaturesState } from '../guest-experience-features';

jest.mock('./error-handling.actions');
const handleCommonErrorActionMock = handleCommonErrorAction as jest.Mock;

jest.mock('./navigation/dispatch/sign-in/phone-number-login-navigate.dispatch');
const phoneNumberLoginNavigateDispatchMock =
  phoneNumberLoginNavigateDispatch as jest.Mock;

jest.mock('./start-experience/dispatch/deep-link-if-path-name.dispatch');
const deepLinkIfPathNameDispatchMock = deepLinkIfPathNameDispatch as jest.Mock;

jest.mock('./navigation/dispatch/sign-in/login-pin-navigate.dispatch');
const loginPinNavigateDispatchMock = loginPinNavigateDispatch as jest.Mock;

jest.mock('./navigation/navigation-reducer.actions');
const dispatchResetStackToLoginScreenMock =
  dispatchResetStackToLoginScreen as jest.Mock;

beforeEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

const settingsMock: ISettings = {
  deviceToken: undefined,
  isDeviceRestricted: false,
  lastZipCode: 'unknown',
  token: 'mock-token',
};

const supportEmail = 'support@somewhere.com';
const configMock: IGuestExperienceConfig = {
  ...GuestExperienceConfig,
  supportEmail,
};
const stateMock: Partial<RootState> = {
  config: configMock,
  features: {} as IFeaturesState,
  settings: settingsMock,
};

describe('dispatchLoginIfNoDeviceToken()', () => {
  it('dispatches navigation to pbm member benefits screen for "/activate" deeplink', async () => {
    deepLinkIfPathNameDispatchMock.mockReturnValue(true);
    const dispatch = jest.fn();
    const getState = jest.fn().mockReturnValue({
      ...stateMock,
      settings: {
        ...settingsMock,
        deviceToken: undefined,
      },
      features: {},
    });
    const goingToLogin = await ActionsToTest.dispatchLoginIfNoDeviceToken(
      dispatch,
      getState,
      rootStackNavigationMock
    );

    expect(goingToLogin).toBeTruthy();
    expect(deepLinkIfPathNameDispatchMock).toHaveBeenCalledWith(
      dispatch,
      getState,
      rootStackNavigationMock,
      false
    );
    expect(phoneNumberLoginNavigateDispatchMock).not.toBeCalled();
  });
  it('should dispatch to phoneNumberLoginScreen if device token is missing and no deeplink is used', async () => {
    const dispatch = jest.fn();
    const getState = jest.fn().mockReturnValue({
      ...stateMock,
      settings: {
        ...settingsMock,
        deviceToken: undefined,
      },
    });
    const goingToLogin = await ActionsToTest.dispatchLoginIfNoDeviceToken(
      dispatch,
      getState,
      rootStackNavigationMock
    );
    expect(goingToLogin).toBeTruthy();
    expect(phoneNumberLoginNavigateDispatchMock).toHaveBeenNthCalledWith(
      1,
      rootStackNavigationMock
    );
  });

  it('should continue if device token exists', async () => {
    const dispatch = jest.fn();
    const getState = jest.fn().mockReturnValue({
      ...stateMock,
      settings: {
        ...settingsMock,
        deviceToken: 'asdasdf',
      },
    });
    const goingToLogin = await ActionsToTest.dispatchLoginIfNoDeviceToken(
      dispatch,
      getState,
      rootStackNavigationMock
    );
    expect(goingToLogin).toBeFalsy();
    expect(phoneNumberLoginNavigateDispatchMock).not.toBeCalled();
  });

  it('dispatches navigation to dispatchTophoneNumberLoginScreen when no deeplink used', async () => {
    deepLinkIfPathNameDispatchMock.mockReturnValue(false);
    const dispatch = jest.fn();
    const getState = jest.fn().mockReturnValue({
      ...stateMock,
      settings: {
        ...settingsMock,
        deviceToken: undefined,
      },
      features: {},
    });
    const goingToLogin = await ActionsToTest.dispatchLoginIfNoDeviceToken(
      dispatch,
      getState,
      rootStackNavigationMock
    );

    expect(goingToLogin).toBeTruthy();
    expect(deepLinkIfPathNameDispatchMock).toHaveBeenCalledWith(
      dispatch,
      getState,
      rootStackNavigationMock,
      false
    );
    expect(phoneNumberLoginNavigateDispatchMock).toHaveBeenNthCalledWith(
      1,
      rootStackNavigationMock
    );
  });
});

describe('dispatchErrorIfDeviceRestricted()', () => {
  it('no error if device is NOT restricted', async () => {
    const getState = jest.fn().mockReturnValue({
      ...stateMock,
      settings: {
        ...settingsMock,
        isDeviceRestricted: false,
      },
    });
    const isError = await ActionsToTest.dispatchErrorIfDeviceRestricted(
      getState,
      rootStackNavigationMock
    );
    expect(isError).toBeFalsy();
    expect(handleCommonErrorActionMock).toHaveBeenCalledTimes(0);
  });

  it('should return true and handle error action if device is restricted', async () => {
    const getState = jest.fn().mockReturnValue({
      ...stateMock,
      settings: {
        isDeviceRestricted: true,
      },
    });
    const isError = await ActionsToTest.dispatchErrorIfDeviceRestricted(
      getState,
      rootStackNavigationMock
    );
    expect(isError).toBeTruthy();
    expect(handleCommonErrorActionMock).toHaveBeenNthCalledWith(
      1,
      rootStackNavigationMock,
      ErrorConstants.errorUseMobileBrowser(supportEmail),
      new Error(ErrorConstants.errorUseMobileBrowser(supportEmail))
    );
  });
});

describe('handleKnownAuthenticationErrorAction()', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should loginPinNavigateDispatch if error is ErrorRequireUserVerifyPin', () => {
    const dispatchMock = jest.fn();
    const error = new ErrorRequireUserVerifyPin();

    const actual = ActionsToTest.handleKnownAuthenticationErrorAction(
      dispatchMock,
      rootStackNavigationMock,
      error
    );
    expect(actual).toEqual(true);
    expect(loginPinNavigateDispatchMock).toHaveBeenNthCalledWith(
      1,
      rootStackNavigationMock,
      {}
    );
  });

  it('should createPinNavigateDispatch if error is ErrorRequireUserVerifyPin', () => {
    const dispatchMock = jest.fn();
    const error = new ErrorRequireUserSetPin();

    const actual = ActionsToTest.handleKnownAuthenticationErrorAction(
      dispatchMock,
      rootStackNavigationMock,
      error
    );

    expect(actual).toEqual(true);

    const expectedArgs: ICreatePinScreenRouteProps = {};
    expect(rootStackNavigationMock.navigate).toHaveBeenNthCalledWith(
      1,
      'CreatePin',
      expectedArgs
    );
  });

  it('should loginPinNavigateDispatch with workflow if error is ErrorRequireUserVerifyPin', () => {
    const dispatchMock = jest.fn();
    const error = new ErrorRequireUserVerifyPin(true, 'prescriptionTransfer');

    const actual = ActionsToTest.handleKnownAuthenticationErrorAction(
      dispatchMock,
      rootStackNavigationMock,
      error
    );

    expect(actual).toEqual(true);

    expect(loginPinNavigateDispatchMock).toHaveBeenNthCalledWith(
      1,
      rootStackNavigationMock,
      {
        workflow: 'prescriptionTransfer',
      }
    );
  });

  it('should createPinNavigateDispatch with workflow if error is ErrorRequireUserVerifyPin', () => {
    const dispatchMock = jest.fn();
    const error = new ErrorRequireUserSetPin('prescriptionTransfer');

    const actual = ActionsToTest.handleKnownAuthenticationErrorAction(
      dispatchMock,
      rootStackNavigationMock,
      error
    );

    expect(actual).toEqual(true);

    const expectedArgs: ICreatePinScreenRouteProps = {
      workflow: 'prescriptionTransfer',
    };
    expect(rootStackNavigationMock.navigate).toHaveBeenNthCalledWith(
      1,
      'CreatePin',
      expectedArgs
    );
  });

  it('dispatches to Login screen if error is ErrorRequireUserRegistration', () => {
    const dispatchMock = jest.fn();
    const error = new ErrorRequireUserRegistration();

    const actual = ActionsToTest.handleKnownAuthenticationErrorAction(
      dispatchMock,
      rootStackNavigationMock,
      error
    );

    expect(actual).toEqual(true);

    expect(dispatchResetStackToLoginScreenMock).toHaveBeenCalledWith(
      rootStackNavigationMock
    );
  });

  it('dispatches to Login screen if error is ErrorInvalidAuthToken', () => {
    const dispatchMock = jest.fn();
    const error = new ErrorInvalidAuthToken('nope on a rope');

    const actual = ActionsToTest.handleKnownAuthenticationErrorAction(
      dispatchMock,
      rootStackNavigationMock,
      error
    );

    expect(actual).toEqual(true);

    expect(dispatchResetStackToLoginScreenMock).toHaveBeenCalledWith(
      rootStackNavigationMock
    );
  });
});
