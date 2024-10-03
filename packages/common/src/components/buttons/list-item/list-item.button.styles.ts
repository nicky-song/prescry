// Copyright 2021 Prescryptive Health, Inc.

import { ViewStyle } from 'react-native';
import { GrayScaleColor } from '../../../theming/colors';
import { Spacing } from '../../../theming/spacing';

export interface IListItemButtonStyles {
  viewStyle: ViewStyle;
}

export const listItemButtonStyles: IListItemButtonStyles = {
  viewStyle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: GrayScaleColor.white,
    borderBottomColor: GrayScaleColor.borderLines,
    borderBottomWidth: 1,
    borderRadius: 0,
    paddingTop: Spacing.base,
    paddingBottom: Spacing.base,
    paddingLeft: 0,
    paddingRight: 0,
  },
};
