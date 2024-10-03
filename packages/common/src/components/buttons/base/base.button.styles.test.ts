// Copyright 2021 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { BorderRadius } from '../../../theming/borders';
import { Spacing } from '../../../theming/spacing';
import { PrimaryColor, GrayScaleColor } from '../../../theming/colors';
import { baseButtonStyles, IBaseButtonStyles } from './base.button.styles';
import {
  getFontDimensions,
  FontSize,
  FontWeight,
  getFontFace,
} from '../../../theming/fonts';

describe('baseButtonStyles', () => {
  it('has expected styles', () => {
    const commonViewStyle: ViewStyle = {
      alignItems: 'center',
      flexGrow: 0,
      justifyContent: 'center',
      borderRadius: BorderRadius.rounded,
    };

    const commonLargeViewStyle: ViewStyle = {
      ...commonViewStyle,
      width: '100%',
      paddingTop: Spacing.base,
      paddingBottom: Spacing.base,
      paddingRight: Spacing.times1pt5,
      paddingLeft: Spacing.times1pt5,
    };

    const commonMediumViewStyle: ViewStyle = {
      ...commonViewStyle,
      width: 'fit-content',
      height: 32,
      paddingTop: Spacing.half,
      paddingBottom: Spacing.half,
      paddingRight: Spacing.times2,
      paddingLeft: Spacing.times2,
    };

    const commonTextStyle: TextStyle = {
      color: GrayScaleColor.white,
      ...getFontFace({ weight: FontWeight.semiBold }),
    };

    const commonLargeTextStyle: TextStyle = commonTextStyle;

    const commonMediumTextStyle: TextStyle = {
      ...commonTextStyle,
      ...getFontDimensions(FontSize.small),
    };

    const expectedStyles: IBaseButtonStyles = {
      enabledLargeViewStyle: {
        ...commonLargeViewStyle,
        backgroundColor: PrimaryColor.darkPurple,
      },
      disabledLargeViewStyle: {
        ...commonLargeViewStyle,
        backgroundColor: GrayScaleColor.disabledGray,
      },
      enabledMediumViewStyle: {
        ...commonMediumViewStyle,
        backgroundColor: PrimaryColor.darkBlue,
      },
      disabledMediumViewStyle: {
        ...commonMediumViewStyle,
        backgroundColor: GrayScaleColor.disabledGray,
      },
      enabledLargeTextStyle: commonLargeTextStyle,
      disabledLargeTextStyle: commonLargeTextStyle,
      enabledMediumTextStyle: commonMediumTextStyle,
      disabledMediumTextStyle: commonMediumTextStyle,
    };

    expect(baseButtonStyles).toEqual(expectedStyles);
  });
});
