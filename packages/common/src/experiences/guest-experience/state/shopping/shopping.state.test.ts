// Copyright 2021 Prescryptive Health, Inc.

import { defaultShoppingState, IShoppingState } from './shopping.state';

describe('ShoppingState', () => {
  it('has expected default state', () => {
    const expectedState: IShoppingState = {
      prescriptionPharmacies: [],
      noPharmaciesFound: false,
      isGettingPharmacies: false,
    };

    expect(defaultShoppingState).toEqual(expectedState);
  });
});
