// Copyright 2022 Prescryptive Health, Inc.

import { ColorValue, TextStyle, ViewStyle } from 'react-native';
import { GrayScaleColor, PrimaryColor } from '../../../theming/colors';
import { Spacing } from '../../../theming/spacing';

export interface IBaseProgressBarStyles {
  backgroundBarViewStyle: ViewStyle;
  progressBarViewStyle: ViewStyle;
  minLabelTextStyle: TextStyle;
  maxLabelTextStyle: TextStyle;
  bottomLabelsViewStyle: ViewStyle;
  topLabelsViewStyle: ViewStyle;
}

const barHeight = 10;
const baseBarViewStyle: ViewStyle = {
  height: barHeight,
  borderRadius: barHeight * 0.5,
};

const labelTextStyle: TextStyle = {
  maxWidth: '50%',
};

const commonLabelsViewStyle: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between',
};

export const defaultProgressBarColors: ColorValue[] = [
  GrayScaleColor.primaryText,
  PrimaryColor.prescryptivePurple,
];

export const baseProgressBarStyles: IBaseProgressBarStyles = {
  backgroundBarViewStyle: {
    ...baseBarViewStyle,
    backgroundColor: GrayScaleColor.lightGray,
  },
  progressBarViewStyle: {
    ...baseBarViewStyle,
    position: 'absolute',
  },
  minLabelTextStyle: {
    ...labelTextStyle,
    marginRight: Spacing.half,
  },
  maxLabelTextStyle: {
    ...labelTextStyle,
    textAlign: 'right',
    marginLeft: Spacing.half,
  },
  bottomLabelsViewStyle: {
    ...commonLabelsViewStyle,
    marginTop: Spacing.half,
  },
  topLabelsViewStyle: {
    ...commonLabelsViewStyle,
    marginBottom: Spacing.half,
  },
};
