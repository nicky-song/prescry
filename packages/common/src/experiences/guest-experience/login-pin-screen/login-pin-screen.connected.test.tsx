// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/root-reducer';
import {
  clearAccountToken,
  verifyPinLoadingAction,
} from '../store/secure-pin/secure-pin-reducer.actions';
import {
  ILoginPinScreenActionProps,
  ILoginPinScreenProps,
} from './login-pin-screen';
import {
  LoginPinScreenConnected,
  mapStateToProps,
} from './login-pin-screen.connected';

jest.mock('./login-pin-screen', () => ({
  LoginPinScreen: () => <div />,
}));

jest.mock('react-redux', () => {
  return {
    connect: jest.fn().mockReturnValue(() => jest.fn()),
  };
});

const connectMock = connect as unknown as jest.Mock;

describe('ConnectedLoginPinScreen mapStateToProps', () => {
  it('should return leftAttempts and hasPinMismatched', () => {
    const initialState: RootState = {
      securePin: {
        hasPinMismatched: true,
        numberOfFailedAttemptsToVerify: 5,
      },
      features: {},
      identityVerification: {
        recoveryEmailExists: false,
      },
    } as RootState;

    const result = mapStateToProps(initialState);

    const expectedResult: ILoginPinScreenProps = {
      hasPinMismatched: true,
      leftAttempts: 0,
      recoveryEmailExists: false,
    };
    expect(result).toEqual(expectedResult);
  });

  it('should call connect with mapStateToProps', () => {
    expect(connectMock.mock.calls[0][0]).toBe(mapStateToProps);
  });
});

describe('ConnectedLoginPinScreen actions', () => {
  it('should define ConnectedLoginPinScreen', () => {
    expect(LoginPinScreenConnected).toBeDefined();
  });

  it('should have been called the connectMock', () => {
    expect(connectMock).toHaveBeenCalledTimes(1);
  });

  it('should assign proper actions', () => {
    const expectedActions: ILoginPinScreenActionProps = {
      verifyPin: verifyPinLoadingAction,
      clearAccountToken,
    };

    expect(connectMock).toHaveBeenCalledTimes(1);
    expect(connectMock).toHaveBeenNthCalledWith(
      1,
      expect.any(Function),
      expectedActions
    );
  });
});
