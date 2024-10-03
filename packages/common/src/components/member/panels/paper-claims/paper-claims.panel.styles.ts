// Copyright 2022 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { FontWeight, getFontFace } from '../../../../theming/fonts';
import { Spacing } from '../../../../theming/spacing';

export interface IPaperClaimsPanelStyles {
  addressTextStyle: TextStyle;
  addressViewStyle: ViewStyle;
}

export const paperClaimsPanelStyles: IPaperClaimsPanelStyles = {
  addressTextStyle: {
    ...getFontFace({ weight: FontWeight.semiBold }),
  },
  addressViewStyle: {
    marginTop: Spacing.threeQuarters,
  },
};
