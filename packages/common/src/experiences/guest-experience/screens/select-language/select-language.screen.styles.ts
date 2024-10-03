// Copyright 2022 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { FontWeight, getFontFace } from '../../../../theming/fonts';
import { Spacing } from '../../../../theming/spacing';

export interface ISelectLanguageScreenStyles {
  radioButtonViewStyle: ViewStyle;
  radioButtonToggleViewStyle: ViewStyle;
  checkBoxContainerViewStyle: ViewStyle;
  radioButtonTopTextStyle: TextStyle;
  radioButtonBottomTextStyle: TextStyle;
}

export const selectLanguageScreenStyles: ISelectLanguageScreenStyles = {
  radioButtonToggleViewStyle: {
    width: '100%',
    marginTop: Spacing.base,
  },
  checkBoxContainerViewStyle: {
    flexDirection: 'column',
  },
  radioButtonViewStyle: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    height: 54,
    marginBottom: Spacing.times2,
  },
  radioButtonTopTextStyle: {
    ...getFontFace({ weight: FontWeight.semiBold }),
  },
  radioButtonBottomTextStyle: {
    ...getFontFace({ weight: FontWeight.regular }),
  },
};
