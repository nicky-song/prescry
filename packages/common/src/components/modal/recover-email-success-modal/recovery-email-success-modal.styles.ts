// Copyright 2021 Prescryptive Health, Inc.

import { ViewStyle } from 'react-native';
import { Spacing } from '../../../theming/spacing';

export interface IRecoveryEmailSuccessModalStyles {
  titleContainerViewStyle: ViewStyle;
  contentContainerViewStyle: ViewStyle;
}

const titleContainerViewStyle: ViewStyle = {
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  flexDirection: 'row',
  marginBottom: Spacing.base,
  alignSelf: 'flex-start',
};

const contentContainerViewStyle: ViewStyle = {
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  alignSelf: 'flex-start',
  flexDirection: 'row',
  paddingTop: Spacing.half,
  paddingBottom: Spacing.times1pt5,
};

export const recoveryEmailSuccessModalStyles: IRecoveryEmailSuccessModalStyles =
  {
    contentContainerViewStyle,
    titleContainerViewStyle,
  };
