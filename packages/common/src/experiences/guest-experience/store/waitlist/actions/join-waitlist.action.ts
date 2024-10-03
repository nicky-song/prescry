// Copyright 2021 Prescryptive Health, Inc.

export enum JoinWailistActionKeysEnum {
  JOIN_WAITLIST_ERROR = 'JOIN_WAITLIST_ERROR',
  JOIN_WAITLIST_RESET_ERROR = 'JOIN_WAITLIST_RESET_ERROR',
  JOIN_WAITLIST_LOCATION_PREFERENCES = 'JOIN_WAITLIST_LOCATION_PREFERENCES',
}

export type JoinWailistActionKeys = keyof typeof JoinWailistActionKeysEnum;

export interface IJoinWailistAction<T extends JoinWailistActionKeys, P> {
  readonly type: T;
  readonly payload: P;
}
