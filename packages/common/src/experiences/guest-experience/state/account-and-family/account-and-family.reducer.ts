// Copyright 2022 Prescryptive Health, Inc.

import { Reducer } from 'react';
import { AccountAndFamilyAction } from './actions/account-and-family.action';
import { IAccountAndFamilyState } from './account-and-family.state';

export type AccountAndFamilyReducer = Reducer<
  IAccountAndFamilyState,
  AccountAndFamilyAction
>;

export const accountAndFamilyReducer: AccountAndFamilyReducer = (
  state: IAccountAndFamilyState,
  action: AccountAndFamilyAction
): IAccountAndFamilyState => {
  return { ...state, ...action.payload };
};
