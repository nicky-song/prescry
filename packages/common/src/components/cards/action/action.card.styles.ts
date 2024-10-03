// Copyright 2021 Prescryptive Health, Inc.

import { ImageStyle, TextStyle, ViewStyle } from 'react-native';
import { Spacing } from '../../../theming/spacing';
import { baseTextStyle } from '../../text/base-text/base-text.style';

export interface IActionCardStyles {
  contentContainerViewStyle: ViewStyle;
  imageStyle: ImageStyle;
  subTitleTextStyle: TextStyle;
  buttonViewStyle: ViewStyle;
}

export const actionCardStyles: IActionCardStyles = {
  contentContainerViewStyle: {
    flexDirection: 'column',
  },
  imageStyle: {
    height: 64,
    width: 64,
    marginBottom: Spacing.times2,
  },
  subTitleTextStyle: {
    ...baseTextStyle.commonBaseTextStyle,
    ...baseTextStyle.defaultSizeTextStyle,
    ...baseTextStyle.regularWeightTextStyle,
    marginTop: Spacing.half,
  },
  buttonViewStyle: {
    marginTop: Spacing.times2,
  },
};
