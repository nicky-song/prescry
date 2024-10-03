// Copyright 2021 Prescryptive Health, Inc.

import { ViewStyle } from 'react-native';
import { PrimaryColor, GrayScaleColor } from '../../../theming/colors';
import { Spacing } from '../../../theming/spacing';
import {
  ISecondaryButtonStyles,
  secondaryButtonStyles,
} from './secondary.button.styles';

describe('secondaryButtonStyles', () => {
  it('has expected styles', () => {
    const commonViewStyle: ViewStyle = {
      backgroundColor: GrayScaleColor.white,
    };

    const borderWidthLarge = 2;
    const borderWidthMedium = 1;
    const paddingHorizontalLarge = 56;

    const commonLargeViewStyle: ViewStyle = {
      ...commonViewStyle,
      borderWidth: borderWidthLarge,
      paddingTop: Spacing.base - borderWidthLarge,
      paddingBottom: Spacing.base - borderWidthLarge,
      paddingRight: paddingHorizontalLarge - borderWidthLarge,
      paddingLeft: paddingHorizontalLarge - borderWidthLarge,
    };

    const commonMediumViewStyle: ViewStyle = {
      ...commonViewStyle,
      borderWidth: borderWidthMedium,
      paddingTop: Spacing.half - borderWidthMedium,
      paddingBottom: Spacing.half - borderWidthMedium,
      paddingRight: Spacing.times2 - borderWidthMedium,
      paddingLeft: Spacing.times2 - borderWidthMedium,
    };

    const expectedStyles: ISecondaryButtonStyles = {
      enabledLargeViewStyle: {
        ...commonLargeViewStyle,
        borderColor: PrimaryColor.darkPurple,
      },
      disabledLargeViewStyle: {
        ...commonLargeViewStyle,
        borderColor: GrayScaleColor.disabledGray,
      },
      enabledMediumViewStyle: {
        ...commonMediumViewStyle,
        borderColor: PrimaryColor.darkBlue,
      },
      disabledMediumViewStyle: {
        ...commonMediumViewStyle,
        borderColor: GrayScaleColor.disabledGray,
      },
      enabledLargeTextStyle: {
        color: PrimaryColor.darkPurple,
      },
      disabledLargeTextStyle: {
        color: GrayScaleColor.disabledGray,
      },
      enabledMediumTextStyle: {
        color: PrimaryColor.darkBlue,
      },
      disabledMediumTextStyle: {
        color: GrayScaleColor.disabledGray,
      },
    };

    expect(secondaryButtonStyles).toEqual(expectedStyles);
  });
});
