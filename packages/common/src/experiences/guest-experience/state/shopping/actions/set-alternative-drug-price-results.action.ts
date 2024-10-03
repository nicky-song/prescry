// Copyright 2022 Prescryptive Health, Inc.

import { IAlternativeDrugPrice } from '../../../../../models/alternative-drug-price';
import { IShoppingAction } from './shopping.action';

export type ISetAlternativeDrugPriceResultsAction =
  IShoppingAction<'SET_ALTERNATIVE_DRUG_SEARCH_RESULTS'>;

export const setAlternativeDrugResultsAction = (
  alternativeDrugPrice: IAlternativeDrugPrice | undefined
): ISetAlternativeDrugPriceResultsAction => ({
  type: 'SET_ALTERNATIVE_DRUG_SEARCH_RESULTS',
  payload: {
    alternativeDrugPrice,
  },
});
