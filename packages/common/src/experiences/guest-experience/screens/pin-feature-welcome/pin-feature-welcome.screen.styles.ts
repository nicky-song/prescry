// Copyright 2021 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { PrimaryColor } from '../../../../theming/colors';
import { Spacing } from '../../../../theming/spacing';

export interface IPinFeatureWelcomeScreenStyles {
  titleTextStyle: TextStyle;
  headerViewStyle: ViewStyle;
  linksViewStyle: ViewStyle;
}

export const pinFeatureWelcomeScreenStyles: IPinFeatureWelcomeScreenStyles = {
  titleTextStyle: {
    marginBottom: Spacing.times1pt5,
    marginTop: Spacing.times1pt5,
    textAlign: 'center',
    color: PrimaryColor.prescryptivePurple,
  },
  headerViewStyle: {
    flexGrow: 0,
  },
  linksViewStyle: {
    marginBottom: Spacing.times2,
  },
};
