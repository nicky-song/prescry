// Copyright 2023 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import {
  FontWeight,
  getFontFace,
  FontSize,
  getFontDimensions,
} from '../../../../theming/fonts';
import { Spacing } from '../../../../theming/spacing';
import { GrayScaleColor } from '../../../../theming/colors';
import { BorderRadius } from '../../../../theming/borders';

export interface IPricingOptionInformativePanelStyles {
  panelViewStyle: ViewStyle;
  titleViewStyle: ViewStyle;
  titleTextStyle: TextStyle;
  subTextStyle: TextStyle;
}

export const pricingOptionInformativePanelStyles: IPricingOptionInformativePanelStyles =
  {
    panelViewStyle: {
      flexDirection: 'column',
      paddingTop: Spacing.threeQuarters,
      paddingRight: Spacing.base,
      paddingBottom: Spacing.threeQuarters,
      paddingLeft: Spacing.base,
      backgroundColor: GrayScaleColor.lightGray,
      borderRadius: BorderRadius.normal,
    },
    titleViewStyle: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    titleTextStyle: {
      ...getFontFace({ weight: FontWeight.semiBold }),
    },
    subTextStyle: {
      ...getFontDimensions(FontSize.small),
    },
  };
