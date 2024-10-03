// Copyright 2022 Prescryptive Health, Inc.

import { IAccountAndFamilyState } from '../account-and-family.state';

type ActionKeys = 'SET_PRESCRIPTION_PERSON_SELECTION';

export interface IAccountAndFamilyAction<T extends ActionKeys> {
  readonly type: T;
  readonly payload: Partial<IAccountAndFamilyState>;
}

export type AccountAndFamilyAction = IAccountAndFamilyAction<ActionKeys>;
