// Copyright 2021 Prescryptive Health, Inc.

import { changeSlotErrorAction } from './change-slot-error.action';

describe('changeSlotErrorAction', () => {
  it('returns action', () => {
    const action = changeSlotErrorAction('test-error');
    expect(action.type).toEqual('APPOINTMENT_CHANGE_SLOT_ERROR');
    expect(action.payload).toEqual('test-error');
  });
});
