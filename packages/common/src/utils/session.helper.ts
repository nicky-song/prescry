// Copyright 2021 Prescryptive Health, Inc.

import { ReduxGetState } from '../experiences/guest-experience/context-providers/redux/redux.context';

export const getLastZipCodeFromSettings = (reduxGetState: ReduxGetState) => {
  return reduxGetState().settings?.lastZipCode;
};

export const getUserLocationFromSettings = (reduxGetState: ReduxGetState) => {
  return reduxGetState().settings?.userLocation;
};
