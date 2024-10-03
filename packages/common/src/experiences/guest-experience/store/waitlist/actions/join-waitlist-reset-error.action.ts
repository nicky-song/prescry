// Copyright 2021 Prescryptive Health, Inc.

import { IJoinWailistAction } from './join-waitlist.action';

export type IJoinWaitlistResetErrorAction = IJoinWailistAction<
  'JOIN_WAITLIST_RESET_ERROR',
  undefined
>;

export const joinWaitlistResetErrorAction =
  (): IJoinWaitlistResetErrorAction => ({
    payload: undefined,
    type: 'JOIN_WAITLIST_RESET_ERROR',
  });
