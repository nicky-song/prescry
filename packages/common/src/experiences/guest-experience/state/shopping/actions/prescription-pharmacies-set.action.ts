// Copyright 2021 Prescryptive Health, Inc.

import { IPharmacyDrugPrice } from '../../../../../models/pharmacy-drug-price';
import { IShoppingAction } from './shopping.action';

export type IPrescriptionPharmaciesSetAction = IShoppingAction<
  'PRESCRIPTION_PHARMACIES_SET'
>;

export const prescriptionPharmaciesSetAction = (
  pharmacies: IPharmacyDrugPrice[],
  bestPricePharmacy?: IPharmacyDrugPrice,
  message?: string
): IPrescriptionPharmaciesSetAction => ({
  type: 'PRESCRIPTION_PHARMACIES_SET',
  payload: {
    prescriptionPharmacies: pharmacies,
    bestPricePharmacy,
    errorMessage: message,
  },
});
