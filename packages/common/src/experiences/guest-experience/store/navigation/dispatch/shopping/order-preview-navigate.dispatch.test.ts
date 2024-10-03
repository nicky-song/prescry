// Copyright 2021 Prescryptive Health, Inc.

import { orderPreviewNavigateDispatch } from './order-preview-navigate.dispatch';
import { shoppingStackNavigationMock } from '../../../../navigation/stack-navigators/shopping/__mocks__/shopping.stack-navigation.mock';
import { IOrderPreviewScreenRouteProps } from '../../../../screens/shopping/order-preview/order-preview.screen';

describe('orderPreviewNavigateDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls dispatchNavigateToScreen', () => {
    const ncpdpMock = 'ncpdp';
    const routePropsMock: IOrderPreviewScreenRouteProps = {
      pharmacyNcpdp: ncpdpMock,
      isSieMemberPrescription: false,
      pricingOption: 'pbm',
    };
    orderPreviewNavigateDispatch(shoppingStackNavigationMock, routePropsMock);

    expect(shoppingStackNavigationMock.navigate).toHaveBeenCalledTimes(1);
    expect(shoppingStackNavigationMock.navigate).toHaveBeenNthCalledWith(
      1,
      'ShoppingOrderPreview',
      routePropsMock
    );
  });
});
