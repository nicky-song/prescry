// Copyright 2020 Prescryptive Health, Inc.

import { createBookingErrorAction } from './create-booking-error.action';

describe('createBookingErrorAction', () => {
  it('returns action', () => {
    const action = createBookingErrorAction('error', []);
    expect(action.type).toEqual('CREATE_BOOKING_ERROR');
    expect(action.payload).toEqual({ error: 'error', updatedSlots: [] });
  });
});
