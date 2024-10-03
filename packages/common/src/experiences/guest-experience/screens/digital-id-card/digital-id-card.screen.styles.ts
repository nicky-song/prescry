// Copyright 2021 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { FontWeight, getFontFace } from '../../../../theming/fonts';
import { Spacing } from '../../../../theming/spacing';

export interface IDigitalIdCardScreenStyles {
  digitalIdCardViewStyle: ViewStyle;
  digitalIdCardScreenBodyViewStyle: ViewStyle;
  issuerNumberViewStyle: ViewStyle;
  issuerNumberLabelTextStyle: TextStyle;
  issuerNumberTextStyle: TextStyle;
  separatorViewStyle: ViewStyle;
}

export const digitalIdCardScreenStyles: IDigitalIdCardScreenStyles = {
  digitalIdCardViewStyle: {
    marginTop: Spacing.times2,
    marginBottom: Spacing.times2,
  },
  digitalIdCardScreenBodyViewStyle: {
    paddingBottom: 0,
  },
  issuerNumberViewStyle: {
    flexDirection: 'row',
  },
  issuerNumberLabelTextStyle: {
    flexGrow: 0,
    flexBasis: 'auto',
    marginRight: Spacing.threeQuarters,
  },
  issuerNumberTextStyle: {
    ...getFontFace({ weight: FontWeight.bold }),
  },
  separatorViewStyle: {
    marginTop: Spacing.times2,
    marginBottom: Spacing.times2,
  },
};
