// Copyright 2021 Prescryptive Health, Inc.

import { IJoinWailistAction } from './join-waitlist.action';

export interface IJoinWaitlistLocationPreferencesActionPayload {
  zipCode?: string;
  distance?: number;
}
export type IJoinWaitlistLocationPreferencesAction = IJoinWailistAction<
  'JOIN_WAITLIST_LOCATION_PREFERENCES',
  IJoinWaitlistLocationPreferencesActionPayload
>;

export const joinWaitlistLocationPreferencesAction = (
  zipCode?: string,
  distance?: number
): IJoinWaitlistLocationPreferencesAction => ({
  payload: { zipCode, distance },
  type: 'JOIN_WAITLIST_LOCATION_PREFERENCES',
});
