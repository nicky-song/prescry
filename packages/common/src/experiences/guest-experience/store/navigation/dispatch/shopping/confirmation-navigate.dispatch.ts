// Copyright 2021 Prescryptive Health, Inc.

import { IShoppingConfirmationScreenRouteProps } from '../../../../screens/shopping/confirmation/shopping-confirmation.screen';
import { RootStackNavigationProp } from './../../../../navigation/stack-navigators/root/root.stack-navigator';

export const confirmationNavigateDispatch = (
  navigation: RootStackNavigationProp,
  routeProps: IShoppingConfirmationScreenRouteProps
) => {
  navigation.navigate('ShoppingStack', {
    screen: 'ShoppingConfirmation',
    params: routeProps,
  });
};
