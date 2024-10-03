// Copyright 2021 Prescryptive Health, Inc.

import { IOrderPreviewScreenRouteProps } from '../../../../screens/shopping/order-preview/order-preview.screen';
import { ShoppingStackNavigationProp } from './../../../../navigation/stack-navigators/shopping/shopping.stack-navigator';

export const orderPreviewNavigateDispatch = (
  navigation: ShoppingStackNavigationProp,
  routeProps: IOrderPreviewScreenRouteProps
) => {
  navigation.navigate('ShoppingOrderPreview', routeProps);
};
