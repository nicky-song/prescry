// Copyright 2022 Prescryptive Health, Inc.

import { ViewStyle } from 'react-native';
import { Spacing } from '../../../../theming/spacing';

export interface IClaimHistoryScreenStyles {
  noClaimsTextViewStyle: ViewStyle;
  downloadButtonViewStyle: ViewStyle;
}

export const claimHistoryScreenStyles: IClaimHistoryScreenStyles = {
  noClaimsTextViewStyle: {
    marginBottom: Spacing.times2,
  },
  downloadButtonViewStyle: {
    width: 'fit-content',
    marginLeft: -Spacing.base,
    marginTop: -Spacing.base,
    marginBottom: Spacing.base,
  },
};
