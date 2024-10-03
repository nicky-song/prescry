// Copyright 2022 Prescryptive Health, Inc.

export const isFavoritedPharmaciesValid = (
  favoritedPharmacies?: string[]
): boolean => {
  return favoritedPharmacies !== undefined && !favoritedPharmacies.includes('');
};
