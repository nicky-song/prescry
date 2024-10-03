// Copyright 2021 Prescryptive Health, Inc.

import { setIsUnauthExperienceAction } from '../actions/set-is-unauth-experience.action';
import { setIsUnauthExperienceDispatch } from './set-is-unauth-experience.dispatch';

describe('setIsUnauthExperienceDispatch', () => {
  it('dispatches expected action', () => {
    const dispatchMock = jest.fn();

    const isUnauthExperienceMock = true;
    setIsUnauthExperienceDispatch(dispatchMock, isUnauthExperienceMock);

    const expectedAction = setIsUnauthExperienceAction(isUnauthExperienceMock);
    expect(dispatchMock).toHaveBeenCalledWith(expectedAction);
  });
});
