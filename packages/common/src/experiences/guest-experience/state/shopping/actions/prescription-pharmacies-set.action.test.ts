// Copyright 2021 Prescryptive Health, Inc.

import { IPharmacyDrugPrice } from '../../../../../models/pharmacy-drug-price';
import {
  pharmacyDrugPrice1Mock,
  pharmacyDrugPrice2Mock,
} from '../../../__mocks__/pharmacy-drug-price.mock';
import { IShoppingState } from '../shopping.state';
import { prescriptionPharmaciesSetAction } from './prescription-pharmacies-set.action';

describe('prescriptionPharmaciesSetAction', () => {
  it('returns action', () => {
    const pharmaciesMock: IPharmacyDrugPrice[] = [
      pharmacyDrugPrice1Mock,
      pharmacyDrugPrice2Mock,
    ];

    const action = prescriptionPharmaciesSetAction(pharmaciesMock);

    expect(action.type).toEqual('PRESCRIPTION_PHARMACIES_SET');
    const expectedPayload: Partial<IShoppingState> = {
      prescriptionPharmacies: pharmaciesMock,
    };
    expect(action.payload).toEqual(expectedPayload);
  });
  it('returns error message if exists error', () => {
    const pharmaciesMock: IPharmacyDrugPrice[] = [];

    const action = prescriptionPharmaciesSetAction(
      pharmaciesMock,
      undefined,
      'error occurred'
    );

    expect(action.type).toEqual('PRESCRIPTION_PHARMACIES_SET');
    const expectedPayload: Partial<IShoppingState> = {
      prescriptionPharmacies: pharmaciesMock,
      errorMessage: 'error occurred',
    };
    expect(action.payload).toEqual(expectedPayload);
  });
});
