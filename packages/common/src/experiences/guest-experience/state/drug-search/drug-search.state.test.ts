// Copyright 2021 Prescryptive Health, Inc.

import { defaultDrugSearchState, IDrugSearchState } from './drug-search.state';

describe('DrugSearchState', () => {
  it('has expected default state', () => {
    const expectedState: IDrugSearchState = {
      drugSearchResults: [],
      pharmacies: [],
      sourcePharmacies: [],
      noPharmaciesFound: false,
      timeStamp: 0,
      isGettingPharmacies: false,
    };

    expect(defaultDrugSearchState).toEqual(expectedState);
  });
});
