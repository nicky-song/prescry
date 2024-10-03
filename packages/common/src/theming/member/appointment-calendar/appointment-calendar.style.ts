// Copyright 2020 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { GreyScale, PurpleScale, FontSize } from '../../theme';
import { FontWeight, getFontFace } from '../../fonts';
import { Theme } from 'react-native-calendars/src/types';
import { Spacing } from '../../spacing';
import { GrayScaleColor } from '../../colors';

const calendarThemeViewStyle: ViewStyle = {
  marginTop: Spacing.base,
  marginBottom: Spacing.base,
};

const leftArrowViewStyle: ViewStyle = {
  alignSelf: 'flex-start',
};
const rightArrowViewStyle: ViewStyle = {
  alignSelf: 'flex-end',
};
const arrowEnabledViewStyle: TextStyle = {
  color: GreyScale.darkest,
};

const arrowDisabledViewStyle: TextStyle = {
  color: GreyScale.light,
};

const textDayHeaderFontFace = getFontFace({ weight: FontWeight.semiBold });
const textMonthHeaderFontFace = getFontFace({ weight: FontWeight.bold });
const textDayFontFace = textDayHeaderFontFace;

const calendarThemeStyle: Theme = {
  backgroundColor: GreyScale.lightest,
  calendarBackground: GreyScale.lightest,

  selectedDayBackgroundColor: PurpleScale.darkest,
  selectedDayTextColor: GreyScale.lightest,

  textDayHeaderFontFamily: textDayHeaderFontFace.fontFamily,
  textDayHeaderFontWeight: textDayHeaderFontFace.fontWeight,
  textDayHeaderFontSize: FontSize.smaller,
  textSectionTitleColor: GreyScale.darkest,
  todayTextColor: GreyScale.lighterDark,
  textDisabledColor: GreyScale.light,
  monthTextColor: GrayScaleColor.primaryText,
  textMonthFontFamily: textMonthHeaderFontFace.fontFamily,
  textMonthFontWeight: textMonthHeaderFontFace.fontWeight,
  textMonthFontSize: FontSize.regular,
  textDayStyle: {
    alignItems: 'center',
    fontFamily: textDayFontFace.fontFamily,
    fontWeight: textDayFontFace.fontWeight,
    fontSize: FontSize.small,
    color: GreyScale.lighterDark,
    marginTop: Spacing.quarter,
  },
};

export const appointmentCalendarStyle = {
  calendarThemeViewStyle,
  calendarThemeStyle,
  leftArrowViewStyle,
  rightArrowViewStyle,
  arrowEnabledViewStyle,
  arrowDisabledViewStyle,
};
