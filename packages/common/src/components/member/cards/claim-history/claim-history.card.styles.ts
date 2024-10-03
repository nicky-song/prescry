// Copyright 2022 Prescryptive Health, Inc.

import { ViewStyle } from 'react-native';
import { Spacing } from '../../../../theming/spacing';
import { IExtendedViewStyle } from '../../../../typings/extended-view-style';

export interface IClaimHistoryCardStyles {
  rowContainerViewStyle: IExtendedViewStyle;
  colContainerViewStyle: IExtendedViewStyle;
  expandedPriceViewStyle: ViewStyle;
  collapseFilledOnDateViewStyle: ViewStyle;
}

export const claimHistoryCardStyles: IClaimHistoryCardStyles = {
  rowContainerViewStyle: {
    flexDirection: 'row',
    columnGap: Spacing.base,
    marginTop: Spacing.half,
  },
  colContainerViewStyle: {
    flexDirection: 'column',
    columnGap: Spacing.base,
    marginTop: Spacing.half,
  },
  expandedPriceViewStyle: {
    marginTop: Spacing.times1pt5,
  },
  collapseFilledOnDateViewStyle: { marginBottom: Spacing.base },
};
