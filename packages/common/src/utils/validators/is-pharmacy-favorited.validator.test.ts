// Copyright 2022 Prescryptive Health, Inc.

import { isPharmacyFavorited } from './is-pharmacy-favorited.validator';

describe('isPharmacyFavorited', () => {
  it.each([
    ['111', ['111', '222'], true],
    ['111', ['222', '111'], true],
    ['111', ['222', '333'], false],
    [undefined, ['111'], false],
    ['111', [], false],
    [undefined, undefined, false],
    [undefined, [], false],
  ])(
    'expected pharmacy favorited if ncpdp: %s & favoritedPharmacies: %s = %s',
    (
      ncpdp: string | undefined,
      favoritedPharmacies: string[] | undefined,
      pharmacyIsFavorited: boolean
    ) => {
      expect(isPharmacyFavorited(ncpdp, favoritedPharmacies)).toEqual(
        pharmacyIsFavorited
      );
    }
  );
});
