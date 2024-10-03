// Copyright 2021 Prescryptive Health, Inc.

import { GreyScale } from '../../../theming/theme';
import { ViewStyle } from 'react-native';
import { Spacing } from '../../../theming/spacing';

export interface IRecommendationTopStyles {
  headerTopViewStyle: ViewStyle;
  prescriptionHeaderTopViewStyle: ViewStyle;
  lineSeparatorViewStyle: ViewStyle;
}

const headerTopViewStyle: ViewStyle = {
  backgroundColor: GreyScale.lightest,
};

const prescriptionHeaderTopViewStyle: ViewStyle = {
  alignSelf: 'stretch',
  backgroundColor: GreyScale.lightest,
  flexDirection: 'row',
  flexGrow: 0,
  marginHorizontal: Spacing.times1pt25,
  marginTop: Spacing.times1pt25,
};

const lineSeparatorViewStyle: ViewStyle = {
  height: Spacing.quarter,
  marginTop: Spacing.half,
  backgroundColor: GreyScale.lighter,
};

export const recommendationTopStyles: IRecommendationTopStyles = {
  headerTopViewStyle,
  prescriptionHeaderTopViewStyle,
  lineSeparatorViewStyle,
};
