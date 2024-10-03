// Copyright 2022 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { PrimaryColor } from '../../../theming/colors';
import { Spacing } from '../../../theming/spacing';

export interface ICallToActionCardStyles {
  tagListViewStyle: ViewStyle;
  headingTextStyle: TextStyle;
  buttonViewStyle: ViewStyle;
  linkColorTextStyle: Pick<TextStyle, 'color'>;
  linkViewStyle: ViewStyle;
  separatorViewStyle: ViewStyle;
}

export const callToActionCardStyles: ICallToActionCardStyles = {
  tagListViewStyle: {
    marginBottom: Spacing.base,
  },
  headingTextStyle: {
    marginBottom: Spacing.threeQuarters,
  },
  buttonViewStyle: {
    marginTop: Spacing.base,
  },
  linkColorTextStyle: {
    color: PrimaryColor.darkBlue,
  },
  linkViewStyle: {
    width: 'fit-content',
    marginTop: Spacing.half,
  },
  separatorViewStyle: {
    marginTop: Spacing.times1pt25,
  },
};
