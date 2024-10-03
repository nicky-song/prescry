// Copyright 2022 Prescryptive Health, Inc.

import { IFindLocationState } from '../find-location.state';

type ActionKeys =
  | 'SUGGESTED_LOCATIONS_SET'
  | 'SET_IS_AUTOCOMPLETING_USER_LOCATION'
  | 'SET_ACTIVE_SUGGESTED_LOCATION'
  | 'SET_LOCATION_ERROR_MESSAGE';

export interface IFindLocationAction<T extends ActionKeys> {
  readonly type: T;
  readonly payload: Partial<IFindLocationState>;
}

export type FindLocationAction = IFindLocationAction<ActionKeys>;
