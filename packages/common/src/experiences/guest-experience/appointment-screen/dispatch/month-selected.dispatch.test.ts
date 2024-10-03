// Copyright 2021 Prescryptive Health, Inc.

import { monthSelectedAction } from '../actions/month-selected.action';
import { monthSelectedDispatch } from './month-selected.dispatch';

describe('monthSelectedDispatch', () => {
  it('dispatches expected action', () => {
    const dispatchMock = jest.fn();

    monthSelectedDispatch(dispatchMock);

    const expectedAction = monthSelectedAction();
    expect(dispatchMock).toHaveBeenCalledWith(expectedAction);
  });
});
