// Copyright 2021 Prescryptive Health, Inc.

import { TextStyle } from 'react-native';
import { GrayScaleColor, PrimaryColor } from '../../../../theming/colors';
import { FontWeight, getFontFace } from '../../../../theming/fonts';

export interface IInlineLinkStyles {
  disabledTextStyle: TextStyle;
  enabledTextStyle: TextStyle;
  pressTextStyle: TextStyle;
}

const commonTextStyle: TextStyle = {
  ...getFontFace({ weight: FontWeight.semiBold }),
  textDecorationLine: 'none',
  borderBottomWidth: 1,
};

export const inlineLinkStyles: IInlineLinkStyles = {
  disabledTextStyle: {
    ...commonTextStyle,
    color: GrayScaleColor.disabledGray,
    borderBottomColor: GrayScaleColor.disabledGray,
  },
  enabledTextStyle: {
    ...commonTextStyle,
    color: PrimaryColor.prescryptivePurple,
    borderBottomColor: PrimaryColor.prescryptivePurple,
  },
  pressTextStyle: {
    opacity: 0.5,
  },
};
