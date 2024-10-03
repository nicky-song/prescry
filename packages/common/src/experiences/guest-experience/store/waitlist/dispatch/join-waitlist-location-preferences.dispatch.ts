// Copyright 2021 Prescryptive Health, Inc.

import { Dispatch } from 'react';
import {
  IJoinWaitlistLocationPreferencesAction,
  joinWaitlistLocationPreferencesAction,
} from '../actions/join-waitlist-location-preferences.action';

export type JoinWaitlistLocationPreferencesDispatchType =
  IJoinWaitlistLocationPreferencesAction;

export const joinWaitlistLocationPreferencesDispatch = (
  dispatch: Dispatch<JoinWaitlistLocationPreferencesDispatchType>,
  zipCode?: string,
  distance?: number
) => {
  dispatch(joinWaitlistLocationPreferencesAction(zipCode, distance));
};
