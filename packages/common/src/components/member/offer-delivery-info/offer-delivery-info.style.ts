// Copyright 2021 Prescryptive Health, Inc.

import { ViewStyle, TextStyle } from 'react-native';
import { Spacing } from '../../../theming/spacing';

export interface IOfferDeliveryInfoStyles {
  pharmacyInfoViewStyle: ViewStyle;
  phoneContainerViewStyle: ViewStyle;
  titleTextStyle: TextStyle;
}

const phoneContainerViewStyle: ViewStyle = {
  flexDirection: 'row',
  marginTop: Spacing.base,
  alignItems: 'center',
};

const titleTextStyle: TextStyle = { marginBottom: Spacing.base };

const pharmacyInfoViewStyle: ViewStyle = { marginTop: Spacing.base };

export const offerDeliveryInfoStyles: IOfferDeliveryInfoStyles = {
  pharmacyInfoViewStyle,
  phoneContainerViewStyle,
  titleTextStyle,
};
