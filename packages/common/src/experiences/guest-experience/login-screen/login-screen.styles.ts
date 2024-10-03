// Copyright 2021 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { NotificationColor } from '../../../theming/colors';
import { Spacing } from '../../../theming/spacing';
import { PurpleScale } from '../../../theming/theme';

export interface ILoginScreenStyles {
  basicPageBodyViewStyle: ViewStyle;
  basicPageHeaderViewStyle: ViewStyle;
  bodyViewStyle: ViewStyle;
  buttonViewStyle: ViewStyle;
  errorMessageTextStyle: TextStyle;
  headingTextStyle: TextStyle;
  errorColorTextStyle: Pick<TextStyle, 'color'>;
}

const errorMessageTextStyle: TextStyle = {
  marginTop: Spacing.half,
};

const buttonViewStyle: ViewStyle = {
  marginTop: Spacing.times1pt25,
};

export const loginScreenStyles: ILoginScreenStyles = {
  basicPageBodyViewStyle: {
    paddingBottom: 0,
  },
  basicPageHeaderViewStyle: {
    alignItems: 'stretch',
    alignSelf: 'stretch',
    backgroundColor: PurpleScale.lighter,
  },
  bodyViewStyle: {
    paddingTop: Spacing.times1pt5,
    paddingRight: Spacing.times1pt5,
    paddingBottom: Spacing.times1pt5,
    paddingLeft: Spacing.times1pt5,
  },
  buttonViewStyle,
  errorMessageTextStyle,
  headingTextStyle: {
    marginBottom: Spacing.times2,
  },
  errorColorTextStyle: {
    color: NotificationColor.red,
  },
};
