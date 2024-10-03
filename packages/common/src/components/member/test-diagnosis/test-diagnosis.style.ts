// Copyright 2020 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { BorderRadius } from '../../../theming/borders';
import { FontWeight, getFontFace } from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';
import { GreyScale, FontSize } from '../../../theming/theme';

const baseTestDiagnosisContainer: ViewStyle = {
  flexDirection: 'row',
  display: 'flex',
  width: '100%',
  marginTop: Spacing.threeQuarters,
  borderRadius: BorderRadius.half,
  marginBottom: Spacing.times2,
};

const testDiagnosisContainerNoColor: ViewStyle = {
  ...baseTestDiagnosisContainer,
  borderColor: GreyScale.light,
  backgroundColor: GreyScale.lightest,
  borderWidth: 1,
};

const testDiagnosisColumnContainer: ViewStyle = {
  flex: 1,
};

const testDiagnosisTextContainer: ViewStyle = {
  flexDirection: 'row',
  flex: 1,
  justifyContent: 'space-between',
  margin: Spacing.times1pt5,
  marginBottom: 29,
};

const baseHeaderTextStyle: TextStyle = {
  ...getFontFace({ weight: FontWeight.semiBold }),
  fontSize: FontSize.small,
  textAlign: 'left',
  marginBottom: 38,
};

const baseTestDiagnosisValueTextStyle: TextStyle = {
  ...getFontFace({ weight: FontWeight.bold }),
  textAlign: 'left',
  fontSize: FontSize.ultra,
  display: 'flex',
};

const baseTestDateTextStyle: TextStyle = {
  textAlign: 'right',
  fontSize: FontSize.large,
  ...getFontFace(),
};

export const testDiagnosisStyle = {
  baseTestDiagnosisContainer,
  testDiagnosisContainerNoColor,
  testDiagnosisTextContainer,
  testDiagnosisColumnContainer,
  baseHeaderTextStyle,
  baseTestDiagnosisValueTextStyle,
  baseTestDateTextStyle,
};
