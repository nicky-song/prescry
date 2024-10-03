// Copyright 2021 Prescryptive Health, Inc.

import { pharmacyDrugPrice1Mock } from '../../../__mocks__/pharmacy-drug-price.mock';
import { IDrugSearchState } from '../drug-search.state';
import { setSelectedPharmacyAction } from './set-selected-pharmacy.action';

describe('setSelectedPharmacyAction', () => {
  it('returns action', () => {
    const action = setSelectedPharmacyAction(pharmacyDrugPrice1Mock);
    expect(action.type).toEqual('SET_SELECTED_PHARMACY');

    const expectedPayload: Partial<IDrugSearchState> = {
      selectedPharmacy: pharmacyDrugPrice1Mock,
    };
    expect(action.payload).toStrictEqual(expectedPayload);
  });
});
