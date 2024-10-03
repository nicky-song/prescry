// Copyright 2020 Prescryptive Health, Inc.

import { ViewStyle } from 'react-native';
import { Spacing } from '../../../../theming/spacing';

export interface IHomeFeedListStyle {
  homeFeedViewStyle: ViewStyle;
  homeFeedListItemViewStyle: ViewStyle;
}

export const homeFeedListStyle: IHomeFeedListStyle = {
  homeFeedViewStyle: {
    alignItems: 'stretch',
    flex: 1,
    flexDirection: 'column',
    marginBottom: Spacing.times1pt25,
  },
  homeFeedListItemViewStyle: {
    marginBottom: Spacing.half,
    marginTop: Spacing.half,
  },
};
