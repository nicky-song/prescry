// Copyright 2021 Prescryptive Health, Inc.

import { ISessionState } from '../session.state';
import { setIsUnauthExperienceAction } from './set-is-unauth-experience.action';

describe('setIsUnauthExperienceAction', () => {
  it('returns action', () => {
    const isUnauthExperienceMock = false;

    const action = setIsUnauthExperienceAction(isUnauthExperienceMock);

    expect(action.type).toEqual('SET_IS_UNAUTH_EXPERIENCE');

    const expectedPayload: Partial<ISessionState> = {
      isUnauthExperience: isUnauthExperienceMock,
    };
    expect(action.payload).toEqual(expectedPayload);
  });
});
