// Copyright 2021 Prescryptive Health, Inc.

import { Reducer } from 'redux';
import { PastProceduresAction } from './actions/past-procedures.action';
import {
  defaultPastProceduresState,
  IPastProceduresListState,
} from './past-procedures.state';

export type PastProceduresReducer = Reducer<
  IPastProceduresListState,
  PastProceduresAction
>;

export const pastProceduresReducer: PastProceduresReducer = (
  state: IPastProceduresListState = defaultPastProceduresState,
  action: PastProceduresAction
): IPastProceduresListState => {
  const payload = action.payload;
  return { ...state, ...payload };
};
