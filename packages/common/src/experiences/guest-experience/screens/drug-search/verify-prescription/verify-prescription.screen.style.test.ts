// Copyright 2021 Prescryptive Health, Inc.

import { ViewStyle, TextStyle } from 'react-native';
import { FontWeight, getFontFace } from '../../../../../theming/fonts';
import { Spacing } from '../../../../../theming/spacing';
import {
  IVerifyPrescriptionScreenStyle,
  verifyPrescriptionScreenStyle,
} from './verify-prescription.screen.style';

describe('VerifyPrescriptionScreenStyle', () => {
  it('contains correct styles', () => {
    const verifyPrescriptionContentTextStyle: TextStyle = {
      marginTop: Spacing.half,
      marginBottom: Spacing.base,
    };
    const locationInfoViewStyle: ViewStyle = {
      marginTop: Spacing.half,
      marginBottom: Spacing.base,
    };
    const prescriptionNumberInputViewStyle: ViewStyle = {
      marginTop: Spacing.base,
      marginBottom: Spacing.base,
    };
    const submitButtonViewStyle: ViewStyle = {
      marginBottom: Spacing.base,
    };

    const addressComponentViewStyle: ViewStyle = {
      marginTop: Spacing.base,
    };

    const toFromTextStyle: TextStyle = {
      ...getFontFace({ weight: FontWeight.bold }),
    };

    const pharmacyLineSeparatorViewStyle: ViewStyle = {
      marginBottom: Spacing.base,
    };

    const verifyPrescriptionArrivalNoticeTextStyle: TextStyle = {
      marginBottom: Spacing.base,
      ...getFontFace({ style: 'italic' }),
    };

    const needMoreInformationNoticeTextStyle: TextStyle = {
      marginBottom: Spacing.base,
      marginTop: Spacing.base,
    };

    const expectedStyles: IVerifyPrescriptionScreenStyle = {
      verifyPrescriptionContentTextStyle,
      locationInfoViewStyle,
      prescriptionNumberInputViewStyle,
      submitButtonViewStyle,
      addressComponentViewStyle,
      toFromTextStyle,
      pharmacyLineSeparatorViewStyle,
      verifyPrescriptionArrivalNoticeTextStyle,
      needMoreInformationNoticeTextStyle,
    };

    expect(verifyPrescriptionScreenStyle).toEqual(expectedStyles);
  });
});
