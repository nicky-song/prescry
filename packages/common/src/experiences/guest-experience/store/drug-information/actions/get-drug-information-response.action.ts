// Copyright 2020 Prescryptive Health, Inc.

import { IDrugInformationAction } from './drug-information-action';
import { IDrugInformationItem } from '../../../../../models/api-response/drug-information-response';

export type IGetDrugInformationResponseAction = IDrugInformationAction<
  'DRUG_INFORMATION_RESPONSE',
  IDrugInformationItem
>;

export const getDrugInformationResponseAction = (
  response: IDrugInformationItem
): IGetDrugInformationResponseAction => ({
  payload: response,
  type: 'DRUG_INFORMATION_RESPONSE',
});
