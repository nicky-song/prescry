// Copyright 2020 Prescryptive Health, Inc.

import { TextStyle } from 'react-native';
import { Spacing } from '../../../../theming/spacing';

export interface ITitleContainerListStyles {
  titleTextStyle: TextStyle;
}

export const titleContainerListStyles: ITitleContainerListStyles = {
  titleTextStyle: {
    marginBottom: Spacing.base,
  },
};
