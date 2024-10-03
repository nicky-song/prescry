// Copyright 2021 Prescryptive Health, Inc.

import { IPharmacyDrugPrice } from '../../../../../models/pharmacy-drug-price';
import { pharmacyDrugPrice1Mock } from '../../../__mocks__/pharmacy-drug-price.mock';
import { IDrugSearchState } from '../drug-search.state';
import { setDrugPriceResultsAction } from './set-drug-price-results.action';

describe('setDrugPriceResultsAction', () => {
  it('returns action', () => {
    const pharmaciesMock: IPharmacyDrugPrice[] = [pharmacyDrugPrice1Mock];
    const errorMessageMock = 'error-message';

    const action = setDrugPriceResultsAction(
      pharmaciesMock,
      pharmacyDrugPrice1Mock,
      errorMessageMock
    );
    expect(action.type).toEqual('SET_DRUG_PRICE_RESULTS');

    const expectedPayload: Partial<IDrugSearchState> = {
      pharmacies: pharmaciesMock,
      bestPricePharmacy: pharmacyDrugPrice1Mock,
      errorMessage: errorMessageMock,
    };
    expect(action.payload).toEqual(expectedPayload);
  });
});
