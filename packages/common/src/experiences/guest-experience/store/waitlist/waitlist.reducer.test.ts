// Copyright 2021 Prescryptive Health, Inc.

import { joinWaitlistErrorAction } from './actions/join-waitlist-error.action';
import { joinWaitlistLocationPreferencesAction } from './actions/join-waitlist-location-preferences.action';
import { joinWaitlistResetErrorAction } from './actions/join-waitlist-reset-error.action';
import {
  defaultWaitlistState,
  IWaitlistActionTypes,
  IWaitlistState,
  waitlistReducer,
} from './waitlist.reducer';

describe('waitlistReducer', () => {
  const defaultState: IWaitlistState = {
    joinWaitlistError: 'error',
    providerLocationPreferences: {
      zipCode: '12345',
      distance: 10,
    },
  };
  it('returns default state when state is not defined', () => {
    const action = {
      payload: undefined,
      type: '',
    } as unknown as IWaitlistActionTypes;

    expect(waitlistReducer(undefined, action)).toEqual(defaultWaitlistState);
  });

  it('updates state for JoinWaitlistLocationPreferencesAction', () => {
    const action = joinWaitlistLocationPreferencesAction('12345', 10);
    const expectedState: IWaitlistState = {
      joinWaitlistError: 'error',
      providerLocationPreferences: {
        zipCode: '12345',
        distance: 10,
      },
    };

    const updatedState = waitlistReducer(defaultState, action);
    expect(updatedState).toEqual(expectedState);
  });

  it('updates state for JoinWaitlistLocationPreferencesAction as expected when zip code not changed', () => {
    const action = joinWaitlistLocationPreferencesAction(undefined, 10);
    const expectedState: IWaitlistState = {
      joinWaitlistError: 'error',
      providerLocationPreferences: {
        zipCode: '12345',
        distance: 10,
      },
    };

    const updatedState = waitlistReducer(defaultState, action);
    expect(updatedState).toEqual(expectedState);
  });

  it('updates state for JoinWaitlistLocationPreferencesAction as expected when distance not changed', () => {
    const action = joinWaitlistLocationPreferencesAction('56789');
    const expectedState: IWaitlistState = {
      joinWaitlistError: 'error',
      providerLocationPreferences: {
        zipCode: '56789',
        distance: 10,
      },
    };

    const updatedState = waitlistReducer(defaultState, action);
    expect(updatedState).toEqual(expectedState);
  });

  it('updates state for joinWaitlistErrorAction', () => {
    const action = joinWaitlistErrorAction('new error');
    const expectedState: IWaitlistState = {
      joinWaitlistError: 'new error',
      providerLocationPreferences: {
        zipCode: '12345',
        distance: 10,
      },
    };

    const updatedState = waitlistReducer(defaultState, action);
    expect(updatedState).toEqual(expectedState);
  });

  it('updates state for joinWaitlistResetErrorAction', () => {
    const action = joinWaitlistResetErrorAction();
    const expectedState: IWaitlistState = {
      joinWaitlistError: undefined,
      providerLocationPreferences: {
        zipCode: '12345',
        distance: 10,
      },
    };

    const updatedState = waitlistReducer(defaultState, action);
    expect(updatedState).toEqual(expectedState);
  });
});
