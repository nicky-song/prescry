// Copyright 2021 Prescryptive Health, Inc.

import { ViewStyle, TextStyle } from 'react-native';
import { FontSize } from '../../../../../theming/fonts';
import { Spacing } from '../../../../../theming/spacing';

export interface ICreateAccountBodyStyles {
  textFieldsViewStyle: ViewStyle;
  fullItemViewStyle: ViewStyle;
  createAccountBodyContainerViewStyle: ViewStyle;
  dateWrapperViewStyle: ViewStyle;
  fullNameViewStyle: ViewStyle;
  leftItemViewStyle: ViewStyle;
  rightItemViewStyle: ViewStyle;
  termsAndConditionsViewStyle: ViewStyle;
  termsAndConditionsBelowViewStyle: ViewStyle;
  attestAuthorizationViewStyle: ViewStyle;
  helpTextStyle: TextStyle;
  errorTextStyle: TextStyle;
}

export const createAccountBodyStyles: ICreateAccountBodyStyles = {
  textFieldsViewStyle: {
    marginTop: Spacing.times1pt5,
  },
  fullItemViewStyle: {
    marginTop: Spacing.times1pt5,
    justifyContent: 'flex-start',
    maxWidth: '100%',
    width: '100%',
  },
  createAccountBodyContainerViewStyle: {
    flexDirection: 'column',
  },
  dateWrapperViewStyle: {
    marginTop: Spacing.times1pt5,
  },
  fullNameViewStyle: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  leftItemViewStyle: {
    marginTop: Spacing.times1pt5,
    justifyContent: 'flex-start',
    maxWidth: '48%',
  },
  rightItemViewStyle: {
    marginTop: Spacing.times1pt5,
    justifyContent: 'flex-end',
    maxWidth: '48%',
  },
  termsAndConditionsViewStyle: {
    marginTop: Spacing.times2,
    marginBottom: Spacing.base,
  },
  termsAndConditionsBelowViewStyle: {
    marginTop: Spacing.base,
    marginBottom: Spacing.base,
  },
  attestAuthorizationViewStyle: {
    marginTop: Spacing.times2,
  },
  helpTextStyle: {
    marginTop: Spacing.threeQuarters,
    fontSize: FontSize.small,
  },
  errorTextStyle: {
    marginTop: Spacing.threeQuarters,
  },
};
