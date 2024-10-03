// Copyright 2018 Prescryptive Health, Inc.

import { connect } from 'react-redux';
import {
  navigateToPhoneNumberVerificationLoadingAction,
  onSetPhoneNumberAction,
} from '../../../store/phone-number-login/phone-number-login.reducer.action';
import { RootState } from '../../../store/root-reducer';
import {
  IPhoneNumberLoginScreenActionProps,
  IPhoneNumberLoginScreenProps,
  PhoneNumberLoginScreen,
} from './phone-number-login.screen';

export const mapStateToProps = (
  state: RootState
): IPhoneNumberLoginScreenProps => {
  return {
    phoneNumberTypeIsUnsupported: state.phoneLogin.phoneNumberTypeIsUnsupported,
  };
};

const actions: IPhoneNumberLoginScreenActionProps = {
  navigateToOneTimePasswordVerification:
    navigateToPhoneNumberVerificationLoadingAction,
  onSetPhoneNumberAction,
};

export const PhoneNumberLoginScreenConnected = connect(
  mapStateToProps,
  actions
)(PhoneNumberLoginScreen);
