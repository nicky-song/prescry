// Copyright 2022 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { NotificationColor } from '../../../theming/colors';
import { IconSize } from '../../../theming/icons';
import { Spacing } from '../../../theming/spacing';

export interface IDosageInstructionTextStyles {
  instructionTextStyle: TextStyle;
  iconTextStyle: TextStyle;
  viewStyle: ViewStyle;
}

export const dosageInstructionTextStyles: IDosageInstructionTextStyles = {
  instructionTextStyle: {
    marginLeft: Spacing.half,
  },
  iconTextStyle: {
    color: NotificationColor.darkYellow,
    fontSize: IconSize.regular,
  },
  viewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
};
