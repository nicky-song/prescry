// Copyright 2021 Prescryptive Health, Inc.

import { TextStyle } from 'react-native';

export type SkeletonWidth = 'shorter' | 'short' | 'medium' | 'long';

export enum FontSize {
  h1 = 24,
  h2 = 20,
  h3 = 18,
  xLarge = 22,
  large = 18,
  body = 16,
  small = 14,
  xSmall = 12,
}

export enum HomeScreenSmallFontSize {
  h1 = 40,
  h2 = 32,
  h3 = 24,
}

export enum HomeScreenLargeFontSize {
  h1 = 48,
  h2 = 40,
}

export enum FontWeight {
  light = '300',
  regular = '400',
  medium = '500',
  semiBold = '600',
  bold = '700',
}

export const getFontDimensions = (
  fontSize: number,
  lineHeight = 1.5
): TextStyle => ({
  fontSize,
  lineHeight: fontSize * lineHeight,
});

export type FontFamilyName = 'OpenSans' | 'Poppins';
export type FontStyle = 'normal' | 'italic';

export type IFontFace = Pick<
  TextStyle,
  'fontFamily' | 'fontWeight' | 'fontStyle'
>;

const weightNameMap = new Map<FontWeight, string>([
  [FontWeight.light, 'Light'],
  [FontWeight.regular, 'Regular'],
  [FontWeight.medium, 'Medium'],
  [FontWeight.semiBold, 'SemiBold'],
  [FontWeight.bold, 'Bold'],
]);

const getFontNameFallbacks = (
  family: FontFamilyName,
  weight: FontWeight
): string => {
  const defaultFallback = ',sans-serif';

  return weight === '400'
    ? defaultFallback
    : `,${family}_400Regular${defaultFallback}`;
};

export interface IFontAttributes {
  family?: FontFamilyName;
  weight?: FontWeight;
  style?: FontStyle;
}

export const getFontFace = (attributes: IFontAttributes = {}): IFontFace => {
  const {
    family = 'OpenSans',
    weight = FontWeight.regular,
    style,
  } = attributes;

  const styleName = style === 'italic' ? '_Italic' : '';
  const name = `${family}_${weight}${
    weightNameMap.get(weight) ?? 'Regular'
  }${styleName}`;

  const nameWithFallbacks = `${name}${getFontNameFallbacks(family, weight)}`;
  return {
    fontFamily: nameWithFallbacks,
    fontWeight: weight,
    fontStyle: style,
  };
};
