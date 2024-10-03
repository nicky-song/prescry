// Copyright 2021 Prescryptive Health, Inc.

import { setDependentInfoAction } from '../actions/set-dependent-info.action';
import { dependentInfoMock } from '../__mocks__/dependent-info.mock';
import { setDependentInfoDispatch } from './set-dependent-info.dispatch';

describe('setDependentInfoDispatch', () => {
  it('dispatches expected action', () => {
    const dispatchMock = jest.fn();

    setDependentInfoDispatch(dispatchMock, dependentInfoMock);

    const expectedAction = setDependentInfoAction(dependentInfoMock);
    expect(dispatchMock).toHaveBeenCalledWith(expectedAction);
  });
});
