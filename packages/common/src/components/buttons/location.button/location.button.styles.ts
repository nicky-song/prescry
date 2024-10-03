// Copyright 2021 Prescryptive Health, Inc.

import { TextStyle } from 'react-native';
import { Spacing } from '../../../theming/spacing';

export interface ILocationButtonStyles {
  locationButtonTextStyle: TextStyle;
}

export const locationButtonStyles: ILocationButtonStyles = {
  locationButtonTextStyle: {
    marginRight: Spacing.half,
  },
};
