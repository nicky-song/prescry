// Copyright 2020 Prescryptive Health, Inc.

import { createBookingNewDependentErrorAction } from './create-booking-new-dependent-error.action';

describe('createBookingNewDependentErrorAction', () => {
  it('returns action', () => {
    const action = createBookingNewDependentErrorAction('error');
    expect(action.type).toEqual('CREATE_BOOKING_NEW_DEPENDENT_ERROR');
    expect(action.payload).toEqual({ error: 'error' });
  });
});
