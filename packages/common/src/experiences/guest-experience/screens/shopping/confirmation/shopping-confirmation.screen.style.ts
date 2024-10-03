// Copyright 2021 Prescryptive Health, Inc.

import { ImageStyle, TextStyle, ViewStyle } from 'react-native';
import { Spacing } from '../../../../../theming/spacing';
import { FontSize } from '../../../../../theming/theme';

export interface IShoppingConfirmationScreenStyle {
  bodyContentViewStyle: ViewStyle;
  bodyViewStyle: ViewStyle;
  checkImageStyle: ImageStyle;
  footerViewStyle: ViewStyle;
  headerViewStyle: ViewStyle;
  heading2TextStyle: TextStyle;
  heading3TextStyle: TextStyle;
  titleViewStyle: ViewStyle;
  baseButtonTextStyle: TextStyle;
}

export const shoppingConfirmationScreenStyle: IShoppingConfirmationScreenStyle = {
  bodyContentViewStyle: {
    paddingRight: Spacing.times1pt5,
    paddingLeft: Spacing.times1pt5,
  },
  bodyViewStyle: {
    alignContent: 'center',
    alignSelf: 'stretch',
    flexGrow: 1,
  },
  checkImageStyle: {
    height: 16,
    width: 16,
    marginRight: Spacing.base,
  },
  footerViewStyle: {
    paddingTop: Spacing.times2,
    paddingRight: Spacing.times1pt5,
    paddingBottom: Spacing.base,
    paddingLeft: Spacing.times1pt5,
    alignSelf: 'stretch',
  },
  headerViewStyle: {
    paddingBottom: 0,
  },
  heading2TextStyle: {
    marginTop: Spacing.base,
    marginBottom: Spacing.base,
    fontSize: FontSize.ultra,
  },
  heading3TextStyle: {
    marginTop: Spacing.base,
    marginBottom: Spacing.base,
    fontSize: FontSize.larger,
  },
  baseButtonTextStyle: {
    textTransform: 'uppercase',
  },
  titleViewStyle: { flexDirection: 'row', alignItems: 'center' },
};
