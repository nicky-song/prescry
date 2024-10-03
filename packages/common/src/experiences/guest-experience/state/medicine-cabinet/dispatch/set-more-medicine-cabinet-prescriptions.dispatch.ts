// Copyright 2021 Prescryptive Health, Inc.

import { IPrescriptionInfo } from '../../../../../models/prescription-info';
import { setMoreMedicineCabinetPrescriptionsAction } from '../actions/set-more-medicine-cabinet-prescriptions.action';
import { MedicineCabinetDispatch } from './medicine-cabinet.dispatch';

export const setMoreMedicineCabinetPrescriptionsDispatch = (
  dispatch: MedicineCabinetDispatch,
  prescriptions: IPrescriptionInfo[]
): void => {
  dispatch(setMoreMedicineCabinetPrescriptionsAction(prescriptions));
};
