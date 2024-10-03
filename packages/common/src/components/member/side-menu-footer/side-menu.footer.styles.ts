// Copyright 2021 Prescryptive Health, Inc.

import { ViewStyle, TextStyle } from 'react-native';
import { FontSize, getFontDimensions } from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';

export interface ISideMenuFooterStyles {
  termsConditionsAndPrivacyLinksStyles: ViewStyle;
  copyrightTextStyle: TextStyle;
  rightsReservedTextStyle: TextStyle;
  sideMenuFooterContainerViewStyle: ViewStyle;
}

export const sideMenuFooterStyles: ISideMenuFooterStyles = {
  termsConditionsAndPrivacyLinksStyles: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  copyrightTextStyle: {
    marginTop: Spacing.threeQuarters,
    ...getFontDimensions(FontSize.small),
  },
  rightsReservedTextStyle: {
    marginTop: Spacing.half,
    ...getFontDimensions(FontSize.small),
  },
  sideMenuFooterContainerViewStyle: {
    bottom: 0,
    width: '100%',
    paddingLeft: Spacing.times1pt5,
    paddingRight: Spacing.times1pt5,
    paddingBottom: Spacing.times2,
    flexDirection: 'column',
    position: 'absolute',
    alignItems: 'flex-start',
  },
};
