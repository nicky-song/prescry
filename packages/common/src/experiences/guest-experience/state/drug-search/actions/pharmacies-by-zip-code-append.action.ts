// Copyright 2021 Prescryptive Health, Inc.

import { IPharmacy } from '../../../../../models/pharmacy';
import { IDrugSearchAction } from './drug-search.action';

export type IPrescriptionPharmaciesAppendAction = IDrugSearchAction<
  'ADD_TO_SOURCE_PHARMACIES'
>;
export const pharmaciesByZipcodeAppendAction = (
  pharmacies: IPharmacy[]
): IPrescriptionPharmaciesAppendAction => ({
  type: 'ADD_TO_SOURCE_PHARMACIES',
  payload: {
    sourcePharmacies: pharmacies,
  },
});
