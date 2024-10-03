// Copyright 2022 Prescryptive Health, Inc.

import { Reducer } from 'react';
import { ClaimAlertAction } from './actions/claim-alert.action';
import { IClaimAlertState } from './claim-alert.state';

export type ClaimAlertReducer = Reducer<IClaimAlertState, ClaimAlertAction>;

export const claimAlertReducer: ClaimAlertReducer = (
  state: IClaimAlertState,
  action: ClaimAlertAction
): IClaimAlertState => {
  return { ...state, ...action.payload };
};
