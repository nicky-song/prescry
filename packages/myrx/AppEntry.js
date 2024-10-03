// Copyright 2022 Prescryptive Health, Inc.

/* eslint-disable filename-rules/match */
import 'expo/build/Expo.fx';
import React from 'react';
import { activateKeepAwake } from 'expo-keep-awake';
import registerRootComponent from 'expo/build/launch/registerRootComponent';
import { getMetaEnvironmentVariable } from './src/config/config.helper';
import { asyncWithLDProvider } from 'launchdarkly-react-client-sdk';
import App from './src/App';

if (__DEV__) {
  activateKeepAwake();
}

(async () => {
  const LDProvider = await asyncWithLDProvider({
    clientSideID: getMetaEnvironmentVariable('LAUNCH_DARKLY_CLIENT_ID'),
    options: { streaming: true },
  });
  const LDWrappedApp = () => (
    <LDProvider>
      <App />
    </LDProvider>
  );

  registerRootComponent(LDWrappedApp);
})();
