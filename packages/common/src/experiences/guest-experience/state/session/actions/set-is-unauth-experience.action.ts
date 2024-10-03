// Copyright 2021 Prescryptive Health, Inc.

import { ISessionAction } from './session.action';

export type ISetIsUnauthExperienceAction = ISessionAction<
  'SET_IS_UNAUTH_EXPERIENCE'
>;

export const setIsUnauthExperienceAction = (
  isUnauthExperience: boolean
): ISetIsUnauthExperienceAction => ({
  type: 'SET_IS_UNAUTH_EXPERIENCE',
  payload: {
    isUnauthExperience,
  },
});
