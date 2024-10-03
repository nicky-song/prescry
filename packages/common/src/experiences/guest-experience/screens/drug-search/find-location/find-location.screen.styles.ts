// Copyright 2022 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { Spacing } from '../../../../../theming/spacing';

export interface IFindLocationScreenStyles {
  bodyContentContainerViewStyle: ViewStyle;
  headingTextStyle: TextStyle;
  autocompleteViewStyle: ViewStyle;
}

export const findLocationScreenStyles: IFindLocationScreenStyles = {
  bodyContentContainerViewStyle: {
    height: '100%',
  },
  headingTextStyle: {
    marginBottom: Spacing.times1pt5,
    marginTop: Spacing.half,
  },
  autocompleteViewStyle: {
    marginBottom: Spacing.times1pt5,
  },
};
