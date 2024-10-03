// Copyright 2021 Prescryptive Health, Inc.

import { ViewStyle, TextStyle } from 'react-native';
import { Spacing } from '../../../../../../theming/spacing';

export interface ISummarySectionStyle {
  dataTextStyle: TextStyle;
  labelTextStyle: TextStyle;
  rowViewStyle: ViewStyle;
  sectionViewStyle: ViewStyle;
  separatorViewStyle: ViewStyle;
  heading2TextStyle: TextStyle;
}

export const summarySectionStyle: ISummarySectionStyle = {
  dataTextStyle: {
    marginBottom: Spacing.threeQuarters,
    textAlign: 'right',
  },
  labelTextStyle: {
    marginBottom: Spacing.threeQuarters,
  },
  heading2TextStyle: {
    marginBottom: Spacing.base,
  },
  rowViewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionViewStyle: {
    paddingTop: 0,
    paddingBottom: Spacing.times1pt5,
  },
  separatorViewStyle: {
    marginBottom: Spacing.times2,
  },
};
