// Copyright 2022 Prescryptive Health, Inc.

import { ImageStyle, TextStyle, ViewStyle } from 'react-native';
import { PrimaryColor } from '../../../theming/colors';
import {
  getFontDimensions,
  FontSize,
  getFontFace,
  FontWeight,
} from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';

export interface IEmptyStateMessageStyles {
  containerViewStyle: ViewStyle;
  imageStyle: ImageStyle;
  messageTextStyle: TextStyle;
  bottomRegularTextStyle: TextStyle;
  bottomWideTextStyle: TextStyle;
}

export const emptyStateMessageStyles: IEmptyStateMessageStyles = {
  containerViewStyle: {
    paddingTop: Spacing.times4,
  },
  imageStyle: {
    height: 96,
    marginBottom: Spacing.times1pt5,
  },
  messageTextStyle: {
    color: PrimaryColor.plum,
    ...getFontDimensions(FontSize.large),
    textAlign: 'center',
    ...getFontFace({ weight: FontWeight.semiBold }),
  },
  bottomRegularTextStyle: {
    paddingBottom: Spacing.times2,
  },
  bottomWideTextStyle: {
    paddingBottom: Spacing.times4,
  },
};
