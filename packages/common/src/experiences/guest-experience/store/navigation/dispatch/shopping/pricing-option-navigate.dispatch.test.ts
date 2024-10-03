// Copyright 2023 Prescryptive Health, Inc.

import { shoppingStackNavigationMock } from '../../../../navigation/stack-navigators/shopping/__mocks__/shopping.stack-navigation.mock';
import { IPricingOptionsScreenRouteProps } from '../../../../screens/shopping/pricing-options/pricing-options.screen';
import { PricingOptionNavigateDispatch } from './pricing-option-navigate.dispatch';

describe('pricingOptionNavigateDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls dispatchNavigateToScreen', () => {
    const ncpdpMock = 'ncpdp';
    const routePropsMock: IPricingOptionsScreenRouteProps = {
      pharmacyNcpdp: ncpdpMock,
    };
    PricingOptionNavigateDispatch(shoppingStackNavigationMock, routePropsMock);

    expect(shoppingStackNavigationMock.navigate).toHaveBeenCalledTimes(1);
    expect(shoppingStackNavigationMock.navigate).toHaveBeenNthCalledWith(
      1,
      'ShoppingPricingOptions',
      routePropsMock
    );
  });
});
