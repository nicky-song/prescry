// Copyright 2021 Prescryptive Health, Inc.

import { TextStyle } from 'react-native';
import { Spacing } from '../../../theming/spacing';

export interface IServiceSelectionScreenStyles {
  titleTextStyle: TextStyle;
  moreInfoVaccineLinkTextStyle: TextStyle;
}

export const serviceSelectionScreenStyles = {
  titleTextStyle: {
    marginBottom: Spacing.base,
  },
  moreInfoVaccineLinkTextStyle: {
    marginTop: Spacing.base,
    flexGrow: 0,
  },
};
