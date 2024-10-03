// Copyright 2021 Prescryptive Health, Inc.

import { rootStackNavigationMock } from '../../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { IShoppingPickAPharmacyScreenRouteProps } from '../../../../screens/shopping/pick-a-pharmacy/shopping-pick-a-pharmacy.screen';
import { pickAPharmacyNavigateDispatch } from './pick-a-pharmacy-navigate.dispatch';

describe('pickAPharmacyNavigateDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call dispatchNavigateToScreen', () => {
    const routeParamsMock: IShoppingPickAPharmacyScreenRouteProps = {
      prescriptionId: 'prescription-id',
      blockchain: true,
      navigateToHome: true,
      reloadPrescription: true,
    };

    pickAPharmacyNavigateDispatch(rootStackNavigationMock, routeParamsMock);

    expect(rootStackNavigationMock.navigate).toHaveBeenCalledWith(
      'ShoppingStack',
      {
        screen: 'ShoppingPickAPharmacy',
        params: routeParamsMock,
      }
    );
  });
});
