// Copyright 2022 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { PrimaryColor } from '../../../../theming/colors';
import { FontWeight, getFontFace } from '../../../../theming/fonts';
import { Spacing } from '../../../../theming/spacing';

export interface IContactInfoPanelStyles {
  iconTextStyle: TextStyle;
  linkTextStyle: TextStyle;
  rowViewStyle: ViewStyle;
}

export const contactInfoPanelStyles: IContactInfoPanelStyles = {
  iconTextStyle: {
    marginRight: Spacing.half,
    flexGrow: 0,
    color: PrimaryColor.darkBlue,
  },
  linkTextStyle: {
    borderBottomWidth: 0,
    color: PrimaryColor.darkBlue,
    ...getFontFace({ weight: FontWeight.semiBold }),
  },
  rowViewStyle: {
    flexDirection: 'row',
    marginTop: Spacing.threeQuarters,
    alignItems: 'center',
  },
};
