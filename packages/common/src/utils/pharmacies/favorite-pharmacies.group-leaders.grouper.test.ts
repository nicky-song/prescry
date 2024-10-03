// Copyright 2022 Prescryptive Health, Inc.

import { IPharmacy } from '../../models/pharmacy';
import { IPharmacyDrugPrice } from '../../models/pharmacy-drug-price';
import { favoritePharmaciesGroupLeaderGrouper } from './favorite-pharmacies.group-leaders.grouper';

describe('favoritePharmaciesGroupLeaderGrouper', () => {
  it('groups group leaders as expected, prioritizing favorited pharmacies', () => {
    const pharmacyDrugPriceMock5a: IPharmacyDrugPrice = {
      pharmacy: {
        name: 'pharmacyDrugPriceMock5a',
        brand: 'brand-5',
        chainId: 5,
        ncpdp: '5a',
        distance: 3,
      } as IPharmacy,
    } as IPharmacyDrugPrice;

    const pharmacyDrugPriceMock5b: IPharmacyDrugPrice = {
      pharmacy: {
        name: 'pharmacyDrugPriceMock5b',
        brand: 'brand-5',
        chainId: 5,
        ncpdp: '5b',
        distance: 4,
      } as IPharmacy,
    } as IPharmacyDrugPrice;

    const pharmacyDrugPriceMock5c: IPharmacyDrugPrice = {
      pharmacy: {
        name: 'pharmacyDrugPriceMock5c',
        brand: 'brand-5',
        chainId: 5,
        ncpdp: '5c',
        distance: 1,
      } as IPharmacy,
      price: { memberPays: 5, planPays: 5 },
    } as IPharmacyDrugPrice;

    const pharmacyDrugPriceMock5d: IPharmacyDrugPrice = {
      pharmacy: {
        name: 'pharmacyDrugPriceMock5d',
        brand: 'brand-5',
        chainId: 5,
        ncpdp: '5d',
        distance: 2,
      } as IPharmacy,
    } as IPharmacyDrugPrice;

    const pharmaciesDrugPriceMock = {
      pharmacy: pharmacyDrugPriceMock5a.pharmacy,
      otherPharmacies: [
        pharmacyDrugPriceMock5b,
        pharmacyDrugPriceMock5c,
        pharmacyDrugPriceMock5d,
      ],
    };

    const favoritedPharmacies = [
      pharmacyDrugPriceMock5c.pharmacy.ncpdp,
      pharmacyDrugPriceMock5d.pharmacy.ncpdp,
    ];

    const expectedPharmacyDrugPrice: IPharmacyDrugPrice = {
      pharmacy: pharmacyDrugPriceMock5c.pharmacy,
      otherPharmacies: [
        { ...pharmacyDrugPriceMock5d, otherPharmacies: undefined },
        { ...pharmacyDrugPriceMock5a, otherPharmacies: undefined },
        { ...pharmacyDrugPriceMock5b, otherPharmacies: undefined },
      ],
    };

    const actualPharmacyDrugPrice = favoritePharmaciesGroupLeaderGrouper(
      pharmaciesDrugPriceMock,
      favoritedPharmacies
    );

    expect(actualPharmacyDrugPrice).toEqual(expectedPharmacyDrugPrice);
  });

  it('groups group leaders, prioritizing favorited pharmacies with defined distance', () => {
    const pharmacyDrugPriceMock5a: IPharmacyDrugPrice = {
      pharmacy: {
        name: 'pharmacyDrugPriceMock5a',
        brand: 'brand-5',
        chainId: 5,
        ncpdp: '5a',
        distance: 3,
      } as IPharmacy,
    } as IPharmacyDrugPrice;

    const pharmacyDrugPriceMock5b: IPharmacyDrugPrice = {
      pharmacy: {
        name: 'pharmacyDrugPriceMock5b',
        brand: 'brand-5',
        chainId: 5,
        ncpdp: '5b',
        distance: 4,
      } as IPharmacy,
    } as IPharmacyDrugPrice;

    const pharmacyDrugPriceMock5c: IPharmacyDrugPrice = {
      pharmacy: {
        name: 'pharmacyDrugPriceMock5c',
        brand: 'brand-5',
        chainId: 5,
        ncpdp: '5c',
      } as IPharmacy,
      price: { memberPays: 5, planPays: 5 },
    } as IPharmacyDrugPrice;

    const pharmacyDrugPriceMock5d: IPharmacyDrugPrice = {
      pharmacy: {
        name: 'pharmacyDrugPriceMock5d',
        brand: 'brand-5',
        chainId: 5,
        ncpdp: '5d',
        distance: 99,
      } as IPharmacy,
    } as IPharmacyDrugPrice;

    const pharmaciesDrugPriceMock = {
      pharmacy: pharmacyDrugPriceMock5a.pharmacy,
      otherPharmacies: [
        pharmacyDrugPriceMock5b,
        pharmacyDrugPriceMock5c,
        pharmacyDrugPriceMock5d,
      ],
    };

    const favoritedPharmacies = [
      pharmacyDrugPriceMock5c.pharmacy.ncpdp,
      pharmacyDrugPriceMock5d.pharmacy.ncpdp,
    ];

    const expectedPharmacyDrugPrice: IPharmacyDrugPrice = {
      pharmacy: pharmacyDrugPriceMock5d.pharmacy,
      otherPharmacies: [
        { ...pharmacyDrugPriceMock5c, otherPharmacies: undefined },
        { ...pharmacyDrugPriceMock5a, otherPharmacies: undefined },
        { ...pharmacyDrugPriceMock5b, otherPharmacies: undefined },
      ],
    };

    const actualPharmacyDrugPrice = favoritePharmaciesGroupLeaderGrouper(
      pharmaciesDrugPriceMock,
      favoritedPharmacies
    );

    expect(actualPharmacyDrugPrice).toEqual(expectedPharmacyDrugPrice);
  });

  it('groups group leaders, prioritizing favorited pharmacies in order of distance', () => {
    const pharmacyDrugPriceMock5a: IPharmacyDrugPrice = {
      pharmacy: {
        name: 'pharmacyDrugPriceMock5a',
        brand: 'brand-5',
        chainId: 5,
        ncpdp: '5a',
        distance: 3,
      } as IPharmacy,
    } as IPharmacyDrugPrice;

    const pharmacyDrugPriceMock5b: IPharmacyDrugPrice = {
      pharmacy: {
        name: 'pharmacyDrugPriceMock5b',
        brand: 'brand-5',
        chainId: 5,
        ncpdp: '5b',
        distance: 4,
      } as IPharmacy,
    } as IPharmacyDrugPrice;

    const pharmacyDrugPriceMock5c: IPharmacyDrugPrice = {
      pharmacy: {
        name: 'pharmacyDrugPriceMock5c',
        brand: 'brand-5',
        chainId: 5,
        ncpdp: '5c',
        distance: 2,
      } as IPharmacy,
      price: { memberPays: 5, planPays: 5 },
    } as IPharmacyDrugPrice;

    const pharmacyDrugPriceMock5d: IPharmacyDrugPrice = {
      pharmacy: {
        name: 'pharmacyDrugPriceMock5d',
        brand: 'brand-5',
        chainId: 5,
        ncpdp: '5d',
        distance: 1,
      } as IPharmacy,
    } as IPharmacyDrugPrice;

    const pharmaciesDrugPriceMock = {
      pharmacy: pharmacyDrugPriceMock5a.pharmacy,
      otherPharmacies: [
        pharmacyDrugPriceMock5b,
        pharmacyDrugPriceMock5c,
        pharmacyDrugPriceMock5d,
      ],
    };

    const favoritedPharmacies = [
      pharmacyDrugPriceMock5c.pharmacy.ncpdp,
      pharmacyDrugPriceMock5d.pharmacy.ncpdp,
    ];

    const expectedPharmacyDrugPrice: IPharmacyDrugPrice = {
      pharmacy: pharmacyDrugPriceMock5d.pharmacy,
      otherPharmacies: [
        { ...pharmacyDrugPriceMock5c, otherPharmacies: undefined },
        { ...pharmacyDrugPriceMock5a, otherPharmacies: undefined },
        { ...pharmacyDrugPriceMock5b, otherPharmacies: undefined },
      ],
    };

    const actualPharmacyDrugPrice = favoritePharmaciesGroupLeaderGrouper(
      pharmaciesDrugPriceMock,
      favoritedPharmacies
    );

    expect(actualPharmacyDrugPrice).toEqual(expectedPharmacyDrugPrice);
  });
});
