// Copyright 2021 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { FontSize } from '../../../../theming/fonts';
import { Spacing } from '../../../../theming/spacing';

export interface ITermsConditionsAndPrivacyLinksStyles {
  dividerTextStyle: TextStyle;
  multiLineTextStyle: TextStyle;
  textStyle: TextStyle;
  viewStyle: ViewStyle;
}

export const termsConditionsAndPrivacyLinksStyles: ITermsConditionsAndPrivacyLinksStyles = {
  dividerTextStyle: {
    fontSize: FontSize.small,
    marginLeft: Spacing.half,
    marginRight: Spacing.half,
    flexGrow: 0,
  },
  multiLineTextStyle: {
    marginBottom: Spacing.half,
  },
  textStyle: {
    fontSize: FontSize.small,
  },
  viewStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
};
