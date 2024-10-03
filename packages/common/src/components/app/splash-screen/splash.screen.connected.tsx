// Copyright 2018 Prescryptive Health, Inc.

import { connect } from 'react-redux';
import { SplashScreen } from './splash.screen';
import { startExperienceAsyncAction } from '../../../experiences/guest-experience/store/start-experience/async-actions/start-experience.async-action';

export const action = {
  onMounted: startExperienceAsyncAction,
};

export const SplashScreenConnected = connect(undefined, action)(SplashScreen);
