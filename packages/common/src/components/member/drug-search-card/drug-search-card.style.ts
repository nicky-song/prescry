// Copyright 2021 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { BorderRadius } from '../../../theming/borders';
import { GrayScaleColor } from '../../../theming/colors';
import { FontSize, FontWeight, getFontFace } from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';
import { PurpleScale } from '../../../theming/theme';

export interface IDrugSearchCardStyles {
  titleTextStyle: TextStyle;
  subtitleTextStyle: TextStyle;
  cardContainerViewStyle: ViewStyle;
  searchButtonContainerViewStyle: ViewStyle;
}

const backgroundGradient = {
  backgroundImage: `linear-gradient(130deg, ${PurpleScale.darkest}, ${PurpleScale.darker})`,
};

export const drugSearchCardDesktopStyles: IDrugSearchCardStyles = {
  titleTextStyle: {
    color: GrayScaleColor.white,
    fontSize: FontSize.h2,
    ...getFontFace({ family: 'Poppins', weight: FontWeight.semiBold }),
    marginTop: Spacing.quarter,
  },
  subtitleTextStyle: {
    fontSize: FontSize.xLarge,
    color: PurpleScale.lighter,
    paddingTop: Spacing.times2,
    marginBottom: Spacing.times4,
  },
  cardContainerViewStyle: {
    flex: 1,
    paddingLeft: Spacing.times2,
    paddingRight: Spacing.times2,
    paddingTop: Spacing.times2,
    borderRadius: BorderRadius.times1pt5,
    minHeight: 280,
    ...backgroundGradient,
  },
  searchButtonContainerViewStyle: {
    marginBottom: Spacing.times2,
    maxWidth: '50%',
  },
};

export const drugSearchCardStyles: IDrugSearchCardStyles = {
  titleTextStyle: {
    ...getFontFace({ family: 'Poppins', weight: FontWeight.semiBold }),
    fontSize: FontSize.xLarge,
    color: GrayScaleColor.white,
    marginBottom: 35,
  },
  subtitleTextStyle: {
    ...getFontFace({ family: 'Poppins', weight: FontWeight.semiBold }),
    fontSize: FontSize.large,
    color: PurpleScale.lighter,
    marginBottom: Spacing.times2,
  },
  cardContainerViewStyle: {
    flex: 1,
    paddingLeft: Spacing.times1pt25,
    paddingRight: Spacing.times1pt25,
    paddingTop: Spacing.times2,
    borderRadius: BorderRadius.times1pt5,
    minHeight: 300,
    ...backgroundGradient,
  },
  searchButtonContainerViewStyle: {
    marginBottom: -Spacing.base,
  },
};

export const getDrugSearchCardStyles = (
  isDesktop: boolean
): IDrugSearchCardStyles => {
  return isDesktop ? drugSearchCardDesktopStyles : drugSearchCardStyles;
};
