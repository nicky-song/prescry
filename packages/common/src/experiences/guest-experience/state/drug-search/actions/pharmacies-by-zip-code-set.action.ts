// Copyright 2021 Prescryptive Health, Inc.

import { IPharmacy } from '../../../../../models/pharmacy';
import { IDrugSearchAction } from './drug-search.action';

export type IPrescriptionPharmaciesSetAction = IDrugSearchAction<
  'SET_PHARMACIES'
>;
export const pharmaciesByZipcodeSetAction = (
  pharmacies: IPharmacy[]
): IPrescriptionPharmaciesSetAction => ({
  type: 'SET_PHARMACIES',
  payload: {
    sourcePharmacies: pharmacies,
  },
});
