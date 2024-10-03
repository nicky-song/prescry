// Copyright 2021 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { Spacing } from '../../../../../../theming/spacing';

export interface IPickUpSectionStyles {
  heading2TextStyle: TextStyle;
  heading3TextStyle: TextStyle;
  sectionViewStyle: ViewStyle;
  separatorViewStyle: ViewStyle;
  headingWithFavoriteViewStyle: ViewStyle;
  favoriteIconButtonViewStyle: ViewStyle;
}

export const pickUpSectionStyles: IPickUpSectionStyles = {
  heading2TextStyle: {
    marginBottom: Spacing.base,
  },
  heading3TextStyle: {
    marginTop: Spacing.base,
    marginBottom: Spacing.base,
  },
  sectionViewStyle: {
    paddingTop: 0,
    paddingBottom: Spacing.quarter,
  },
  separatorViewStyle: {
    marginBottom: Spacing.times2,
  },
  headingWithFavoriteViewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  favoriteIconButtonViewStyle: {
    marginLeft: Spacing.base,
  },
};
