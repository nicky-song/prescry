// Copyright 2018 Prescryptive Health, Inc.

import React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/root-reducer';
import {
  navigateToBackAction,
  setPinAction,
} from '../store/secure-pin/secure-pin-reducer.actions';
import {
  mapActionsToProps,
  mapStateToProps,
} from './create-pin-screen.connected';

jest.mock('react-redux', () => {
  return {
    connect: jest.fn().mockReturnValue(() => jest.fn()),
  };
});

jest.mock('./create-pin-screen', () => ({
  CreatePinScreen: () => <div />,
}));

const connectMock = connect as unknown as jest.Mock;
const mockState = {
  securePin: {
    errorCode: 2009,
  },
} as unknown as RootState;

describe('CreatePinScreenConnected mapStateToProps', () => {
  it('should return verification pin', () => {
    const result = mapStateToProps(mockState);
    expect(result).toEqual({
      errorCode: 2009,
    });
  });
});

describe('CreatePinScreenConnected actions', () => {
  it('should have been called the connectMock', () => {
    expect(connectMock).toHaveBeenCalledTimes(1);
    expect(connectMock).toHaveBeenLastCalledWith(
      mapStateToProps,
      mapActionsToProps
    );
  });

  it('should map the correct actions', () => {
    expect(connectMock.mock.calls[0][1].setPinAction).toBe(setPinAction);
    expect(connectMock.mock.calls[0][1].navigateToBack).toBe(
      navigateToBackAction
    );
  });
});
