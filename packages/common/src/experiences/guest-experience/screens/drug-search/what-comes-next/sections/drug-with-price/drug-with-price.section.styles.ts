// Copyright 2021 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { Spacing } from '../../../../../../../theming/spacing';

export interface IDrugWithPriceSectionStyles {
  priceContainerViewStyle: ViewStyle;
  priceTextStyle: TextStyle;
  planPriceTextStyle: TextStyle;
  planPaysContainerViewStyle: ViewStyle;
}

export const drugWithPriceSectionStyles: IDrugWithPriceSectionStyles = {
  priceContainerViewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.threeQuarters,
  },
  priceTextStyle: {
    textAlign: 'right',
    flex: 2,
  },
  planPaysContainerViewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Spacing.base,
  },
  planPriceTextStyle: { textAlign: 'right', flex: 2 },
};
