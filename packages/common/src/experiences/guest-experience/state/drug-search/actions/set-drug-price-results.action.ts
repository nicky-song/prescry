// Copyright 2021 Prescryptive Health, Inc.

import { IPharmacyDrugPrice } from '../../../../../models/pharmacy-drug-price';
import { IDrugSearchAction } from './drug-search.action';

export type ISetDrugPriceResultsAction = IDrugSearchAction<
  'SET_DRUG_PRICE_RESULTS'
>;

export const setDrugPriceResultsAction = (
  pharmacies: IPharmacyDrugPrice[],
  bestPricePharmacy?: IPharmacyDrugPrice,
  message?: string
): ISetDrugPriceResultsAction => ({
  type: 'SET_DRUG_PRICE_RESULTS',
  payload: {
    pharmacies,
    bestPricePharmacy,
    errorMessage: message,
  },
});
