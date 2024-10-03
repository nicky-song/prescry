// Copyright 2021 Prescryptive Health, Inc.

import { ViewStyle } from 'react-native';
import { IconSize } from '../../../theming/icons';

export interface IGoBackButtonStyles {
  viewStyle: ViewStyle;
}

export const goBackButtonStyles: IGoBackButtonStyles = {
  viewStyle: {
    height: IconSize.big * 2,
    width: IconSize.big * 2,
  },
};
