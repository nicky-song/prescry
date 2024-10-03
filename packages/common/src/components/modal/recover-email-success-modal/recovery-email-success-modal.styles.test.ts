// Copyright 2021 Prescryptive Health, Inc.

import { ViewStyle } from 'react-native';
import { Spacing } from '../../../theming/spacing';
import {
  IRecoveryEmailSuccessModalStyles,
  recoveryEmailSuccessModalStyles,
} from './recovery-email-success-modal.styles';

describe('recoveryEmailSuccessModalStyles', () => {
  it('has expected default styles', () => {
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

    const expectedStyles: IRecoveryEmailSuccessModalStyles = {
      contentContainerViewStyle,
      titleContainerViewStyle,
    };

    expect(recoveryEmailSuccessModalStyles).toEqual(expectedStyles);
  });
});
