// Copyright 2022 Prescryptive Health, Inc.

import { isFavoritedPharmaciesValid } from './favorited-pharmacies.helper';

describe('isFavoritedPharmaciesValid', () => {
  it.each([
    [['', ''], false],
    [['ncpdp', ''], false],
    [['ncpdp', 'ncpdp'], true],
    [undefined, false],
  ])(
    'validates favorited pharmacies does not contain empty string %s is %s',
    (favoritedPharmacies: string[] | undefined, isValid: boolean) => {
      expect(isFavoritedPharmaciesValid(favoritedPharmacies)).toEqual(isValid);
    }
  );
});
