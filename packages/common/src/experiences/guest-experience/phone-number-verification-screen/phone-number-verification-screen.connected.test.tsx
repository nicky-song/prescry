// Copyright 2018 Prescryptive Health, Inc.

import React from 'react';
import { connect } from 'react-redux';
import {
  sendOneTimePasswordLoadingAction,
  verifyCodeLoadingAction,
} from '../store/phone-number-verification/phone-number-verification-reducer.actions';
import { RootState } from '../store/root-reducer';
import {
  IPhoneNumberVerificationScreenDataProps,
  PhoneNumberVerificationScreen,
} from './phone-number-verification-screen';
import {
  PhoneNumberVerificationScreenConnected,
  mapStateToProps,
} from './phone-number-verification-screen.connected';
import { phoneNumberVerificationResetAsyncAction } from '../store/phone-number-verification/async-actions/phone-number-verification-reset.async-action';

jest.mock('./phone-number-verification-screen', () => ({
  PhoneNumberVerificationScreen: () => <div />,
}));
jest.mock('react-redux', () => ({
  connect: jest
    .fn()
    .mockReturnValue(
      jest.fn().mockReturnValue('ConnectedPhoneNumberVerificationScreen')
    ),
}));

const connectMock = connect as unknown as jest.Mock;
const state = {
  phoneVerification: {
    isIncorrectCode: true,
    isOneTimePasswordSent: true,
  },
} as RootState;

describe('PhoneNumberVerificationScreenConnected', () => {
  it('should be defined ConnectedPhoneNumberVerificationScreen', () => {
    expect(PhoneNumberVerificationScreenConnected).toBeDefined();
  });

  it('connect should get called once', () => {
    expect(connectMock).toHaveBeenCalledTimes(1);
  });

  it('connect should get called nth times', () => {
    const connectResultMock = connectMock.mock.results[0].value;
    expect(connectResultMock).toHaveBeenNthCalledWith(
      1,
      PhoneNumberVerificationScreen
    );
  });

  it('should return the state with resend one time password sent status', () => {
    const mapStateToPropsResult = mapStateToProps(state);
    const expectedResult: IPhoneNumberVerificationScreenDataProps = {
      isIncorrectCode: true,
      isOneTimePasswordSent: true,
    };

    expect(mapStateToPropsResult).toEqual(expectedResult);
  });
});

describe('PhoneNumberVerificationScreen actions', () => {
  it('should have been called the connectMock', () => {
    expect(connectMock).toHaveBeenCalledTimes(1);
  });

  it('should assign proper actions', () => {
    expect(connectMock.mock.calls[0][1].resendCode).toBe(
      sendOneTimePasswordLoadingAction
    );
    expect(connectMock.mock.calls[0][1].verifyCode).toBe(
      verifyCodeLoadingAction
    );
    expect(connectMock.mock.calls[0][1].resetVerification).toBe(
      phoneNumberVerificationResetAsyncAction
    );
  });
});
