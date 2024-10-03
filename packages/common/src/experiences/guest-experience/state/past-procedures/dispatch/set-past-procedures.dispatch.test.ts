// Copyright 2021 Prescryptive Health, Inc.

import { setPastProceduresDispatch } from './set-past-procedures.dispatch';
import { pastProceduresSetAction } from '../actions/past-procedures-set.action';
import { pastProceduresListMock } from '../../../__mocks__/past-procedures.mock';

describe('setPastProceduresDispatch', () => {
  it('dispatches expected action', () => {
    const dispatchMock = jest.fn();

    setPastProceduresDispatch(dispatchMock, pastProceduresListMock);

    const expectedAction = pastProceduresSetAction(pastProceduresListMock);
    expect(dispatchMock).toHaveBeenCalledWith(expectedAction);
  });
});
