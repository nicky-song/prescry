// Copyright 2022 Prescryptive Health, Inc.

import { accumulatorsMock } from '../../../__mocks__/medicine-cabinet-state.mock';
import { setAccumulatorsAction } from '../actions/set-accumulators.action';
import { setAccumulatorsDispatch } from './set-accumulators.dispatch';

describe('setAccumulatorsDispatch', () => {
  it('dispatches expected action', () => {
    const dispatchMock = jest.fn();

    setAccumulatorsDispatch(dispatchMock, accumulatorsMock);

    const expectedAction = setAccumulatorsAction(accumulatorsMock);
    expect(dispatchMock).toHaveBeenCalledWith(expectedAction);
  });
});
