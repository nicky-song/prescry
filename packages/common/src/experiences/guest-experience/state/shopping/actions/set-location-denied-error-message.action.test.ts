// Copyright 2021 Prescryptive Health, Inc.

import { setLocationDeniedErrorMessageAction } from './set-location-denied-error-message.action';

describe('setLocationDeniedErrorMessageAction', () => {
  it('returns action', () => {
    const action = setLocationDeniedErrorMessageAction('error');
    expect(action.type).toEqual('SET_LOCATION_DENIED_ERROR_MESSAGE');
    expect(action.payload).toEqual({
      errorMessage: 'error',
    });
  });
});
