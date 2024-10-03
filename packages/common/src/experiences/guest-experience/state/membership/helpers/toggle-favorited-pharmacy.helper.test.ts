// Copyright 2022 Prescryptive Health, Inc.

import { toggleFavoritedPharmacyHelper } from './toggle-favorited-pharmacy.helper';

const favoritePharmacyNcpdpMock = 'favorite-pharmacy-ncpdp-mock';
const favoritedPharmaciesMock = [favoritePharmacyNcpdpMock];

describe('toggleFavoritedPharmacyHelper', () => {
  it('returns updated favorited pharmacies with appended ncpdp if not in original', () => {
    const someNcpdpMock = 'some-ncpdp-mock';

    const updatedFavoritedPharmacies = toggleFavoritedPharmacyHelper(
      someNcpdpMock,
      favoritedPharmaciesMock
    );

    const expectedFavoritedPharmacies = [
      ...favoritedPharmaciesMock,
      someNcpdpMock,
    ];

    expect(updatedFavoritedPharmacies).toEqual(expectedFavoritedPharmacies);
  });

  it('returns updated favorited pharmacies with removed ncpdp if in original', () => {
    const updatedFavoritedPharmacies = toggleFavoritedPharmacyHelper(
      favoritePharmacyNcpdpMock,
      favoritedPharmaciesMock
    );

    const expectedFavoritedPharmacies: string[] = [];

    expect(updatedFavoritedPharmacies).toEqual(expectedFavoritedPharmacies);
  });
});
