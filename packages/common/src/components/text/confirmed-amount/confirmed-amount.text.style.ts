// Copyright 2021 Prescryptive Health, Inc.

import { TextStyle } from 'react-native';
import { PrimaryColor } from '../../../theming/colors';
import { FontSize, FontWeight, getFontDimensions, getFontFace } from '../../../theming/fonts';

export interface IConfirmedAmountTextStyle {
  textStyle: TextStyle;
}

export const confirmedAmountTextStyle: IConfirmedAmountTextStyle = {
  textStyle: {
    color: PrimaryColor.prescryptivePurple,
    ...getFontDimensions(FontSize.large),
    ...getFontFace({ weight: FontWeight.semiBold }),
  },
};
