// Copyright 2018 Prescryptive Health, Inc.

import React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/root-reducer';
import { navigateToPhoneLoginScreenAndResetSettings } from '../store/support-error/support-error.reducer.actions';
import {
  SupportErrorScreenConnected,
  mapStateToProps,
} from './support-error-screen.connected';

jest.mock('./support-error-screen', () => ({
  SupportErrorScreen: () => <div />,
}));
jest.mock('react-redux', () => {
  return {
    connect: jest.fn().mockReturnValue(() => jest.fn()),
  };
});

const connectMock = connect as unknown as jest.Mock;
const mockState = {
  settings: {
    token: 'token',
  },
  supportError: {
    errorBackNavigationType: 'LogoutAndStartOverAtLogin',
    errorMessage: 'you have tried too many times, please wait 10 minutes',
  },
} as unknown as RootState;

describe('SupportErrorScreenConnected to mapStateToProps', () => {
  it('should return all props information', () => {
    const mapStateToPropsResult = mapStateToProps(mockState);
    expect(mapStateToPropsResult.errorMessage).toBe(
      mockState.supportError.errorMessage
    );
    expect(mapStateToPropsResult.errorBackNavigationType).toBe(
      'LogoutAndStartOverAtLogin'
    );
  });
});

describe('SupportErrorScreenConnected router', () => {
  it('ConnectedSupportErrorScreen should be defined', () => {
    expect(SupportErrorScreenConnected).toBeDefined();
  });

  it('connect should get called once', () => {
    expect(connectMock).toHaveBeenCalledTimes(1);
  });

  it('connect method should be called with annonymous function as argument', () => {
    const annonymousFunction = connectMock.mock.calls[0][0];
    expect(annonymousFunction).toBeInstanceOf(Function);
    expect(connectMock.mock.calls[0][1].reloadPageAction).toBeDefined();
    expect(connectMock.mock.calls[0][1].reloadPageAction).toBeInstanceOf(
      Function
    );
    expect(connectMock.mock.calls[0][1].reloadPageAction).toBe(
      navigateToPhoneLoginScreenAndResetSettings
    );
  });
});
