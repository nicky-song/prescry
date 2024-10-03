// Copyright 2021 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { GrayScaleColor } from '../../../theming/colors';
import { FontWeight, getFontFace } from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';

export interface IPrescriberDetailsStyle {
  callButtonView: ViewStyle;
  doctorContactText: TextStyle;
  prescriberText: TextStyle;
}

export const prescriberDetailsStyle: IPrescriberDetailsStyle = {
  callButtonView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: GrayScaleColor.white,
    paddingTop: Spacing.half,
    paddingLeft: 0,
  },
  doctorContactText: {
    ...getFontFace(),
    color: GrayScaleColor.black,
  },
  prescriberText: {
    ...getFontFace({ weight: FontWeight.bold }),
    marginBottom: Spacing.threeQuarters,
  },
};
