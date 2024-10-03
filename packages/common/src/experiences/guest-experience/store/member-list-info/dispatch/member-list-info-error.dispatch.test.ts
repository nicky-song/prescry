// Copyright 2018 Prescryptive Health, Inc.

import { ErrorInvalidAuthToken } from '../../../../../errors/error-invalid-auth-token';
import { ErrorMaxPinAttempt } from '../../../../../errors/error-max-pin-attempt';
import { ErrorPhoneNumberMismatched } from '../../../../../errors/error-phone-number-mismatched';
import { ErrorRequireUserVerifyPin } from '../../../../../errors/error-require-user-verify-pin';
import { ErrorShowPinFeatureWelcomeScreen } from '../../../../../errors/error-show-pin-feature-welcome-screen';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { handleAuthenticationErrorAction } from '../../error-handling.actions';
import { internalErrorDispatch } from '../../error-handling/dispatch/internal-error.dispatch';
import { loginPinNavigateDispatch } from '../../navigation/dispatch/sign-in/login-pin-navigate.dispatch';
import { memberListInfoErrorDispatch } from './member-list-info-error.dispatch';
import { phoneNumberMismatchedErrorDispatch } from './phone-number-mismatched-error.dispatch';

jest.mock('../../error-handling.actions', () => ({
  handleAuthenticationErrorAction: jest.fn(),
}));

jest.mock('./phone-number-mismatched-error.dispatch', () => ({
  phoneNumberMismatchedErrorDispatch: jest.fn(),
}));
jest.mock('../../navigation/dispatch/sign-in/login-pin-navigate.dispatch');
jest.mock('../../error-handling/dispatch/internal-error.dispatch');

const handleAuthenticationErrorActionMock =
  handleAuthenticationErrorAction as jest.Mock;
const dispatchToLoginPinScreenMock = loginPinNavigateDispatch as jest.Mock;
const phoneNumberMismatchedErrorDispatchMock =
  phoneNumberMismatchedErrorDispatch as jest.Mock;
const internalErrorDispatchMock = internalErrorDispatch as jest.Mock;

beforeEach(() => {
  jest.resetAllMocks();
});

describe('memberListInfoErrorDispatch', () => {
  it('dispatches AccountLockedScreen', async () => {
    const error = new ErrorMaxPinAttempt('Error max PIN attempts', 5);
    const dispatch = jest.fn();

    await memberListInfoErrorDispatch(
      error,
      dispatch,
      rootStackNavigationMock
    );
    expect(rootStackNavigationMock.navigate).toHaveBeenNthCalledWith(
      1,
      'AccountLocked',
      {}
    );
    expect(internalErrorDispatchMock).not.toBeCalled();
  });

  it('dispatches ErrorShowPinFeatureWelcomeScreen', async () => {
    const error = new ErrorShowPinFeatureWelcomeScreen();
    const dispatch = jest.fn();

    await memberListInfoErrorDispatch(
      error,
      dispatch,
      rootStackNavigationMock
    );
    expect(rootStackNavigationMock.navigate).toBeCalledWith(
      'PinFeatureWelcome',
      {}
    );
  });

  it('dispatches ErrorRequireUserVerifyPin', async () => {
    const error = new ErrorRequireUserVerifyPin(true);
    const dispatch = jest.fn();

    await memberListInfoErrorDispatch(
      error,
      dispatch,
      rootStackNavigationMock
    );
    expect(dispatchToLoginPinScreenMock).toHaveBeenNthCalledWith(
      1,
      rootStackNavigationMock,
      { workflow: undefined }
    );
  });

  it('dispatches ErrorRequireUserVerifyPin with workflow', async () => {
    const error = new ErrorRequireUserVerifyPin(true, 'prescriptionTransfer');
    const dispatch = jest.fn();

    await memberListInfoErrorDispatch(
      error,
      dispatch,
      rootStackNavigationMock
    );
    expect(dispatchToLoginPinScreenMock).toHaveBeenNthCalledWith(
      1,
      rootStackNavigationMock,
      {
        workflow: 'prescriptionTransfer',
      }
    );
  });

  it('dispatches ErrorPhoneNumberMismatched', async () => {
    const error = new ErrorPhoneNumberMismatched('error x');
    const dispatch = jest.fn();

    await memberListInfoErrorDispatch(
      error,
      dispatch,
      rootStackNavigationMock
    );
    expect(phoneNumberMismatchedErrorDispatchMock).toHaveBeenNthCalledWith(
      1,
      dispatch,
      rootStackNavigationMock
    );
  });

  it('dispatches ErrorInvalidAuthToken', async () => {
    const error = new ErrorInvalidAuthToken('error');
    const dispatch = jest.fn();

    await memberListInfoErrorDispatch(
      error,
      dispatch,
      rootStackNavigationMock
    );
    expect(handleAuthenticationErrorActionMock).toHaveBeenNthCalledWith(
      1,
      dispatch,
      rootStackNavigationMock
    );
  });

  it('dispatches Error', async () => {
    const error = new Error();
    const dispatch = jest.fn();

    await memberListInfoErrorDispatch(
      error,
      dispatch,
      rootStackNavigationMock
    );
    expect(internalErrorDispatchMock).toHaveBeenNthCalledWith(
      1,
      rootStackNavigationMock,
      error
    );
  });
});
