// Copyright 2018 Prescryptive Health, Inc.

import {
  GuestExperienceConfig,
  IGuestExperienceConfig,
} from '../../guest-experience-config';
import { configStateReducer } from './config-state-reducer';

describe('config state reducer', () => {
  it('should return initial state', () => {
    const state: IGuestExperienceConfig = GuestExperienceConfig;
    expect(configStateReducer(state)).toEqual(state);
  });
});
