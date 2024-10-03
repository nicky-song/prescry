// Copyright 2021 Prescryptive Health, Inc.

import { connect } from 'react-redux';
import { RootState } from '../store/root-reducer';
import {
  IVerifyIdentitySendCodeScreenDataProps,
  VerifyIdentitySendCodeScreen,
} from './verify-identity-send-code-screen';

export const mapStateToProps = (
  state: RootState,
  ownProps?: Partial<IVerifyIdentitySendCodeScreenDataProps>
): IVerifyIdentitySendCodeScreenDataProps => {
  const { maskedPhoneNumber, maskedEmail } = state.identityVerification;
  return {
    maskedEmailAddress: maskedEmail,
    maskedPhoneNumber,
    ...ownProps,
  };
};

export const VerifyIdentitySendCodeScreenConnected = connect(mapStateToProps)(
  VerifyIdentitySendCodeScreen
);
