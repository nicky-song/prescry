// Copyright 2021 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { GrayScaleColor } from '../../../../../theming/colors';
import { getFontDimensions } from '../../../../../theming/fonts';
import { Spacing } from '../../../../../theming/spacing';
import { FontSize } from '../../../../../theming/theme';

export interface IOrderPreviewScreenStyles {
  bodyViewStyle: ViewStyle;
  headerViewStyle: ViewStyle;
  heading2TextStyle: TextStyle;
  heading3TextStyle: TextStyle;
  hoursTextStyle: TextStyle;
  pharmacyInfoHeadingTextStyle: TextStyle;
  pharmacyTextViewStyle: ViewStyle;
  PrescriptionPriceSectionViewStyle: ViewStyle;
  couponViewStyle: ViewStyle;
  prescriptionOrderCardViewStyle: ViewStyle;
  favoritingNotificationViewStyle: ViewStyle;
  estimatedPriceNoticeTextStyle: TextStyle;
  stickyViewStyle: ViewStyle;
}

export const orderPreviewScreenStyles: IOrderPreviewScreenStyles = {
  bodyViewStyle: {
    alignContent: 'center',
    alignSelf: 'stretch',
    flexGrow: 1,
  },
  headerViewStyle: {
    paddingBottom: 0,
  },
  heading2TextStyle: {
    marginTop: Spacing.base,
    marginBottom: Spacing.base,
  },
  heading3TextStyle: {
    marginTop: Spacing.base,
    marginBottom: Spacing.base,
  },
  hoursTextStyle: {
    ...getFontDimensions(FontSize.larger),
  },
  pharmacyInfoHeadingTextStyle: {
    marginTop: Spacing.base,
    marginBottom: Spacing.base,
    ...getFontDimensions(FontSize.ultra),
  },
  pharmacyTextViewStyle: {
    marginTop: Spacing.base,
  },
  PrescriptionPriceSectionViewStyle: {
    marginTop: Spacing.base,
    marginBottom: Spacing.base,
  },
  couponViewStyle: {
    marginTop: Spacing.base,
    marginBottom: Spacing.base,
  },
  prescriptionOrderCardViewStyle: {
    marginVertical: Spacing.base,
  },
  favoritingNotificationViewStyle: {
    width: '100%',
  },
  estimatedPriceNoticeTextStyle: {
    paddingLeft: Spacing.base,
    paddingRight: Spacing.base,
    paddingTop: Spacing.base,
    ...getFontDimensions(FontSize.small),
  },
  stickyViewStyle: {
    backgroundColor: GrayScaleColor.white,
    paddingTop: Spacing.base,
    paddingRight: Spacing.times1pt5,
    paddingLeft: Spacing.times1pt5,
  },
};
