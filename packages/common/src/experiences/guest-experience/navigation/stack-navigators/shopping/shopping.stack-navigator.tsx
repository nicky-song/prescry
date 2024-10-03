// Copyright 2022 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { RouteProp } from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import {
  IShoppingPickAPharmacyScreenRouteProps,
  ShoppingPickAPharmacyScreen,
} from '../../../screens/shopping/pick-a-pharmacy/shopping-pick-a-pharmacy.screen';
import { IShoppingConfirmationScreenRouteProps } from '../../../screens/shopping/confirmation/shopping-confirmation.screen';
import { ShoppingConfirmationScreen } from '../../../screens/shopping/confirmation/shopping-confirmation.screen';
import {
  IOrderPreviewScreenRouteProps,
  OrderPreviewScreen,
} from '../../../screens/shopping/order-preview/order-preview.screen';
import { RootStackNavigationProp } from '../root/root.stack-navigator';
import { defaultStackNavigationScreenOptions } from '../../navigation.helper';
import {
  IPricingOptionsScreenRouteProps,
  PricingOptionsScreen,
} from '../../../screens/shopping/pricing-options/pricing-options.screen';

export type ShoppingStackParamList = {
  ShoppingPickAPharmacy: IShoppingPickAPharmacyScreenRouteProps;
  ShoppingConfirmation: IShoppingConfirmationScreenRouteProps;
  ShoppingOrderPreview: IOrderPreviewScreenRouteProps;
  ShoppingPricingOptions: IPricingOptionsScreenRouteProps;
};
export type ShoppingStackScreenName = keyof ShoppingStackParamList;

type ScreenNavigationProp<TScreenName extends ShoppingStackScreenName> =
  RootStackNavigationProp &
    StackNavigationProp<ShoppingStackParamList, TScreenName>;

type ScreenRouteProp<TScreenName extends ShoppingStackScreenName> = RouteProp<
  ShoppingStackParamList,
  TScreenName
>;

export type ShoppingPickAPharmacyNavigationProp =
  ScreenNavigationProp<'ShoppingPickAPharmacy'>;
export type ShoppingPickAPharmacyRouteProp =
  ScreenRouteProp<'ShoppingPickAPharmacy'>;

export type ShoppingConfirmationNavigationProp =
  ScreenNavigationProp<'ShoppingConfirmation'>;
export type ShoppingConfirmationRouteProp =
  ScreenRouteProp<'ShoppingConfirmation'>;

export type ShoppingOrderPreviewNavigationProp =
  ScreenNavigationProp<'ShoppingOrderPreview'>;
export type ShoppingOrderPreviewRouteProp =
  ScreenRouteProp<'ShoppingOrderPreview'>;

export type ShoppingPricingOptionsNavigationProp =
  ScreenNavigationProp<'ShoppingPricingOptions'>;
export type ShoppingPricingOptionsRouteProp =
  ScreenRouteProp<'ShoppingPricingOptions'>;

export type ShoppingStackNavigationProp = RootStackNavigationProp &
  StackNavigationProp<ShoppingStackParamList, ShoppingStackScreenName>;

export const ShoppingStackNavigator = (): ReactElement => {
  const Stack = createStackNavigator<ShoppingStackParamList>();

  return (
    <Stack.Navigator screenOptions={defaultStackNavigationScreenOptions}>
      <Stack.Screen
        name='ShoppingPickAPharmacy'
        component={ShoppingPickAPharmacyScreen}
      />
      <Stack.Screen
        name='ShoppingConfirmation'
        component={ShoppingConfirmationScreen}
      />
      <Stack.Screen
        name='ShoppingOrderPreview'
        component={OrderPreviewScreen}
      />
      <Stack.Screen
        name='ShoppingPricingOptions'
        component={PricingOptionsScreen}
      />
    </Stack.Navigator>
  );
};
