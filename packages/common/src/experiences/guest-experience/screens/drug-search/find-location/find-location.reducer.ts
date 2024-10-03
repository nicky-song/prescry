// Copyright 2022 Prescryptive Health, Inc.

import { Reducer } from 'react';
import { FindLocationAction } from './actions/find-location.action';
import { IFindLocationState } from './find-location.state';

export type FindLocationReducer = Reducer<
  IFindLocationState,
  FindLocationAction
>;

export const findLocationReducer: FindLocationReducer = (
  state: IFindLocationState,
  action: FindLocationAction
): IFindLocationState => {
  return { ...state, ...action.payload };
};
