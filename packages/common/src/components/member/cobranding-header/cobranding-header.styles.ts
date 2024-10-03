// Copyright 2022 Prescryptive Health, Inc.

import { ImageStyle, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { FontSize, getFontDimensions } from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';

export interface ICobrandingHeaderStyles {
  containerViewStyle: ViewStyle;
  titleTextStyle: TextStyle;
  logoStyle: StyleProp<ImageStyle>;
}

export const cobrandingHeaderStyles: ICobrandingHeaderStyles = {
  containerViewStyle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 24,
  },
  titleTextStyle: {
    ...getFontDimensions(FontSize.xSmall),
  },
  logoStyle: {
    marginLeft: Spacing.half,
  },
};
