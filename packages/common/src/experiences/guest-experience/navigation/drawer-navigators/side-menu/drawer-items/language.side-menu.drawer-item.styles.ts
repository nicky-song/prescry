// Copyright 2022 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { FontWeight, getFontFace } from '../../../../../../theming/fonts';
import { Spacing } from '../../../../../../theming/spacing';
import {
  reactNavigationDrawerItemLabelLeftMargin,
} from '../../react-navigation-drawer.styles';

export interface ILanguageSideMenuDrawerItemStyles {
  itemLabelViewStyle: ViewStyle;
  labelTextStyle: TextStyle;
  labelDotTextStyle: TextStyle;
}

export const languageSideMenuDrawerItemStyles: ILanguageSideMenuDrawerItemStyles = {
  itemLabelViewStyle: {
    flexDirection: 'row',
  },
  labelTextStyle: {
    marginLeft: Spacing.times1pt5 - reactNavigationDrawerItemLabelLeftMargin,
    ...getFontFace({ weight: FontWeight.semiBold }),
  },
  labelDotTextStyle: {
    ...getFontFace({ weight: FontWeight.semiBold }),
  },
};
