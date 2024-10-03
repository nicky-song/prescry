// Copyright 2021 Prescryptive Health, Inc.

import { IClaimHistory } from '../../../../models/claim';
import { IAccumulators } from '../../../../models/accumulators';
import { IPrescriptionInfo } from '../../../../models/prescription-info';

export interface IMedicineCabinetState {
  prescriptions: IPrescriptionInfo[];
  claimHistory: IClaimHistory;
  accumulators?: IAccumulators;
}

export const defaultMedicineCabinetState: IMedicineCabinetState = {
  prescriptions: [],
  claimHistory: { claims: [] },
};
