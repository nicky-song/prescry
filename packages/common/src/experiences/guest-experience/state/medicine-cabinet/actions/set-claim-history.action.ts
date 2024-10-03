// Copyright 2022 Prescryptive Health, Inc.

import { IClaimHistory } from '../../../../../models/claim';
import { IMedicineCabinetAction } from '../medicine-cabinet.action';

export type ISetMedicineCabinetPrescriptionsAction =
  IMedicineCabinetAction<'SET_CLAIM_HISTORY'>;

export const setClaimHistoryAction = (
  claimHistory: IClaimHistory
): ISetMedicineCabinetPrescriptionsAction => ({
  type: 'SET_CLAIM_HISTORY',
  payload: {
    claimHistory,
  },
});
