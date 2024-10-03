// Copyright 2021 Prescryptive Health, Inc.

import { joinWaitlistLocationPreferencesAction } from './join-waitlist-location-preferences.action';

describe('joinWaitlistLocationPreferencesAction', () => {
  it('returns action', () => {
    const result = {
      zipCode: '78885',
      distance: 10,
    };

    const action = joinWaitlistLocationPreferencesAction('78885', 10);
    expect(action.type).toEqual('JOIN_WAITLIST_LOCATION_PREFERENCES');
    expect(action.payload).toEqual(result);
  });
});
