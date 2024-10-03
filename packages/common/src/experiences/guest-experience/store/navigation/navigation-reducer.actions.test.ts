// Copyright 2018 Prescryptive Health, Inc.

import { CommonActions } from '@react-navigation/native';
import { IHomeScreenRouteProps } from '../../home-screen/home-screen';
import { popToTop } from '../../navigation/navigation.helper';
import { rootStackNavigationMock } from '../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import {
  IPhoneNumberLoginScreenRouteProps,
  PhoneScreenModalContentType,
} from '../../screens/sign-in/phone-number-login-screen/phone-number-login.screen';
import {
  dispatchResetStackToFatalErrorScreen,
  dispatchResetStackToLoginScreen,
  dispatchResetStackToPhoneLoginScreen,
  resetStackToHome,
} from './navigation-reducer.actions';

jest.mock('../../navigation/navigation.helper');
const popToTopMock = popToTop as jest.Mock;

jest.mock('@react-navigation/native', () => ({
  CommonActions: {
    reset: jest.fn(),
  },
}));
const resetMock = CommonActions.reset as jest.Mock;
beforeEach(() => {
  jest.clearAllMocks();
});

describe('resetStackToHome', () => {
  it('pops stack and navigates to Home', () => {
    const resetAction = {} as CommonActions.Action;
    resetMock.mockReturnValue(resetAction);
    resetStackToHome(rootStackNavigationMock);

    expect(popToTopMock).toHaveBeenCalledWith(rootStackNavigationMock);
    expect(resetMock).toBeCalledWith({
      index: 0,
      routes: [
        {
          name: 'Home',
          params: {},
        },
      ],
    });
    expect(rootStackNavigationMock.dispatch).toHaveBeenCalledWith(resetAction);
  });

  it('pops stack and navigates to Home with props', () => {
    const homeProps = {
      modalContent: { showModal: true },
    } as IHomeScreenRouteProps;
    const resetAction = {} as CommonActions.Action;
    resetMock.mockReturnValue(resetAction);
    resetStackToHome(rootStackNavigationMock, homeProps);

    expect(popToTopMock).toHaveBeenCalledWith(rootStackNavigationMock);
    expect(resetMock).toBeCalledWith({
      index: 0,
      routes: [
        {
          name: 'Home',
          params: homeProps,
        },
      ],
    });
    expect(rootStackNavigationMock.dispatch).toHaveBeenCalledWith(resetAction);
  });
});

describe('dispatchResetStackToPhoneLoginScreen', () => {
  it.each([[undefined], [true]])(
    'should dispatch to the phone login page when blockchain is %p',
    (isBlockchainMock?: boolean) => {
      dispatchResetStackToPhoneLoginScreen(
        rootStackNavigationMock,
        isBlockchainMock
      );

      expect(popToTopMock).toHaveBeenCalledWith(rootStackNavigationMock);
      expect(rootStackNavigationMock.navigate).toHaveBeenCalledTimes(1);

      if (!isBlockchainMock) {
        expect(rootStackNavigationMock.navigate).toHaveBeenCalledWith(
          'PhoneNumberLogin',
          {} as IPhoneNumberLoginScreenRouteProps
        );
      } else {
        expect(rootStackNavigationMock.navigate).toHaveBeenCalledWith(
          'PhoneNumberLogin',
          {
            isBlockchain: isBlockchainMock,
          } as IPhoneNumberLoginScreenRouteProps
        );
      }
    }
  );

  it('should dispatch to the phone login page with params if error message is passed', () => {
    dispatchResetStackToPhoneLoginScreen(
      rootStackNavigationMock,
      undefined,
      'Error'
    );

    expect(popToTopMock).toHaveBeenCalledWith(rootStackNavigationMock);
    expect(rootStackNavigationMock.navigate).toHaveBeenCalledTimes(1);
    expect(rootStackNavigationMock.navigate).toHaveBeenCalledWith(
      'PhoneNumberLogin',
      {
        modalContent: {
          showModal: true,
          modalTopContent: 'Error',
        } as PhoneScreenModalContentType,
      } as IPhoneNumberLoginScreenRouteProps
    );
  });

  it('navigates to "Phone number login" screen ', () => {
    dispatchResetStackToPhoneLoginScreen(rootStackNavigationMock);

    expect(popToTopMock).toHaveBeenCalledWith(rootStackNavigationMock);
    expect(rootStackNavigationMock.navigate).toHaveBeenCalledTimes(1);
    expect(rootStackNavigationMock.navigate).toHaveBeenNthCalledWith(
      1,
      'PhoneNumberLogin',
      {}
    );
  });
});

describe('dispatchResetStackToLoginScreen', () => {
  it('navigates to login screen', () => {
    dispatchResetStackToLoginScreen(rootStackNavigationMock);

    expect(popToTopMock).toHaveBeenCalledWith(rootStackNavigationMock);
    expect(rootStackNavigationMock.navigate).toHaveBeenCalledTimes(1);
    expect(rootStackNavigationMock.navigate).toHaveBeenCalledWith('Login', {});
  });
});

describe('dispatchResetStackToFatalErrorScreen', () => {
  it('navigates to FatalErrorScreen screen after resetting the stack', () => {
    const errorMock = 'mock-error';
    dispatchResetStackToFatalErrorScreen(rootStackNavigationMock, errorMock);

    expect(popToTopMock).toHaveBeenCalledWith(rootStackNavigationMock);
    expect(rootStackNavigationMock.navigate).toHaveBeenCalledTimes(1);
    expect(rootStackNavigationMock.navigate).toHaveBeenNthCalledWith(
      1,
      'FatalError',
      { errorMessage: errorMock }
    );
  });
});
