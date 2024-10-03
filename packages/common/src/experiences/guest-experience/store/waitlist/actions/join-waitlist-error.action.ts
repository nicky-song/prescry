// Copyright 2021 Prescryptive Health, Inc.

import { IJoinWailistAction } from './join-waitlist.action';

export interface IJoinWaitlistErrorActionPayload {
  error: string;
}
export type IJoinWaitlistErrorAction = IJoinWailistAction<
  'JOIN_WAITLIST_ERROR',
  IJoinWaitlistErrorActionPayload
>;

export const joinWaitlistErrorAction = (
  error: string
): IJoinWaitlistErrorAction => ({
  payload: { error },
  type: 'JOIN_WAITLIST_ERROR',
});
