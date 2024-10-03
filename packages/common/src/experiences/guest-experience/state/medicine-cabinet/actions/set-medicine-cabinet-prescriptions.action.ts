// Copyright 2021 Prescryptive Health, Inc.

import { IPrescriptionInfo } from '../../../../../models/prescription-info';
import { IMedicineCabinetAction } from '../medicine-cabinet.action';

export type ISetMedicineCabinetPrescriptionsAction = IMedicineCabinetAction<
  'SET_MEDICINE_CABINET_PRESCRIPTIONS'
>;

export const setMedicineCabinetPrescriptionsAction = (
  prescriptions: IPrescriptionInfo[]
): ISetMedicineCabinetPrescriptionsAction => ({
  type: 'SET_MEDICINE_CABINET_PRESCRIPTIONS',
  payload: {
    prescriptions,
  },
});
