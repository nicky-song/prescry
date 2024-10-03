// Copyright 2020 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { GrayScaleColor } from '../../../../theming/colors';
import { FontWeight, getFontFace } from '../../../../theming/fonts';
import { Spacing } from '../../../../theming/spacing';
import { GreyScale, FontSize, RedScale } from '../../../../theming/theme';

const pharmacyLocationsListViewStyle: ViewStyle = {
  alignItems: 'stretch',
  flexDirection: 'column',
  marginLeft: Spacing.times1pt5,
  marginRight: Spacing.times1pt5,
};

const pharmacyResultViewStyle: ViewStyle = {
  alignItems: 'stretch',
  flexDirection: 'column',
  marginBottom: Spacing.times1pt5,
  minHeight: 160,
};

const pharmacySearchResultViewStyle: ViewStyle = {
  paddingTop: Spacing.times1pt25,
  paddingBottom: Spacing.times1pt25,
};
const searchResultHeaderViewStyle: ViewStyle = {
  paddingTop: Spacing.times1pt25,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'stretch',
};
const pharmacySearchResultTextStyle: TextStyle = {
  color: GreyScale.darkest,
  textAlign: 'left',
  fontSize: FontSize.larger,
  ...getFontFace({ weight: FontWeight.bold }),
  flexDirection: 'row',
  flexGrow: 3,
};

const pharmacySearchNotFoundTextStyle: TextStyle = {
  color: GreyScale.darkest,
  textAlign: 'left',
  fontSize: FontSize.regular,
  ...getFontFace({ weight: FontWeight.medium }),
};

const pharmacySearchInvalidTextStyle: TextStyle = {
  color: RedScale.regular,
  textAlign: 'left',
  fontSize: FontSize.regular,
  ...getFontFace({ weight: FontWeight.medium }),
};

const searchSectionStyle: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'space-evenly',
  alignItems: 'center',
  backgroundColor: GreyScale.lightest,
  paddingRight: Spacing.times1pt5,
  paddingLeft: Spacing.times1pt5,
};

const distanceTextStyle: TextStyle = {
  color: GrayScaleColor.primaryText,
  fontSize: FontSize.regular,
  paddingTop: 2,
  ...getFontFace(),
  alignItems: 'flex-end',
  textAlign: 'right',
};

const distanceViewStyle: ViewStyle = {
  display: 'flex',
  flexDirection: 'row',
};
export const pharmacyLocationsListStyle = {
  pharmacyResultViewStyle,
  pharmacyLocationsListViewStyle,
  pharmacySearchResultViewStyle,
  pharmacySearchResultTextStyle,
  pharmacySearchNotFoundTextStyle,
  pharmacySearchInvalidTextStyle,
  searchSectionStyle,
  searchResultHeaderViewStyle,
  distanceViewStyle,
  distanceTextStyle,
};
