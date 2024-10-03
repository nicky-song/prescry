// Copyright 2021 Prescryptive Health, Inc.

import { rootStackNavigationMock } from '../../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { IPhoneNumberVerificationScreenRouteProps } from '../../../../phone-number-verification-screen/phone-number-verification-screen';
import { phoneNumberVerificationNavigateDispatch } from './phone-number-verification-navigate.dispatch';

describe('phoneNumberVerificationNavigateDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call dispatchNavigateToScreen', () => {
    const routeProps: IPhoneNumberVerificationScreenRouteProps = {
      phoneNumber: '+11234567890',
    };
    phoneNumberVerificationNavigateDispatch(
      rootStackNavigationMock,
      routeProps
    );

    expect(rootStackNavigationMock.navigate).toHaveBeenCalledTimes(1);
    expect(rootStackNavigationMock.navigate).toHaveBeenNthCalledWith(
      1,
      'PhoneNumberVerification',
      routeProps
    );
  });
});
