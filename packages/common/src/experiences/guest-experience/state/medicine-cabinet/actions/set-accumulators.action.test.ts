// Copyright 2022 Prescryptive Health, Inc.

import { accumulatorsMock } from '../../../__mocks__/medicine-cabinet-state.mock';
import { setAccumulatorsAction } from './set-accumulators.action';

describe('setMedicineCabinetPrescriptionsAction', () => {
  it('returns action', () => {
    const action = setAccumulatorsAction(accumulatorsMock);
    expect(action.type).toEqual('SET_ACCUMULATORS');

    expect(action.payload).toEqual({
      accumulators: accumulatorsMock,
    });
  });
});
