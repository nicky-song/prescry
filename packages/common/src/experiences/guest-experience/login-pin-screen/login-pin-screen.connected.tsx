// Copyright 2021 Prescryptive Health, Inc.

import { connect } from 'react-redux';
import { MaxAllowedFailureAttemptsToVerify } from '../../../theming/constants';
import { RootState } from '../store/root-reducer';
import {
  clearAccountToken,
  verifyPinLoadingAction,
} from '../store/secure-pin/secure-pin-reducer.actions';
import {
  ILoginPinScreenActionProps,
  ILoginPinScreenProps,
  LoginPinScreen,
} from './login-pin-screen';

export const mapStateToProps = (state: RootState): ILoginPinScreenProps => {
  const recoveryEmailExists = state.identityVerification.recoveryEmailExists;

  const leftAttempts =
    MaxAllowedFailureAttemptsToVerify -
    state.securePin.numberOfFailedAttemptsToVerify;
  return {
    hasPinMismatched: state.securePin.hasPinMismatched,
    leftAttempts,
    recoveryEmailExists,
  };
};

const actions: ILoginPinScreenActionProps = {
  verifyPin: verifyPinLoadingAction,
  clearAccountToken,
};

export const LoginPinScreenConnected = connect(
  mapStateToProps,
  actions
)(LoginPinScreen);
