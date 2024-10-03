// Copyright 2018 Prescryptive Health, Inc.

import React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/root-reducer';
import { addUpdatePinLoadingAction } from '../store/secure-pin/secure-pin-reducer.actions';
import { IVerifyPinScreenProps } from './verify-pin-screen';
import {
  mapActionsToProps,
  mapStateToProps,
} from './verify-pin-screen.connected';

jest.mock('react-redux', () => {
  return {
    connect: jest.fn().mockReturnValue(() => jest.fn()),
  };
});

jest.mock('./verify-pin-screen', () => ({
  VerifyPinScreen: () => <div />,
}));

const connectMock = connect as unknown as jest.Mock;
const mockState = {
  securePin: {
    errorCode: 2009,
    verifyPinHash: '1234',
    hasPinMismatched: false,
  },
} as unknown as RootState;

describe('VerifyPinScreenConnected mapStateToProps', () => {
  it('should return verification pin', () => {
    const result = mapStateToProps(mockState);
    const expectedArgs: IVerifyPinScreenProps = {
      errorCode: 2009,
      hasErrorOccurred: false,
    };
    expect(result).toEqual(expectedArgs);
  });
});

describe('VerifyPinScreenConnected actions', () => {
  it('should have been called the connectMock', () => {
    expect(connectMock).toHaveBeenCalledTimes(1);
    expect(connectMock).toHaveBeenLastCalledWith(
      mapStateToProps,
      mapActionsToProps
    );
  });

  it('should map the correct actions', () => {
    expect(connectMock.mock.calls[0][1].addUpdatePinAction).toBe(
      addUpdatePinLoadingAction
    );
  });
});
