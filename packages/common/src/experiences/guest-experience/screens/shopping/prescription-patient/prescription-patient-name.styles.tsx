// Copyright 2021 Prescryptive Health, Inc.

import { ImageStyle, ViewStyle } from 'react-native';
import { Spacing } from '../../../../../theming/spacing';

export interface IPrescriptionPatientNameStyles {
  forPatientViewStyle: ViewStyle;
  profileIconStyle: ImageStyle;
}

export const styles: IPrescriptionPatientNameStyles = {
  forPatientViewStyle: {
    flexDirection: 'row',
  },
  profileIconStyle: {
    height: 14,
    width: 14,
    marginRight: Spacing.half,
    marginTop: 5,
  },
};
