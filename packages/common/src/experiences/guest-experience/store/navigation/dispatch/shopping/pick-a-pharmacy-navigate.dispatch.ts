// Copyright 2021 Prescryptive Health, Inc.

import { IShoppingPickAPharmacyScreenRouteProps } from '../../../../screens/shopping/pick-a-pharmacy/shopping-pick-a-pharmacy.screen';
import { RootStackNavigationProp } from './../../../../navigation/stack-navigators/root/root.stack-navigator';

export const pickAPharmacyNavigateDispatch = (
  navigation: RootStackNavigationProp,
  routeParams: IShoppingPickAPharmacyScreenRouteProps
) => {
  navigation.navigate('ShoppingStack', {
    screen: 'ShoppingPickAPharmacy',
    params: routeParams,
  });
};
