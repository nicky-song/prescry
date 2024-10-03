// Copyright 2022 Prescryptive Health, Inc.

import { IAlternativeDrugPrice } from '../../../../../models/alternative-drug-price';
import { setAlternativeDrugResultsAction } from './set-alternative-drug-price-results.action';

describe('setAlternativeDrugResultsAction', () => {
  it('returns action', () => {
    const alternativeDrugPriceMock = {} as IAlternativeDrugPrice;
    const action = setAlternativeDrugResultsAction(alternativeDrugPriceMock);
    expect(action.type).toEqual('SET_ALTERNATIVE_DRUG_SEARCH_RESULTS');
    expect(action.payload).toEqual({
      alternativeDrugPrice: alternativeDrugPriceMock,
    });
  });
});
