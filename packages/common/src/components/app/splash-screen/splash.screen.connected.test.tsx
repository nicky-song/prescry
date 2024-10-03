// Copyright 2018 Prescryptive Health, Inc.

import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import { Store } from 'redux';
import { SplashScreen } from './splash.screen';
import { SplashScreenConnected } from './splash.screen.connected';

jest.mock('./splash.screen', () => ({
  SplashScreen: () => <div />,
}));

describe('SplashScreenConnected', () => {
  it('onMounted props passed to SplashScreen is a fucntion', () => {
    const store = {
      dispatch: jest.fn(),
      getState: jest.fn(),
      subscribe: jest.fn(),
    } as unknown as Store;
    const connectedLoadingScreen = renderer.create(
      <Provider store={store}>
        <SplashScreenConnected />
      </Provider>
    );
    expect(
      typeof connectedLoadingScreen.root.findByType(SplashScreen).props
        .onMounted
    ).toBe('function');
  });
});
