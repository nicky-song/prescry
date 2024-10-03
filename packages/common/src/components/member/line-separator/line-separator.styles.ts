// Copyright 2021 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { GrayScaleColor, PrimaryColor } from '../../../theming/colors';
import {
  FontSize,
  FontWeight,
  getFontDimensions,
  getFontFace,
} from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';

export interface ILineSeparatorStyles {
  lineViewStyle: ViewStyle;
  linesWithLabelViewStyle: ViewStyle;
  labelTextStyle: TextStyle;
  surroundingLineViewStyle: ViewStyle;
}

export const lineSeparatorStyles: ILineSeparatorStyles = {
  lineViewStyle: {
    backgroundColor: GrayScaleColor.borderLines,
    height: 1,
  },
  surroundingLineViewStyle: {
    flexGrow: 1,
  },
  linesWithLabelViewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelTextStyle: {
    ...getFontDimensions(FontSize.small),
    ...getFontFace({ weight: FontWeight.semiBold }),
    color: PrimaryColor.plum,
    marginLeft: Spacing.threeQuarters,
    marginRight: Spacing.threeQuarters,
  },
};
