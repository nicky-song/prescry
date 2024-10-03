// Copyright 2021 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { Spacing } from '../../../theming/spacing';
import { FontSize } from '../../../theming/theme';

const offerDetailsInstructionContainer: ViewStyle = {
  height: 'auto',
};
const offerDetailsInstructionView: ViewStyle = {
  flexDirection: 'column',
  height: 'auto',
  paddingLeft: Spacing.times1pt25,
  paddingRight: Spacing.times1pt25,
};
const explanationContainer: ViewStyle = {
  alignItems: 'flex-start',
  height: 'auto',
  marginTop: Spacing.times1pt25,
};
const explanationText: TextStyle = {
  flex: 0,
  textAlign: 'left',
};
const callToActionContainer: ViewStyle = {
  alignItems: 'flex-start',
  height: 'auto',
  justifyContent: 'flex-start',
};
const callToActionText: TextStyle = {
  fontSize: FontSize.large,
  flex: 0,
  marginBottom: Spacing.base,
  marginTop: Spacing.quarter,
  textAlign: 'left',
};
const lineSeparatorViewStyle: ViewStyle = {
  marginTop: Spacing.quarter,
};

export const recommendationInstructionStyles = {
  callToActionContainer,
  callToActionText,
  explanationContainer,
  explanationText,
  lineSeparatorViewStyle,
  offerDetailsInstructionContainer,
  offerDetailsInstructionView,
};
