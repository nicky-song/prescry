// Copyright 2021 Prescryptive Health, Inc.

import { ViewStyle, TextStyle } from 'react-native';
import { PrimaryColor } from '../../../theming/colors';
import { FontWeight, getFontFace } from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';

export interface ISearchButtonStyles {
  buttonViewStyle: ViewStyle;
  buttonContentViewStyle: ViewStyle;
  textStyle: TextStyle;
}

export const searchButtonStyles: ISearchButtonStyles = {
  buttonViewStyle: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingLeft: Spacing.base,
    paddingRight: Spacing.base,
    paddingBottom: Spacing.base,
    paddingTop: Spacing.base,
    borderColor: PrimaryColor.prescryptivePurple,
  },
  buttonContentViewStyle: {
    flexDirection: 'row',
  },
  textStyle: {
    marginLeft: Spacing.times1pt25,
    ...getFontFace({ weight: FontWeight.semiBold }),
  },
};
