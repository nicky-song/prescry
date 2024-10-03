// Copyright 2022 Prescryptive Health, Inc.

import { IClaimHistory } from '../../../../../models/claim';
import { setClaimHistoryAction } from '../actions/set-claim-history.action';
import { MedicineCabinetDispatch } from './medicine-cabinet.dispatch';

export const setClaimHistoryDispatch = (
  dispatch: MedicineCabinetDispatch,
  claimHistory: IClaimHistory
): void => {
  dispatch(setClaimHistoryAction(claimHistory));
};
