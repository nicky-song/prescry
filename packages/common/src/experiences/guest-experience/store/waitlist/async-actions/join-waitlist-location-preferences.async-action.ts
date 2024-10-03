// Copyright 2021 Prescryptive Health, Inc.

import { RootState } from '../../root-reducer';
import { IJoinWaitlistLocationPreferencesAction } from '../actions/join-waitlist-location-preferences.action';
import { joinWaitlistLocationPreferencesDispatch } from '../dispatch/join-waitlist-location-preferences.dispatch';

export type IWaitlistLocationPreferencesActionType =
  IJoinWaitlistLocationPreferencesAction;

export const joinWaitlistLocationPreferencesAsyncAction = (
  zipCode?: string,
  distance?: number
) => {
  return (
    dispatch: (action: IWaitlistLocationPreferencesActionType) => RootState,
    _: () => RootState
  ) => {
    joinWaitlistLocationPreferencesDispatch(dispatch, zipCode, distance);
  };
};
