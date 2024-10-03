// Copyright 2021 Prescryptive Health, Inc.

import { ShoppingDispatch } from './shopping.dispatch';
import { prescriptionInfoSetAction } from '../actions/prescription-info-set.action';
import { IPrescriptionInfo } from '../../../../../models/prescription-info';
import { IDrugInformationItem } from '../../../../../models/api-response/drug-information-response';

export const setPrescriptionInfoDispatch = (
  dispatch: ShoppingDispatch,
  prescriptionInfo: IPrescriptionInfo,
  drugInfo?: IDrugInformationItem
): void => {
  dispatch(prescriptionInfoSetAction(prescriptionInfo, drugInfo));
};
