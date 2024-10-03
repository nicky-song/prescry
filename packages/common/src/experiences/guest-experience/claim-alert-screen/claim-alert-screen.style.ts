// Copyright 2021 Prescryptive Health, Inc.

import { ImageStyle, ViewStyle } from 'react-native';
import { Spacing } from '../../../theming/spacing';

const headerViewStyle: ViewStyle = {
  flexGrow: 0,
  alignItems: 'stretch',
  alignSelf: 'stretch',
};
const viewContainer: ViewStyle = {
  flexDirection: 'column',
};
const lineSeparatorViewStyle: ViewStyle = {
  marginTop: Spacing.quarter,
};
const couponImageStyle: ImageStyle = {
  resizeMode: 'contain',
};
const bodyViewStyle: ViewStyle = {
  paddingTop: 0,
  paddingRight: 0,
  paddingBottom: 0,
  paddingLeft: 0,
};

export const claimAlertScreenStyles = {
  couponImageStyle,
  headerViewStyle,
  lineSeparatorViewStyle,
  viewContainer,
  bodyViewStyle,
};
