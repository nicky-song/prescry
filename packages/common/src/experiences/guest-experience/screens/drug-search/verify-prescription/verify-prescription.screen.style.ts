// Copyright 2021 Prescryptive Health, Inc.

import { ViewStyle, TextStyle } from 'react-native';
import { FontWeight, getFontFace } from '../../../../../theming/fonts';
import { Spacing } from '../../../../../theming/spacing';

export interface IVerifyPrescriptionScreenStyle {
  verifyPrescriptionContentTextStyle: TextStyle;
  locationInfoViewStyle: ViewStyle;
  prescriptionNumberInputViewStyle: ViewStyle;
  submitButtonViewStyle: ViewStyle;
  addressComponentViewStyle: ViewStyle;
  toFromTextStyle: TextStyle;
  pharmacyLineSeparatorViewStyle: ViewStyle;
  verifyPrescriptionArrivalNoticeTextStyle: TextStyle;
  needMoreInformationNoticeTextStyle: TextStyle;
}

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

export const verifyPrescriptionScreenStyle: IVerifyPrescriptionScreenStyle = {
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
