// Copyright 2021 Prescryptive Health, Inc.

import { ViewStyle } from 'react-native';
import { BorderRadius } from '../../../theming/borders';
import { GrayScaleColor } from '../../../theming/colors';
import { Spacing } from '../../../theming/spacing';

export interface IStrokeCardStyles {
  viewStyle: ViewStyle;
}

export const strokeCardStyles: IStrokeCardStyles = {
  viewStyle: {
    borderRadius: BorderRadius.normal,
    borderWidth: 1,
    borderColor: GrayScaleColor.borderLines,
    paddingTop: Spacing.base,
    paddingBottom: Spacing.base,
    paddingLeft: Spacing.base,
    paddingRight: Spacing.base,
  },
};
