// Copyright 2021 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { Spacing } from '../../../../theming/spacing';

export interface IIllustratedListItemStyles {
  descriptionTextStyle: TextStyle;
  viewStyle: ViewStyle;
}

export const illustratedListItemStyles: IIllustratedListItemStyles = {
  descriptionTextStyle: {
    marginLeft: Spacing.base,
  },
  viewStyle: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
};
