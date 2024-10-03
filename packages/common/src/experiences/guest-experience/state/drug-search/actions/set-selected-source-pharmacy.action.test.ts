// Copyright 2021 Prescryptive Health, Inc.

import { selectedPharmacyMock } from '../../../__mocks__/selected-pharmacy.mock';
import { IDrugSearchState } from '../drug-search.state';
import { setSelectedSourcePharmacyAction } from './set-selected-source-pharmacy.action';

describe('setSelectedSourcePharmacyAction', () => {
  it('returns action', () => {
    const action = setSelectedSourcePharmacyAction(selectedPharmacyMock);
    expect(action.type).toEqual('SET_SELECTED_SOURCE_PHARMACY');

    const expectedPayload: Partial<IDrugSearchState> = {
      selectedSourcePharmacy: selectedPharmacyMock,
    };
    expect(action.payload).toStrictEqual(expectedPayload);
  });
});
