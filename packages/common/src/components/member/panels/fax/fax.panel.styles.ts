// Copyright 2022 Prescryptive Health, Inc.

import { TextStyle } from 'react-native';
import { FontWeight, getFontFace } from '../../../../theming/fonts';
import { Spacing } from '../../../../theming/spacing';

export interface IFaxPanelStyles {
  faxNumberTextStyle: TextStyle;
}

export const faxPanelStyles: IFaxPanelStyles = {
  faxNumberTextStyle: {
    ...getFontFace({ weight: FontWeight.semiBold }),
    marginTop: Spacing.threeQuarters,
  },
};
