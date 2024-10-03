// Copyright 2021 Prescryptive Health, Inc.

import { rootStackNavigationMock } from '../../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { IShoppingConfirmationScreenRouteProps } from '../../../../screens/shopping/confirmation/shopping-confirmation.screen';
import { confirmationNavigateDispatch } from './confirmation-navigate.dispatch';

describe('confirmationNavigateDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls dispatchNavigateToScreen', () => {
    const routePropsMock: IShoppingConfirmationScreenRouteProps = {
      canGoBack: true,
      pharmacyNcpdp: 'pharmacy-ncpdp',
    };

    confirmationNavigateDispatch(rootStackNavigationMock, routePropsMock);

    expect(rootStackNavigationMock.navigate).toHaveBeenCalledWith(
      'ShoppingStack',
      {
        screen: 'ShoppingConfirmation',
        params: routePropsMock,
      }
    );
  });
});
