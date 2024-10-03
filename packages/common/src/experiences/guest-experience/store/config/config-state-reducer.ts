// Copyright 2018 Prescryptive Health, Inc.

import {
  GuestExperienceConfig,
  IGuestExperienceConfig,
} from '../../guest-experience-config';

export enum ConfigStateActionKeys {}

export const configStateReducer = (
  state: IGuestExperienceConfig = GuestExperienceConfig
) => {
  return state;
};
