// Copyright 2021 Prescryptive Health, Inc.

import { ViewStyle } from 'react-native';

export interface ISplashScreenStyle {
  backgroundImageViewStyle: ViewStyle;
  spinnerViewStyle: ViewStyle;
}

export const splashScreenStyle: ISplashScreenStyle = {
  backgroundImageViewStyle: {
    height: '100vh',
  },
  spinnerViewStyle: {
    alignSelf: 'center',
    bottom: 100,
    position: 'absolute',
  },
};
