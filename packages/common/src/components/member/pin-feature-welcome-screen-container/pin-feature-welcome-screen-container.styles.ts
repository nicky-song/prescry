// Copyright 2022 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { PrimaryColor } from '../../../theming/colors';
import { FontSize, getFontDimensions } from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';
import { GreyScale } from '../../../theming/theme';

export interface IPinFeatureWelcomeScreenContainerStyles {
  containerHeaderTextStyle: TextStyle;
  containerInfoTextStyle: TextStyle;
  containerViewStyle: ViewStyle;
}

export const pinFeatureWelcomeScreenContainerStyles: IPinFeatureWelcomeScreenContainerStyles =
  {
    containerHeaderTextStyle: {
      color: PrimaryColor.prescryptivePurple,
      ...getFontDimensions(FontSize.large),
      marginBottom: Spacing.times1pt25,
      marginTop: Spacing.times1pt25,
      textAlign: 'center',
    },
    containerInfoTextStyle: {
      color: GreyScale.lighterDark,
      marginLeft: Spacing.times1pt25,
      marginRight: Spacing.times1pt25,
      marginTop: Spacing.times2pt5,
      marginBottom: Spacing.times2pt5,
      textAlign: 'center',
    },
    containerViewStyle: {
      justifyContent: 'center',
    },
  };
