// Copyright 2021 Prescryptive Health, Inc.

import { ViewStyle } from 'react-native';
import { GrayScaleColor, PrimaryColor } from '../../../../../theming/colors';
import {
  FontSize,
  FontWeight,
  getFontDimensions,
  getFontFace,
  HomeScreenLargeFontSize,
  HomeScreenSmallFontSize,
} from '../../../../../theming/fonts';
import { Spacing } from '../../../../../theming/spacing';
import {
  IUnauthHomeScreenStyles,
  unauthHomeScreenDesktopStyles,
  unauthHomeScreenStyles,
} from './unauth.home.screen.styles';

describe('unauthHomeScreenStyles', () => {
  it('has expected styles', () => {
    const commonMarketingCardViewStyle: ViewStyle = {
      flex: 1,
    };

    const expectedDesktopStyles: IUnauthHomeScreenStyles = {
      containerViewStyle: {
        paddingTop: Spacing.times4,
        paddingLeft: Spacing.times8,
        paddingRight: Spacing.times8,
        paddingBottom: Spacing.times4,
        marginBottom: Spacing.times5,
        alignSelf: 'center',
        width: '100%',
      },
      scrollViewStyle: {
        marginTop: Spacing.times2,
        paddingTop: Spacing.times2,
      },
      drugSearchCardViewStyle: {
        marginTop: Spacing.times4,
        marginBottom: -Spacing.base,
      },
      sectionContentTextStyle: {
        ...getFontDimensions(FontSize.xLarge),
        color: PrimaryColor.darkPurple,
        paddingTop: Spacing.times1pt5,
        paddingBottom: Spacing.times3,
      },
      prescriptionBenefitsViewStyle: { width: '100%' },
      prescriptionBenefitsButtonViewStyle: {
        width: 366,
        backgroundColor: PrimaryColor.darkPurple,
      },
      unauthLowerSectionViewStyle: {
        backgroundColor: GrayScaleColor.lightGray,
      },
      backgroundIconImageStyle: {
        width: '100%',
        height: 320,
        marginBottom: Spacing.times4,
      },
      marketingCardSectionViewStyle: { marginTop: Spacing.times4 },
      firstMarketingCardRowViewStyle: {
        flexDirection: 'row',
        marginBottom: Spacing.base,
      },
      lastMarketingCardRowViewStyle: {
        flexDirection: 'row',
        marginTop: Spacing.base,
        marginBottom: Spacing.times9,
      },
      firstMarketingCardViewStyle: {
        ...commonMarketingCardViewStyle,
        marginRight: Spacing.times2,
      },
      lastMarketingCardViewStyle: {
        ...commonMarketingCardViewStyle,
        marginLeft: Spacing.times2,
      },
      sectionTitleTextStyle: {
        ...getFontDimensions(HomeScreenLargeFontSize.h2),
        ...getFontFace({ family: 'Poppins', weight: FontWeight.semiBold }),
        textAlign: 'left',
      },
      scrollContainerViewStyle: { alignItems: 'center' },
      bodyViewStyle: {
        width: '100%',
        paddingBottom: 0,
      },
      healthcareTechnologyViewStyle: { width: '100%' },
    };

    const expectedMobileStyles: IUnauthHomeScreenStyles = {
      containerViewStyle: {
        paddingTop: Spacing.times2,
        paddingLeft: Spacing.times1pt5,
        paddingRight: Spacing.times1pt5,
      },
      scrollViewStyle: {
        paddingTop: Spacing.base,
        paddingBottom: Spacing.base,
      },
      scrollContainerViewStyle: { alignItems: 'stretch' },
      drugSearchCardViewStyle: {
        marginTop: Spacing.times3,
        marginBottom: -Spacing.base,
      },
      sectionTitleTextStyle: {
        ...getFontDimensions(HomeScreenSmallFontSize.h2),
        ...getFontFace({ family: 'Poppins', weight: FontWeight.semiBold }),
        textAlign: 'left',
      },
      sectionContentTextStyle: {
        color: PrimaryColor.darkPurple,
        paddingTop: Spacing.base,
        paddingBottom: Spacing.times2,
      },
      prescriptionBenefitsViewStyle: {
        marginTop: Spacing.times3,
      },
      prescriptionBenefitsButtonViewStyle: {
        backgroundColor: PrimaryColor.darkPurple,
        paddingLeft: Spacing.times3,
        paddingRight: Spacing.times3,
        marginBottom: Spacing.times3,
      },
      unauthLowerSectionViewStyle: {
        backgroundColor: GrayScaleColor.lightGray,
        paddingBottom: Spacing.times2,
      },
      backgroundIconImageStyle: {
        width: '100%',
        height: 160,
      },
      marketingCardSectionViewStyle: { marginBottom: Spacing.base },
      firstMarketingCardRowViewStyle: {
        flexDirection: 'column',
      },
      lastMarketingCardRowViewStyle: {
        flexDirection: 'column',
      },
      firstMarketingCardViewStyle: {
        marginBottom: Spacing.base,
      },
      lastMarketingCardViewStyle: {
        marginBottom: Spacing.base,
      },
      bodyViewStyle: {
        paddingBottom: 0,
      },
    };

    expect(unauthHomeScreenDesktopStyles).toEqual(expectedDesktopStyles);
    expect(unauthHomeScreenStyles).toEqual(expectedMobileStyles);
  });
});
