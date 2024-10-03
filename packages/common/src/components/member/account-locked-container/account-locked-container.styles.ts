// Copyright 2021 Prescryptive Health, Inc.

import { TextStyle } from 'react-native';
import { Spacing } from '../../../theming/spacing';

export interface IAccountLockedContainerStyles {
  instructionsTextStyle: TextStyle;
}

export const accountLockedContainerStyles: IAccountLockedContainerStyles = {
  instructionsTextStyle: {
    marginTop: Spacing.base,
  },
};
