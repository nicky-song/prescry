// Copyright 2021 Prescryptive Health, Inc.

import { ViewStyle, ImageStyle, TextStyle } from 'react-native';
import { GrayScaleColor } from '../../../../theming/colors';
import { FontSize } from '../../../../theming/fonts';
import { Spacing } from '../../../../theming/spacing';

export interface IOrderConfirmationScreenStyles {
  separatorViewStyle: ViewStyle;
  titleViewStyle: ViewStyle;
  checkImageStyle: ImageStyle;
  bodyViewStyle: ViewStyle;
  headerViewStyle: ViewStyle;
  couponViewStyle: ViewStyle;
  linkTextStyle: TextStyle;
  customerSupportWithFooterViewStyle: ViewStyle;
  customerSupportWithoutFooterViewStyle: ViewStyle;
  bottomSeparatorViewStyle: ViewStyle;
  orderConfirmationTitleViewStyle: ViewStyle;
  favoritingNotificationViewStyle: ViewStyle;
  orderConfirmationTitleTextStyle: TextStyle;
  stickyViewStyle: ViewStyle;
  whatIsNextSectionViewStyle: ViewStyle;
}

export const orderConfirmationScreenStyles: IOrderConfirmationScreenStyles = {
  separatorViewStyle: {
    marginTop: Spacing.base,
    marginBottom: Spacing.base,
  },
  bottomSeparatorViewStyle: {
    marginTop: Spacing.base,
    marginBottom: Spacing.base,
    marginLeft: -Spacing.times1pt5,
    marginRight: -Spacing.times1pt5,
  },
  checkImageStyle: {
    height: 16,
    width: 16,
    marginRight: Spacing.base,
  },
  bodyViewStyle: {
    alignContent: 'center',
    alignSelf: 'stretch',
    flexGrow: 1,
  },
  titleViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  headerViewStyle: {
    paddingBottom: 0,
  },
  couponViewStyle: {
    marginTop: Spacing.base,
    marginBottom: Spacing.times2,
  },
  linkTextStyle: {
    fontSize: FontSize.small,
  },
  customerSupportWithFooterViewStyle: {
    marginTop: Spacing.base,
  },
  customerSupportWithoutFooterViewStyle: {
    marginTop: Spacing.base,
    marginBottom: Spacing.times2,
  },
  orderConfirmationTitleViewStyle: {
    marginLeft: Spacing.base,
    flex: 1,
  },
  favoritingNotificationViewStyle: {
    width: '100%',
  },
  orderConfirmationTitleTextStyle: {
    flexWrap: 'wrap',
  },
  stickyViewStyle: {
    backgroundColor: GrayScaleColor.white,
    paddingTop: Spacing.base,
    paddingRight: Spacing.times1pt5,
    paddingLeft: Spacing.times1pt5,
    paddingBottom: Spacing.base,
  },
  whatIsNextSectionViewStyle: {
    marginTop: Spacing.base,
    marginBottom: Spacing.half,
  },
};
