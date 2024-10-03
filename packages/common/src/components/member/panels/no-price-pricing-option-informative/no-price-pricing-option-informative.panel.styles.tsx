// Copyright 2023 Prescryptive Health, Inc.

import { ViewStyle } from 'react-native';
import { Spacing } from '../../../../theming/spacing';
import { GrayScaleColor } from '../../../../theming/colors';
import { BorderRadius } from '../../../../theming/borders';

export interface INoPricePricingOptionInformativePanelStyles {
  panelViewStyle: ViewStyle;
}

export const noPricePricingOptionInformativePanelStyles: INoPricePricingOptionInformativePanelStyles =
  {
    panelViewStyle: {
      paddingTop: Spacing.threeQuarters,
      paddingRight: Spacing.base,
      paddingBottom: Spacing.threeQuarters,
      paddingLeft: Spacing.base,
      backgroundColor: GrayScaleColor.lightGray,
      borderRadius: BorderRadius.normal,
    },
  };
