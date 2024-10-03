// Copyright 2020 Prescryptive Health, Inc.

import { resetNewDependentErrorAction } from './reset-new-dependent-error.action';

describe('resetNewDependentErrorAction', () => {
  it('returns action', () => {
    const action = resetNewDependentErrorAction();
    expect(action.type).toEqual('APPOINTMENT_RESET_NEW_DEPENDENT_ERROR');
    expect(action.payload).toEqual(undefined);
  });
});
