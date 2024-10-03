// Copyright 2020 Prescryptive Health, Inc.

import { TextStyle } from 'react-native';
import { GrayScaleColor } from '../../../theming/colors';
import {
  FontSize,
  FontWeight,
  getFontDimensions,
  getFontFace,
} from '../../../theming/fonts';

export interface IHeadingStyles {
  headingTextStyle: TextStyle[];
}

const headingTextStyle: TextStyle = {
  color: GrayScaleColor.primaryText,
  ...getFontFace({ weight: FontWeight.semiBold }),
};

const heading1TextStyle: TextStyle = {
  ...headingTextStyle,
  ...getFontDimensions(FontSize.h1),
};

const heading2TextStyle: TextStyle = {
  ...headingTextStyle,
  ...getFontDimensions(FontSize.h2),
};

const heading3TextStyle: TextStyle = {
  ...headingTextStyle,
  ...getFontDimensions(FontSize.h3),
};

export const headingStyles: IHeadingStyles = {
  headingTextStyle: [heading1TextStyle, heading2TextStyle, heading3TextStyle],
};
