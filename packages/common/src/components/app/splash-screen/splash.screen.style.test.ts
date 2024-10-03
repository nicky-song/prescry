// Copyright 2021 Prescryptive Health, Inc.

import { ISplashScreenStyle, splashScreenStyle } from './splash.screen.style';

describe('splashScreenStyle', () => {
  it('has expected styles', () => {
    const expectedStyles: ISplashScreenStyle = {
      backgroundImageViewStyle: {
        height: '100vh',
      },
      spinnerViewStyle: {
        alignSelf: 'center',
        bottom: 100,
        position: 'absolute',
      },
    };

    expect(splashScreenStyle).toEqual(expectedStyles);
  });
});
