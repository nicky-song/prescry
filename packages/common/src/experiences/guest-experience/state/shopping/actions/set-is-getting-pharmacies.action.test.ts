// Copyright 2022 Prescryptive Health, Inc.

import { setIsGettingPharmaciesAction } from './set-is-getting-pharmacies.action';

describe('setIsGettingPharmaciesAction', () => {
  it.each([[true], [false]])(
    'returns action when isGettingPharmacies is %s',
    (isGettingPharmacies: boolean) => {
      const action = setIsGettingPharmaciesAction(isGettingPharmacies);
      expect(action.type).toEqual('SET_IS_GETTING_PHARMACIES');
      expect(action.payload).toEqual({
        isGettingPharmacies,
      });
    }
  );
});
