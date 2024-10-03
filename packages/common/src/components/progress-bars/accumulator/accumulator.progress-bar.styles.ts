// Copyright 2022 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import {
  FontSize,
  FontWeight,
  getFontDimensions,
  getFontFace,
} from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';

export interface IAccumulatorProgressBarStyles {
  titleContainerViewStyle: ViewStyle;
  maxValueContainerViewStyle: ViewStyle;
  maxLabelTextStyle: TextStyle;
  maxValueTextStyle: TextStyle;
  maxProgressLabelViewStyle: ViewStyle;
}

export const accumulatorProgressBarStyles: IAccumulatorProgressBarStyles = {
  titleContainerViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.quarter,
  },
  maxValueContainerViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.half,
  },
  maxLabelTextStyle: {
    ...getFontFace({ weight: FontWeight.semiBold }),
  },
  maxValueTextStyle: {
    ...getFontFace({ weight: FontWeight.semiBold }),
    ...getFontDimensions(FontSize.large),
  },
  maxProgressLabelViewStyle: {
    alignItems: 'flex-end',
  },
};
