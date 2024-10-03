// Copyright 2022 Prescryptive Health, Inc.

import { ViewStyle } from 'react-native';
import { Spacing } from '../../../theming/spacing';

export interface IClaimHistoryListStyles {
  cardViewStyle: ViewStyle;
  firstCardViewStyle: ViewStyle;
}

export const claimHistoryListStyles: IClaimHistoryListStyles = {
  cardViewStyle: {
    marginTop: Spacing.times1pt25,
  },
  firstCardViewStyle: {},
};
