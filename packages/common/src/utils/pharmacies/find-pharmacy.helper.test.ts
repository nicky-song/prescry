// Copyright 2022 Prescryptive Health, Inc.

import { pharmacyDrugPrice1Mock } from '../../experiences/guest-experience/__mocks__/pharmacy-drug-price.mock';
import { IPharmacyDrugPrice } from '../../models/pharmacy-drug-price';
import { findPharmacy } from './find-pharmacy.helper';

describe('findPharmacy', () => {
  it('returns undefined if pharmacy not found', () => {
    const pharmacyDrugPriceMock: IPharmacyDrugPrice[] = [];

    const ncpdpMock = 'ncpdp-mock';

    const foundPharmacy = findPharmacy(pharmacyDrugPriceMock, ncpdpMock);

    expect(foundPharmacy).toBeUndefined();
  });

  it('returns first pharmacy found in pharmacies with matching ncpdp', () => {
    const pharmacyDrugPriceMock: IPharmacyDrugPrice[] = [
      pharmacyDrugPrice1Mock,
    ];

    const ncpdpMock = pharmacyDrugPrice1Mock.pharmacy.ncpdp;

    const foundPharmacy = findPharmacy(pharmacyDrugPriceMock, ncpdpMock);

    expect(foundPharmacy).toEqual(pharmacyDrugPrice1Mock);
  });

  it('returns first pharmacy found in otherPharmacies list with matching ncpdp', () => {
    const pharmacyDrugPriceMock: IPharmacyDrugPrice[] = [
      pharmacyDrugPrice1Mock,
    ];

    const otherPharmacies = pharmacyDrugPrice1Mock.otherPharmacies ?? [];

    const otherPharmacy = otherPharmacies[0];

    const ncpdpMock = otherPharmacy.pharmacy.ncpdp;

    const foundPharmacy = findPharmacy(pharmacyDrugPriceMock, ncpdpMock);

    expect(foundPharmacy).toEqual(otherPharmacy);
  });
});
