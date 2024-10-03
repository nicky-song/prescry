// Copyright 2022 Prescryptive Health, Inc.

import { ImageStyle, ViewStyle, TextStyle } from 'react-native';
import { PrimaryColor } from '../../../../../../theming/colors';
import { FontSize, getFontDimensions } from '../../../../../../theming/fonts';
import { Spacing } from '../../../../../../theming/spacing';

export interface IFooterStyles {
  footerViewStyle: ViewStyle;
  prescryptiveLogoImageStyle: ImageStyle;
  linkTextStyle: TextStyle;
  prescryptiveLogoContainerViewStyle: ViewStyle;
  languagePickerAndLinksContainerViewStyle: ViewStyle;
  languagePickerContainerViewStyle: TextStyle;
  languagePickerTextStyle: TextStyle;
  termsAndConditionsLinkTextStyle: TextStyle;
}

export const footerBackgroundGradient = {
  backgroundImage: `linear-gradient(131.61deg, ${PrimaryColor.prescryptivePurple}, ${PrimaryColor.plum})`,
};

const footerDesktopStyles: IFooterStyles = {
  footerViewStyle: {
    minWidth: '100%',
    paddingTop: Spacing.times1pt5,
    paddingBottom: Spacing.times1pt5,
    paddingLeft: Spacing.times8,
    paddingRight: Spacing.times8,
    flexDirection: 'row',
    height: 80,
    justifyContent: 'space-between',
    alignItems: 'center',
    ...footerBackgroundGradient,
  },
  prescryptiveLogoImageStyle: {
    height: 48,
    width: 128,
    flexGrow: 0,
  },
  linkTextStyle: {
    color: PrimaryColor.lightPurple,
    marginLeft: Spacing.times3,
    ...getFontDimensions(FontSize.small),
    maxWidth: 'fit-content',
    flex: 1,
  },
  languagePickerAndLinksContainerViewStyle: {
    flexDirection: 'row',
    flexGrow: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  languagePickerTextStyle: {
    flexGrow: 0,
  },
  prescryptiveLogoContainerViewStyle: {},
  languagePickerContainerViewStyle: {
    marginLeft: Spacing.times3,
    flexDirection: 'row',
    maxWidth: 'fit-content',
    flex: 1,
  },
  termsAndConditionsLinkTextStyle: {},
};

const footerStyles: IFooterStyles = {
  footerViewStyle: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingLeft: Spacing.base,
    paddingRight: Spacing.base,
    paddingTop: Spacing.times1pt5,
    paddingBottom: Spacing.times1pt5,
    ...footerBackgroundGradient,
  },
  prescryptiveLogoImageStyle: {
    height: 48,
    width: 128,
    marginBottom: Spacing.times1pt5,
  },
  linkTextStyle: {
    color: PrimaryColor.lightPurple,
    width: '100%',
    textAlign: 'left',
    paddingLeft: Spacing.half,
    ...getFontDimensions(FontSize.small),
  },
  languagePickerAndLinksContainerViewStyle: {},
  languagePickerTextStyle: {},
  prescryptiveLogoContainerViewStyle: {
    alignSelf: 'center',
  },
  languagePickerContainerViewStyle: {
    marginBottom: Spacing.threeQuarters,
  },
  termsAndConditionsLinkTextStyle: { marginTop: Spacing.threeQuarters },
};

export const getFooterStyles = (isDesktop: boolean): IFooterStyles => {
  return isDesktop ? footerDesktopStyles : footerStyles;
};
