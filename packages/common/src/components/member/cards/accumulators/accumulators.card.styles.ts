// Copyright 2022 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { PrimaryColor } from '../../../../theming/colors';
import { FontWeight, getFontFace } from '../../../../theming/fonts';
import { IconSize } from '../../../../theming/icons';
import { Spacing } from '../../../../theming/spacing';

export interface IAccumulatorsCardStyles {
  categoryContainerViewStyle: ViewStyle;
  categoryIconTextStyle: TextStyle;
  categoryLabelTextStyle: TextStyle;
  separatorViewStyle: ViewStyle;
  progressBarViewStyle: ViewStyle;
}

export const accumulatorsCardStyles: IAccumulatorsCardStyles = {
  categoryContainerViewStyle: {
    flexDirection: 'row',
    alignContent: 'center',
  },
  categoryIconTextStyle: {
    marginRight: Spacing.half,
    fontSize: IconSize.regular,
    color: PrimaryColor.plum,
  },
  categoryLabelTextStyle: {
    color: PrimaryColor.plum,
    ...getFontFace({ weight: FontWeight.semiBold }),
  },
  separatorViewStyle: {
    marginTop: Spacing.times1pt5,
  },
  progressBarViewStyle: {
    marginTop: Spacing.times1pt5,
  },
};
