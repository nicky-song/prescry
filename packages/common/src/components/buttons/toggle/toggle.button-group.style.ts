// Copyright 2021 Prescryptive Health, Inc.

import { ViewStyle, TextStyle } from 'react-native';
import { BorderRadius } from '../../../theming/borders';
import { GrayScaleColor, PrimaryColor } from '../../../theming/colors';
import { FontSize, getFontDimensions } from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';

export interface IToggleButtonGroupStyles {
  optionsContainerViewStyle: ViewStyle;
  buttonTextStyle: TextStyle;
  buttonViewStyle: TextStyle;
  unSelectedButtonViewStyle: ViewStyle;
  unSelectedButtonTextStyle: TextStyle;
}

const commonButtonViewStyle: TextStyle = {
  width: 'auto',
  minWidth: 100,
  marginHorizontal: Spacing.half,
  marginBottom: Spacing.base,
  height: 40,
  borderRadius: BorderRadius.rounded,
  borderWidth: 1,
  paddingLeft: Spacing.base,
  paddingRight: Spacing.base,
};

export const toggleButtonGroupStyles: IToggleButtonGroupStyles = {
  buttonViewStyle: commonButtonViewStyle,
  buttonTextStyle: {
    color: GrayScaleColor.white,
    ...getFontDimensions(FontSize.body),
  },
  optionsContainerViewStyle: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: -Spacing.half,
  },
  unSelectedButtonViewStyle: {
    ...commonButtonViewStyle,
    backgroundColor: GrayScaleColor.white,
    borderColor: PrimaryColor.darkBlue,
    borderWidth: 1,
  },
  unSelectedButtonTextStyle: {
    color: GrayScaleColor.primaryText,
    ...getFontDimensions(FontSize.body),
  },
};
