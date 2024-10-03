// Copyright 2018 Prescryptive Health, Inc.

import { connect } from 'react-redux';
import {
  sendOneTimePasswordLoadingAction,
  verifyCodeLoadingAction,
} from '../store/phone-number-verification/phone-number-verification-reducer.actions';
import { RootState } from '../store/root-reducer';
import {
  IPhoneNumberVerificationScreenActionProps,
  IPhoneNumberVerificationScreenDataProps,
  PhoneNumberVerificationScreen,
} from './phone-number-verification-screen';
import { phoneNumberVerificationResetAsyncAction } from '../store/phone-number-verification/async-actions/phone-number-verification-reset.async-action';
import { createAccountAsyncAction } from '../store/phone-number-verification/async-actions/create-account.async-action';

export const mapStateToProps = (
  state: RootState
): IPhoneNumberVerificationScreenDataProps => {
  return {
    isIncorrectCode: state.phoneVerification.isIncorrectCode,
    isOneTimePasswordSent: state.phoneVerification.isOneTimePasswordSent,
  };
};

const actions: IPhoneNumberVerificationScreenActionProps = {
  resendCode: sendOneTimePasswordLoadingAction,
  resetVerification: phoneNumberVerificationResetAsyncAction,
  verifyCode: verifyCodeLoadingAction,
  createAccount: createAccountAsyncAction,
};
export const PhoneNumberVerificationScreenConnected = connect(
  mapStateToProps,
  actions
)(PhoneNumberVerificationScreen);
