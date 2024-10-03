// Copyright 2021 Prescryptive Health, Inc.

import {
  headingGradientStyles,
  IHeadingGradientStyles,
  headingWebSmallTextStyle,
  headingWebLargeTextStyle,
} from './heading.gradient.styles';
import {
  FontWeight,
  getFontDimensions,
  getFontFace,
  HomeScreenLargeFontSize,
  HomeScreenSmallFontSize,
} from '../../../theming/fonts';
import { PrimaryColor } from '../../../theming/colors';
import { CSSProperties } from 'react';

describe('headingGradientStyles', () => {
  it('has expected web styles', () => {
    const headingWebCommonTextStyle: CSSProperties = {
      backgroundImage: `linear-gradient(${PrimaryColor.prescryptivePurple}, #814A84)`,
      ...getFontFace({ weight: FontWeight.semiBold, family: 'Poppins' }),
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      lineHeight: 1.5,
      margin: 0,
      padding: 0,
      display: 'inline',
    };

    const expectedHeadingWebLargeTextStyle: CSSProperties = {
      ...headingWebCommonTextStyle,
      fontSize: HomeScreenLargeFontSize.h1,
    };
    expect(headingWebLargeTextStyle).toEqual(expectedHeadingWebLargeTextStyle);

    const expectedHeadingWebSmallTextStyle: CSSProperties = {
      ...headingWebCommonTextStyle,
      fontSize: HomeScreenSmallFontSize.h1,
    };
    expect(headingWebSmallTextStyle).toEqual(expectedHeadingWebSmallTextStyle);
  });

  it('has expected styles', () => {
    const expectedStyles: IHeadingGradientStyles = {
      headingTextStyle: {
        color: PrimaryColor.prescryptivePurple,
        ...getFontFace({ weight: FontWeight.semiBold }),
        ...getFontDimensions(HomeScreenSmallFontSize.h1),
      },
    };

    expect(headingGradientStyles).toEqual(expectedStyles);
  });
});
