// Copyright 2020 Prescryptive Health, Inc.

import { ViewStyle, TextStyle } from 'react-native';
import { Spacing } from '../../../theming/spacing';
import {
  FontWeight,
  getFontDimensions,
  getFontFace,
  HomeScreenSmallFontSize,
} from '../../../theming/fonts';
import { PrimaryColor } from '../../../theming/colors';
import {
  homeScreenStyles,
  homeScreenWelcomeHeaderWebTextStyle,
  IHomeScreenStyles,
} from './home-screen.styles';

describe('homeScreenStyles', () => {
  it('has expected styles for homeScreen', () => {
    const homeFeedHeaderViewStyle: ViewStyle = {
      paddingBottom: 0,
    };
    const homeScreenWelcomeHeaderViewStyle: ViewStyle = {
      alignItems: 'flex-start',
      flexGrow: 0,
      marginBottom: Spacing.times1pt5,
    };
    const drugSearchButtonViewStyle: ViewStyle = {
      marginTop: Spacing.times2,
      marginBottom: Spacing.base,
    };
    const homeScreenBodyViewStyle: ViewStyle = {
      paddingLeft: Spacing.times1pt25,
      paddingRight: Spacing.times1pt25,
    };
    const homeScreenWelcomeHeaderTextStyle: TextStyle = {
      ...getFontDimensions(HomeScreenSmallFontSize.h1),
      ...getFontFace({ family: 'Poppins', weight: FontWeight.semiBold }),
      color: PrimaryColor.plum,
    };

    const cobrandingHeaderViewStyle: ViewStyle = {
      marginTop: Spacing.base,
    };

    const expectedStyles: IHomeScreenStyles = {
      homeFeedHeaderViewStyle,
      homeScreenWelcomeHeaderViewStyle,
      homeScreenWelcomeHeaderTextStyle,
      drugSearchButtonViewStyle,
      homeScreenBodyViewStyle,
      cobrandingHeaderViewStyle,
    };
    expect(homeScreenStyles).toEqual(expectedStyles);
  });

  it('has expected styles for homeScreenWelcomeHeaderText', () => {
    const expectedStyles = {
      backgroundImage: `linear-gradient(${PrimaryColor.prescryptivePurple}, #814A84)`,
      fontSize: HomeScreenSmallFontSize.h1,
      lineHeight: 1.5,
      ...getFontFace({ family: 'Poppins', weight: FontWeight.semiBold }),
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginTop: Spacing.times2,
      marginBottom: 0,
    };
    expect(homeScreenWelcomeHeaderWebTextStyle).toEqual(expectedStyles);
  });
});
