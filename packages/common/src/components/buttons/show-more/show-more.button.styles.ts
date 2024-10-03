// Copyright 2022 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { FontWeight, getFontFace } from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';

export interface IShowMoreButtonStyles {
  viewStyle: ViewStyle;
  textStyle: TextStyle;
}

export const showMoreButtonStyles: IShowMoreButtonStyles = {
  viewStyle: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  textStyle: {
    ...getFontFace({ weight: FontWeight.semiBold }),
    marginRight: Spacing.threeQuarters,
  },
};
