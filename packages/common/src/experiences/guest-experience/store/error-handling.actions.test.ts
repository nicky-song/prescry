// Copyright 2018 Prescryptive Health, Inc.

import { guestExperienceExceptionLogger } from '../guest-experience-logger.middleware';
import { rootStackNavigationMock } from '../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import {
  handleAuthenticationErrorAction,
  handleCommonErrorAction,
  handleTwilioErrorAction,
  handleUnauthorizedAccessErrorAction,
} from './error-handling.actions';

import {
  dispatchResetStackToFatalErrorScreen,
  dispatchResetStackToPhoneLoginScreen,
} from './navigation/navigation-reducer.actions';
import { resetSettingsAction } from './settings/settings-reducer.actions';
import { setMissingAccountErrorMessageAction } from './support-error/support-error.reducer.actions';

const mockReduxDispatchHandler = jest.fn();

jest.mock(
  '../../../experiences/guest-experience/store/settings/settings-reducer.actions',
  () => ({
    resetSettingsAction: jest.fn(),
  })
);
jest.mock('./navigation/navigation-reducer.actions', () => ({
  dispatchNavigateToScreen: jest.fn(),
  dispatchResetStackToFatalErrorScreen: jest.fn(),
  dispatchResetStackToPhoneLoginScreen: jest.fn(),
}));

jest.mock('./support-error/support-error.reducer.actions', () => ({
  setMissingAccountErrorMessageAction: jest.fn(),
}));
jest.mock('../guest-experience-logger.middleware', () => ({
  guestExperienceExceptionLogger: jest.fn(),
}));

jest.mock('./support-error/support-error.reducer.actions', () => ({
  setMissingAccountErrorMessageAction: jest.fn(),
}));

const mockResetSettingsAction = resetSettingsAction as jest.Mock;
const mockSetMissingAccountErrorMessageAction =
  setMissingAccountErrorMessageAction as jest.Mock;
const mockDispatchResetStackToFatalErrorScreen =
  dispatchResetStackToFatalErrorScreen as jest.Mock;
const mockGuestExperienceExceptionLogger =
  guestExperienceExceptionLogger as jest.Mock;
const mockDispatchResetStackToPhoneLoginScreen =
  dispatchResetStackToPhoneLoginScreen as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  mockResetSettingsAction.mockReturnValueOnce(jest.fn());
});

describe('handleAuthenticationErrorAction', () => {
  it('should have called resetSettingsAction', async () => {
    await handleAuthenticationErrorAction(
      mockReduxDispatchHandler,
      rootStackNavigationMock
    );
    expect(mockResetSettingsAction).toHaveBeenCalledTimes(1);
  });

  it('should dispatch to phoneNumberLoginScreen if pin feature is enabled', async () => {
    await handleAuthenticationErrorAction(jest.fn(), rootStackNavigationMock);
    expect(mockDispatchResetStackToPhoneLoginScreen).toHaveBeenNthCalledWith(
      1,
      rootStackNavigationMock,
      undefined
    );
  });
});

describe('handleUnauthorizedAccessErrorAction', () => {
  it('should have called resetSettingsAction', async () => {
    await handleUnauthorizedAccessErrorAction(
      mockReduxDispatchHandler,
      rootStackNavigationMock,
      'error-mock'
    );
    expect(mockResetSettingsAction).toHaveBeenCalledTimes(1);
  });

  it('should dispatch to phoneNumberLoginScreen', async () => {
    await handleUnauthorizedAccessErrorAction(
      mockReduxDispatchHandler,
      rootStackNavigationMock,
      'error-mock'
    );
    expect(mockDispatchResetStackToPhoneLoginScreen).toHaveBeenNthCalledWith(
      1,
      rootStackNavigationMock,
      undefined,
      'error-mock'
    );
  });
});

describe('handleCommonErrorAction', () => {
  it('should have called ResetStackToFatalErrorScreen with erroMessage and error', () => {
    const mockErrorMessage = 'mockErrorMessage';
    const mockError = new Error(mockErrorMessage);
    handleCommonErrorAction(
      rootStackNavigationMock,
      mockErrorMessage,
      mockError
    );

    expect(mockDispatchResetStackToFatalErrorScreen).toHaveBeenCalledTimes(1);
    expect(mockDispatchResetStackToFatalErrorScreen).toHaveBeenCalledWith(
      rootStackNavigationMock,
      mockErrorMessage
    );
    expect(mockGuestExperienceExceptionLogger).toHaveBeenCalledTimes(1);
    expect(mockGuestExperienceExceptionLogger).toHaveBeenCalledWith(mockError);
  });
});

describe('handleTwilioErrorAction', () => {
  it('should have navigate to supportErrorScreen and also should set Missing Account Error Message', () => {
    const mockErrorMessage = 'mockErrorMessage';
    handleTwilioErrorAction(
      mockReduxDispatchHandler,
      rootStackNavigationMock,
      mockErrorMessage
    );
    expect(mockReduxDispatchHandler).toHaveBeenCalledTimes(1);
    expect(mockSetMissingAccountErrorMessageAction).toHaveBeenCalledTimes(1);
    expect(mockSetMissingAccountErrorMessageAction).toHaveBeenNthCalledWith(
      1,
      mockErrorMessage,
      undefined
    );

    expect(rootStackNavigationMock.navigate).toHaveBeenCalledTimes(1);
    expect(rootStackNavigationMock.navigate).toHaveBeenCalledWith(
      'SupportError'
    );
  });

  it('should set Missing Account Error Message with errorBackNavigationType', () => {
    const mockErrorMessage = 'mockErrorMessage';
    handleTwilioErrorAction(
      mockReduxDispatchHandler,
      rootStackNavigationMock,
      mockErrorMessage,
      'LogoutAndStartOverAtLogin'
    );
    expect(mockReduxDispatchHandler).toHaveBeenCalledTimes(1);
    expect(mockSetMissingAccountErrorMessageAction).toHaveBeenCalledTimes(1);
    expect(mockSetMissingAccountErrorMessageAction).toHaveBeenNthCalledWith(
      1,
      mockErrorMessage,
      'LogoutAndStartOverAtLogin'
    );
  });
});
