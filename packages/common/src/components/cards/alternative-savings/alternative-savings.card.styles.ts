// Copyright 2022 Prescryptive Health, Inc.

import { ViewStyle, TextStyle } from 'react-native';
import { BorderRadius } from '../../../theming/borders';
import { NotificationColor } from '../../../theming/colors';
import { FontWeight, getFontFace } from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';

export interface IAlternativeSavingsCardStyles {
  viewStyle: ViewStyle;
  contentViewStyle: ViewStyle;
  messageTextStyle: TextStyle;
}
export const alternativeSavingsCardStyles: IAlternativeSavingsCardStyles = {
  viewStyle: {
    backgroundColor: NotificationColor.lightGreen,
    borderRadius: BorderRadius.normal,
    padding: Spacing.base,
  },
  contentViewStyle: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1,
  },
  messageTextStyle: {
    ...getFontFace({ weight: FontWeight.semiBold }),
    marginLeft: Spacing.base,
    flexWrap: 'wrap',
  },
};
