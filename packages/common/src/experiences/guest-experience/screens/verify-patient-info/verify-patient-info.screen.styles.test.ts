// Copyright 2022 Prescryptive Health, Inc.

import { ImageStyle, TextStyle, ViewStyle } from 'react-native';
import { FontSize } from '../../../../theming/fonts';
import { Spacing } from '../../../../theming/spacing';
import {
  IVerifyPatientInfoScreenStyles,
  verifyPatientInfoScreenStyles,
} from './verify-patient-info.screen.styles';

describe('verifyPatientInfoScreenStyles', () => {
  it('has expected styles', () => {
    const lineSeparatorViewStyle: ViewStyle = {
      marginTop: Spacing.times2,
      marginBottom: Spacing.times2,
    };
    const topInputViewStyle: ViewStyle = {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    };
    const firstInputViewStyle: ViewStyle = {
      flex: 1,
      marginRight: Spacing.half,
    };
    const secondInputViewStyle: ViewStyle = {
      flex: 1,
      marginLeft: Spacing.half,
    };
    const datePickerViewStyle: ViewStyle = {
      marginTop: Spacing.times2,
    };
    const authorizationTextStyle: TextStyle = {
      fontSize: FontSize.small,
    };
    const buttonViewStyle: ViewStyle = {
      marginTop: Spacing.times3,
    };
    const checkboxImageStyle: ImageStyle = { alignSelf: 'flex-start' };

    const expectedVerifyPatientInfoScreenStyles: IVerifyPatientInfoScreenStyles =
      {
        lineSeparatorViewStyle,
        topInputViewStyle,
        firstInputViewStyle,
        secondInputViewStyle,
        datePickerViewStyle,
        authorizationTextStyle,
        buttonViewStyle,
        checkboxImageStyle,
      };

    expect(verifyPatientInfoScreenStyles).toEqual(
      expectedVerifyPatientInfoScreenStyles
    );
  });
});
