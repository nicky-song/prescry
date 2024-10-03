// Copyright 2021 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { BorderRadius } from '../../../theming/borders';
import { GrayScaleColor, NotificationColor } from '../../../theming/colors';
import { FontSize } from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';

export interface IPrimaryTextInputStyles {
  errorMessageTextStyle: TextStyle;
  helpMessageTextStyle: TextStyle;
  inputTextStyle: TextStyle;
  readOnlyTextStyle: TextStyle;
  inputErrorTextStyle: TextStyle;
  viewStyle: ViewStyle;
  textInputSkeletonViewStyle: ViewStyle;
}

const commonInputTextStyle: TextStyle = {
  borderColor: GrayScaleColor.borderLines,
  borderWidth: 1,
  borderRadius: BorderRadius.normal,
  fontSize: FontSize.body,
  color: GrayScaleColor.primaryText,
  paddingTop: Spacing.threeQuarters,
  paddingRight: Spacing.base,
  paddingBottom: Spacing.threeQuarters,
  paddingLeft: Spacing.base,
  width: '100%',
};

export const primaryTextInputStyles: IPrimaryTextInputStyles = {
  errorMessageTextStyle: {
    marginTop: Spacing.threeQuarters,
  },
  helpMessageTextStyle: {
    marginTop: Spacing.threeQuarters,
  },
  inputTextStyle: commonInputTextStyle,
  readOnlyTextStyle: {
    ...commonInputTextStyle,
    borderWidth: 0,
    paddingTop: 0,
    paddingBottom: 0,
  },
  inputErrorTextStyle: {
    borderColor: NotificationColor.red,
  },
  viewStyle: {
    flexDirection: 'column',
    flex: 1,
  },
  textInputSkeletonViewStyle: { height: 48, width: 175 },
};
