// Copyright 2022 Prescryptive Health, Inc.

import { TextStyle } from 'react-native';
import { GrayScaleColor, PrimaryColor } from '../../../theming/colors';
import { getFontFace, FontWeight } from '../../../theming/fonts';
import { IconSize } from '../../../theming/icons';
import { Spacing } from '../../../theming/spacing';

export interface INavigationLinkStyles {
  linkItemTextStyle: TextStyle;
  linkLabelTextStyle: TextStyle;
  iconTextStyle: TextStyle;
}

export const navigationLinkStyles: INavigationLinkStyles = {
  linkItemTextStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    color: GrayScaleColor.black,
    paddingTop: Spacing.base,
    paddingBottom: Spacing.base,
  },
  linkLabelTextStyle: {
    ...getFontFace({ weight: FontWeight.semiBold }),
    color: GrayScaleColor.black,
  },
  iconTextStyle: {
    color: PrimaryColor.darkBlue,
    fontSize: IconSize.small,
    marginLeft: Spacing.threeQuarters,
  },
};
