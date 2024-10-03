// Copyright 2021 Prescryptive Health, Inc.

import { IMembershipState } from '../membership.state';

type ActionKeys =
  | 'SET_MEMBERSHIP'
  | 'TOGGLE_FAVORITED_PHARMACIES'
  | 'SET_FAVORITING_STATUS'
  | 'SET_LANGUAGE_CODE'
  | 'SET_VALIDATE_IDENTITY'
  | 'SET_ADD_CONSENT';

export interface IMembershipAction<T extends ActionKeys, TPayload = unknown> {
  readonly type: T;
  readonly payload: Partial<IMembershipState> | TPayload;
}

export type MembershipAction = IMembershipAction<ActionKeys>;
