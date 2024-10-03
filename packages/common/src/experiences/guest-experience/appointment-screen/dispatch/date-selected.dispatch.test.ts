// Copyright 2021 Prescryptive Health, Inc.

import { dateSelectedAction } from '../actions/date-selected.action';
import { dateSelectedDispatch } from './date-selected.dispatch';

describe('dateSelectedDispatch', () => {
  it('dispatches expected action', () => {
    const dispatchMock = jest.fn();

    dateSelectedDispatch(dispatchMock);

    const expectedAction = dateSelectedAction();
    expect(dispatchMock).toHaveBeenCalledWith(expectedAction);
  });
});
