// Copyright 2021 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { GrayScaleColor, PrimaryColor } from '../../../theming/colors';
import { Spacing } from '../../../theming/spacing';
import { IconSize } from '../../../theming/icons';

export interface IIconButtonStyle {
  iconTextStyle: TextStyle;
  iconButtonViewStyle: ViewStyle;
  iconDisabledTextStyle: TextStyle;
  iconButtonDisabledViewStyle: ViewStyle;
}

export const iconButtonStyle: IIconButtonStyle = {
  iconTextStyle: {
    fontSize: IconSize.big,
    color: PrimaryColor.darkBlue,
  },
  iconButtonViewStyle: {
    backgroundColor: 'transparent',
    width: 'auto',
    paddingTop: Spacing.base,
    paddingBottom: Spacing.base,
    paddingLeft: Spacing.base,
    paddingRight: Spacing.base,
    borderRadius: 0,
  },
  iconDisabledTextStyle: {
    fontSize: IconSize.regular,
    color: GrayScaleColor.disabledGray,
  },
  iconButtonDisabledViewStyle: {
    backgroundColor: 'transparent',
    width: 'auto',
  },
};
