// Copyright 2023 Prescryptive Health, Inc.

import { ShoppingStackNavigationProp } from '../../../../navigation/stack-navigators/shopping/shopping.stack-navigator';
import { IPricingOptionsScreenRouteProps } from '../../../../screens/shopping/pricing-options/pricing-options.screen';

export const PricingOptionNavigateDispatch = (
  navigation: ShoppingStackNavigationProp,
  routeProps: IPricingOptionsScreenRouteProps
) => {
  navigation.navigate('ShoppingPricingOptions', routeProps);
};
