// Copyright 2023 Prescryptive Health, Inc.

import { TextStyle } from 'react-native';
import { getFontDimensions, FontSize } from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';

export interface IPharmacyInfoTextStyles {
  pharmacyNameViewStyle: TextStyle;
  pharmacyAddressTextStyle: TextStyle;
}

export const pharmacyInfoTextStyles: IPharmacyInfoTextStyles = {
  pharmacyNameViewStyle: {
    marginBottom: Spacing.quarter,
    ...getFontDimensions(FontSize.body),
  },
  pharmacyAddressTextStyle: {
    ...getFontDimensions(FontSize.small),
  },
};
