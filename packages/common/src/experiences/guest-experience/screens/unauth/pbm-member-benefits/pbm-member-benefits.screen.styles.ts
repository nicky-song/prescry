// Copyright 2021 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { Spacing } from '../../../../../theming/spacing';

export interface IPbmMemberBenefitsScreenStyles {
  titleTextStyle: TextStyle;
  instructionsTextStyle: TextStyle;
  separatorViewStyle: ViewStyle;
  bodyContainerViewStyle: ViewStyle;
  bottomContentViewStyle: ViewStyle;
}

export const pbmMemberBenefitsScreenStyles = {
  titleTextStyle: {
    marginBottom: Spacing.base,
  },
  instructionsTextStyle: {
    flexGrow: 0,
  },
  separatorViewStyle: {
    marginTop: Spacing.times1pt5,
    marginBottom: Spacing.times1pt5,
  },
  bottomContentViewStyle: {
    marginTop: Spacing.times1pt5,
    flexGrow: 0,
  },
  bodyContainerViewStyle: {},
};
