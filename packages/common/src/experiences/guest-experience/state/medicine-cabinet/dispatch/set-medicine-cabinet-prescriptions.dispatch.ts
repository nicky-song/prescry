// Copyright 2021 Prescryptive Health, Inc.

import { IPrescriptionInfo } from '../../../../../models/prescription-info';
import { setMedicineCabinetPrescriptionsAction } from '../actions/set-medicine-cabinet-prescriptions.action';
import { MedicineCabinetDispatch } from './medicine-cabinet.dispatch';

export const setMedicineCabinetPrescriptionsDispatch = (
  dispatch: MedicineCabinetDispatch,
  prescriptions: IPrescriptionInfo[]
): void => {
  dispatch(setMedicineCabinetPrescriptionsAction(prescriptions));
};
