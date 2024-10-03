// Copyright 2021 Prescryptive Health, Inc.

import { IDrugInformationItem } from '../../../../../models/api-response/drug-information-response';
import { IPrescriptionInfo } from '../../../../../models/prescription-info';
import { IShoppingAction } from './shopping.action';

export type IPrescriptionInfoSetAction = IShoppingAction<
  'PRESCRIPTION_INFO_SET'
>;

export const prescriptionInfoSetAction = (
  presriptionInfo: IPrescriptionInfo,
  drugInfo?: IDrugInformationItem
): IPrescriptionInfoSetAction => ({
  type: 'PRESCRIPTION_INFO_SET',
  payload: {
    prescriptionInfo: presriptionInfo,
    drugInformation: drugInfo,
  },
});
