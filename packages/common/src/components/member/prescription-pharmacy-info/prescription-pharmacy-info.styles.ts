// Copyright 2021 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { PrimaryColor } from '../../../theming/colors';
import {
  FontSize,
  FontWeight,
  getFontDimensions,
  getFontFace,
} from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';

export interface IPrescriptionPharmacyInfoStyles {
  iconTextStyle: TextStyle;
  phoneIconTextStyle: TextStyle;
  rowViewStyle: ViewStyle;
  titleTextStyle: TextStyle;
  titleContentWithFavoriteViewStyle: ViewStyle;
  favoriteIconButtonViewStyle: ViewStyle;
  commonTextStyle: TextStyle;
}

const commonIconTextStyle: TextStyle = {
  lineHeight: 30,
  marginRight: Spacing.threeQuarters,
  flexGrow: 0,
  color: PrimaryColor.darkBlue,
};

export const prescriptionPharmacyInfoStyles: IPrescriptionPharmacyInfoStyles = {
  rowViewStyle: {
    flexDirection: 'row',
    marginBottom: Spacing.half,
    alignItems: 'center',
  },
  iconTextStyle: {
    ...commonIconTextStyle,
  },
  phoneIconTextStyle: {
    ...commonIconTextStyle,
  },
  titleTextStyle: {
    ...getFontDimensions(FontSize.h3),
    marginBottom: Spacing.base,
  },
  titleContentWithFavoriteViewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  favoriteIconButtonViewStyle: {
    marginLeft: Spacing.base,
    marginBottom: Spacing.half,
  },
  commonTextStyle: {
    ...getFontFace({ weight: FontWeight.semiBold }),
    color: PrimaryColor.darkBlue,
  },
};
