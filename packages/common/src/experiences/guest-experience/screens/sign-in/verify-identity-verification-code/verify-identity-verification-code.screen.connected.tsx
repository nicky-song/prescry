// Copyright 2021 Prescryptive Health, Inc.

import { connect } from 'react-redux';
import { RootState } from '../../../store/root-reducer';
import {
  IVerifyIdentityVerificationCodeScreenDataProps,
  VerifyIdentityVerificationCodeScreen,
} from './verify-identity-verification-code.screen';
import {
  VerificationTypes,
  VerificationTypesEnum,
} from '../../../../../models/api-request-body/send-verification-code.request-body';

export const mapStateToProps = (
  state: RootState
): IVerifyIdentityVerificationCodeScreenDataProps => {
  const {
    selectedVerificationMethod,
    maskedPhoneNumber,
    maskedEmail,
    isVerificationCodeSent,
  } = state.identityVerification;
  return {
    verificationType:
      (selectedVerificationMethod as VerificationTypes) ??
      VerificationTypesEnum.PHONE,
    maskedValue:
      (selectedVerificationMethod === VerificationTypesEnum.EMAIL
        ? maskedEmail
        : maskedPhoneNumber) ?? '',
    isVerificationCodeSent,
  };
};

export const VerifyIdentityVerificationCodeScreenConnected = connect(
  mapStateToProps
)(VerifyIdentityVerificationCodeScreen);
