// Copyright 2023 Prescryptive Health, Inc.

import { ImageStyle, ViewStyle } from 'react-native';
import { Spacing } from '../../../theming/spacing';

export interface INeedHelpSectionStyles {
  containerViewStyle: ViewStyle;
  iconImageStyle: ImageStyle;
}

export const needHelpSectionStyles: INeedHelpSectionStyles = {
  containerViewStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  iconImageStyle: {
    marginRight: Spacing.half,
  },
};
