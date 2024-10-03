// Copyright 2018 Prescryptive Health, Inc.

import React from 'react';
import { connect } from 'react-redux';
import {
  navigateToPhoneNumberVerificationLoadingAction,
  onSetPhoneNumberAction,
} from '../../../store/phone-number-login/phone-number-login.reducer.action';
import { RootState } from '../../../store/root-reducer';
import { PhoneNumberLoginScreen } from './phone-number-login.screen';
import {
  PhoneNumberLoginScreenConnected,
  mapStateToProps,
} from './phone-number-login.screen.connected';

jest.mock('../../../store/navigation/navigation-reducer.helper', () => ({
  resetURLAfterNavigation: jest.fn(),
}));

jest.mock('../../../../../components/image-asset/image-asset');
jest.mock('react-redux', () => ({
  connect: jest
    .fn()
    .mockReturnValue(
      jest.fn().mockReturnValue('ConnectedPhoneNumberRegistrationScreen')
    ),
}));
jest.mock('./phone-number-login.screen', () => ({
  PhoneNumberLoginScreen: () => <div />,
}));

const connectMock = connect as unknown as jest.Mock;

const state = {
  phoneLogin: {
    phoneNumber: '1234567890',
    phoneNumberTypeIsUnsupported: false,
  },
} as RootState;

describe('PhoneNumberLoginScreenConnected', () => {
  it('should be defined as PhoneNumberLoginScreenConnected', () => {
    expect(PhoneNumberLoginScreenConnected).toBeDefined();
  });

  it('should call connect once', () => {
    expect(connectMock).toHaveBeenCalledTimes(1);
  });

  it('should call connect with PhoneNumberLoginScreen first', () => {
    const connectResultMock = connectMock.mock.results[0].value;
    expect(connectResultMock).toHaveBeenNthCalledWith(
      1,
      PhoneNumberLoginScreen
    );
  });

  it('should return the expected state', () => {
    const mapStateToPropsResult = mapStateToProps(state);
    expect(mapStateToPropsResult).toMatchObject({
      phoneNumberTypeIsUnsupported: false,
    });
  });
});

describe('PhoneNumberLoginScreen actions', () => {
  it('should call connectMock once', () => {
    expect(connectMock).toHaveBeenCalledTimes(1);
  });

  it('should assign expected actions', () => {
    expect(connectMock.mock.calls[0][1].onSetPhoneNumberAction).toBe(
      onSetPhoneNumberAction
    );
    expect(
      connectMock.mock.calls[0][1].navigateToOneTimePasswordVerification
    ).toBe(navigateToPhoneNumberVerificationLoadingAction);
  });
});
