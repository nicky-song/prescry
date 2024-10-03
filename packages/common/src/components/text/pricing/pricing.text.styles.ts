// Copyright 2022 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { GrayScaleColor } from '../../../theming/colors';
import { FontSize, FontWeight, getFontFace } from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';
export interface IPricingTextStyles {
  planPaysViewStyle: ViewStyle;
  detailsMemberPaysPricingTextStyle: TextStyle;
  detailsViewStyle: ViewStyle;
  wideViewStyle: ViewStyle;
  planPaysTextStyle: TextStyle;
}

export const pricingTextStyles: IPricingTextStyles = {
  planPaysViewStyle: {
    backgroundColor: GrayScaleColor.white,
    justifyContent: 'flex-start',
  },
  detailsMemberPaysPricingTextStyle: {
    ...getFontFace({ weight: FontWeight.semiBold }),
  },
  detailsViewStyle: {
    paddingTop: Spacing.quarter,
    paddingBottom: Spacing.quarter,
  },
  wideViewStyle: {
    marginLeft: -Spacing.base,
    marginRight: -Spacing.base,
  },
  planPaysTextStyle: { fontSize: FontSize.small },
};
