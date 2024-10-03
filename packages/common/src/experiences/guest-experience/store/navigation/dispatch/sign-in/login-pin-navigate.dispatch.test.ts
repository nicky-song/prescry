// Copyright 2021 Prescryptive Health, Inc.

import { loginPinNavigateDispatch } from './login-pin-navigate.dispatch';
import { ILoginPinScreenRouteProps } from '../../../../login-pin-screen/login-pin-screen';
import { rootStackNavigationMock } from '../../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';

describe('loginPinNavigateDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('navigates to "LoginPin" screen', () => {
    loginPinNavigateDispatch(rootStackNavigationMock);

    expect(rootStackNavigationMock.navigate).toHaveBeenCalledTimes(1);
    expect(rootStackNavigationMock.navigate).toHaveBeenNthCalledWith(
      1,
      'LoginPin',
      {}
    );
  });

  it('navigations to "LoginPin" screen with params', () => {
    const pinScreenParams: ILoginPinScreenRouteProps = {
      isUpdatePin: false,
      workflow: 'prescriptionTransfer',
    };
    loginPinNavigateDispatch(rootStackNavigationMock, pinScreenParams);

    expect(rootStackNavigationMock.navigate).toHaveBeenNthCalledWith(
      1,
      'LoginPin',
      pinScreenParams
    );
  });
});
