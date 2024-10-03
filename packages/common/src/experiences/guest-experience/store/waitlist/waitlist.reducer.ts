// Copyright 2021 Prescryptive Health, Inc.

import { Reducer } from 'redux';
import { IJoinWaitlistErrorAction } from './actions/join-waitlist-error.action';
import { IJoinWaitlistResetErrorAction } from './actions/join-waitlist-reset-error.action';
import { IJoinWaitlistLocationPreferencesAction } from './actions/join-waitlist-location-preferences.action';

export interface IWaitlistState {
  readonly joinWaitlistError?: string;
  readonly providerLocationPreferences?: {
    readonly zipCode?: string;
    readonly distance?: number;
  };
}

export const defaultWaitlistState: IWaitlistState = {};

export type IWaitlistActionTypes =
  | IJoinWaitlistErrorAction
  | IJoinWaitlistResetErrorAction
  | IJoinWaitlistLocationPreferencesAction;

export const waitlistReducer: Reducer<IWaitlistState, IWaitlistActionTypes> = (
  state: IWaitlistState = defaultWaitlistState,
  action: IWaitlistActionTypes
): IWaitlistState => {
  switch (action.type) {
    case 'JOIN_WAITLIST_LOCATION_PREFERENCES':
      if (!action.payload?.zipCode) {
        return {
          ...state,
          providerLocationPreferences: {
            zipCode: state.providerLocationPreferences?.zipCode,
            distance: action.payload?.distance,
          },
        };
      } else if (!action.payload?.distance) {
        return {
          ...state,
          providerLocationPreferences: {
            zipCode: action.payload?.zipCode,
            distance: state.providerLocationPreferences?.distance,
          },
        };
      } else
        return {
          ...state,
          providerLocationPreferences: {
            zipCode: action.payload?.zipCode,
            distance: action.payload?.distance,
          },
        };
    case 'JOIN_WAITLIST_ERROR': {
      const joinWaitlistError = action.payload?.error;
      return {
        ...state,
        joinWaitlistError,
      };
    }
    case 'JOIN_WAITLIST_RESET_ERROR':
      return {
        ...state,
        joinWaitlistError: undefined,
      };

    default:
      return state;
  }
};
