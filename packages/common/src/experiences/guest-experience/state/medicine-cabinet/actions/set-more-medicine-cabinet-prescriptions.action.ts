// Copyright 2021 Prescryptive Health, Inc.

import { IPrescriptionInfo } from '../../../../../models/prescription-info';
import { IMedicineCabinetAction } from '../medicine-cabinet.action';

export type ISetMoreMedicineCabinetPrescriptionsAction = IMedicineCabinetAction<
  'SET_MORE_MEDICINE_CABINET_PRESCRIPTIONS'
>;

export const setMoreMedicineCabinetPrescriptionsAction = (
  prescriptions: IPrescriptionInfo[]
): ISetMoreMedicineCabinetPrescriptionsAction => ({
  type: 'SET_MORE_MEDICINE_CABINET_PRESCRIPTIONS',
  payload: {
    prescriptions,
  },
});
