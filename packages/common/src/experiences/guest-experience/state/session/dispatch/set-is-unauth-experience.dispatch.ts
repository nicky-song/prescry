// Copyright 2021 Prescryptive Health, Inc.

import { setIsUnauthExperienceAction } from '../actions/set-is-unauth-experience.action';
import { SessionDispatch } from './session.dispatch';

export const setIsUnauthExperienceDispatch = (
  dispatch: SessionDispatch,
  isUnauthExperience: boolean
): void => {
  dispatch(setIsUnauthExperienceAction(isUnauthExperience));
};
