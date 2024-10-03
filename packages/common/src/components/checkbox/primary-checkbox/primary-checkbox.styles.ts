// Copyright 2021 Prescryptive Health, Inc.

import { ImageStyle, TextStyle, ViewStyle } from 'react-native';
import { PrimaryColor } from '../../../theming/colors';
import { Spacing } from '../../../theming/spacing';

export interface IPrimaryCheckBoxStyles {
  checkBoxImageStyles: ImageStyle;
  checkBoxViewStyles: ViewStyle;
  iconTextStyle: Pick<TextStyle, 'color' | 'fontSize'>;
}

export const primaryCheckBoxStyles: IPrimaryCheckBoxStyles = {
  checkBoxImageStyles: {
    flexGrow: 0,
    marginRight: Spacing.threeQuarters,
  },
  checkBoxViewStyles: {
    flexDirection: 'row',
    flexGrow: 1,
    alignItems: 'center',
  },
  iconTextStyle: {
    color: PrimaryColor.prescryptivePurple,
    fontSize: 22,
  },
};
