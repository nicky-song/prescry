// Copyright 2022 Prescryptive Health, Inc.

import { ViewStyle } from 'react-native';
import { Spacing } from '../../../theming/spacing';

export interface IContactInfoContainerStyles {
  viewStyle: ViewStyle;
}

export const contactInfoContainerStyles: IContactInfoContainerStyles = {
  viewStyle: {
    flexDirection: 'column',
    flexGrow: 0,
    padding: Spacing.half,
  },
};
