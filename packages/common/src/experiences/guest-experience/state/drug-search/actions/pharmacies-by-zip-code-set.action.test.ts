// Copyright 2021 Prescryptive Health, Inc.

import { IPharmacy } from '../../../../../models/pharmacy';
import { pharmaciesByZipcodeSetAction } from './pharmacies-by-zip-code-set.action';

describe('pharmaciesByZipcodeSetAction', () => {
  it('returns action', () => {
    const pharmaciesMock = [{ name: 'pharmacy-name' } as IPharmacy];
    const action = pharmaciesByZipcodeSetAction(pharmaciesMock);
    expect(action.type).toEqual('SET_PHARMACIES');

    expect(action.payload).toEqual({
      sourcePharmacies: pharmaciesMock,
    });
  });
});
