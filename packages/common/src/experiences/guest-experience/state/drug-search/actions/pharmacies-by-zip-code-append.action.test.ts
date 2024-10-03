// Copyright 2021 Prescryptive Health, Inc.

import { IPharmacy } from '../../../../../models/pharmacy';
import { pharmaciesByZipcodeAppendAction } from './pharmacies-by-zip-code-append.action';

describe('pharmaciesByZipcodeAppendAction', () => {
  it('returns action', () => {
    const pharmaciesMock = [{ name: 'pharmacy-name' } as IPharmacy];
    const action = pharmaciesByZipcodeAppendAction(pharmaciesMock);
    expect(action.type).toEqual('ADD_TO_SOURCE_PHARMACIES');

    expect(action.payload).toEqual({
      sourcePharmacies: pharmaciesMock,
    });
  });
});
