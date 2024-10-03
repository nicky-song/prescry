// Copyright 2022 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { BorderRadius } from '../../../theming/borders';
import { GrayScaleColor } from '../../../theming/colors';
import {
  FontSize,
  FontWeight,
  getFontDimensions,
  getFontFace,
} from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';

export interface IBaseTagStyles {
  labelTextStyle: TextStyle;
  iconTextStyle: TextStyle;
  viewStyle: ViewStyle;
}

export const baseTagStyles: IBaseTagStyles = {
  labelTextStyle: {
    ...getFontDimensions(FontSize.xSmall),
    ...getFontFace({ weight: FontWeight.semiBold }),
  },
  iconTextStyle: {
    marginRight: Spacing.half,
  },
  viewStyle: {
    paddingTop: Spacing.half,
    paddingBottom: Spacing.half,
    paddingLeft: Spacing.half,
    paddingRight: Spacing.half,
    borderRadius: BorderRadius.half,
    backgroundColor: GrayScaleColor.lightGray,
    width: 'fit-content',
    flexDirection: 'row',
    alignItems: 'center',
  },
};
