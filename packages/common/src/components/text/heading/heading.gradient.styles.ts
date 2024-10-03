// Copyright 2021 Prescryptive Health, Inc.

import { TextStyle } from 'react-native';
import {
  FontWeight,
  getFontDimensions,
  getFontFace,
  HomeScreenLargeFontSize,
  HomeScreenSmallFontSize,
} from '../../../theming/fonts';
import { PrimaryColor } from '../../../theming/colors';
import { CSSProperties } from 'react';

export interface IHeadingGradientStyles {
  headingTextStyle: TextStyle;
}

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

export const headingWebLargeTextStyle: CSSProperties = {
  ...headingWebCommonTextStyle,
  fontSize: HomeScreenLargeFontSize.h1,
};

export const headingWebSmallTextStyle: CSSProperties = {
  ...headingWebCommonTextStyle,
  fontSize: HomeScreenSmallFontSize.h1,
};

export const headingGradientStyles: IHeadingGradientStyles = {
  headingTextStyle: {
    color: PrimaryColor.prescryptivePurple,
    ...getFontFace({ weight: FontWeight.semiBold }),
    ...getFontDimensions(HomeScreenSmallFontSize.h1),
  },
};
