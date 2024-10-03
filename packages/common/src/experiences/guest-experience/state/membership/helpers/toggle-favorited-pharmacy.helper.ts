// Copyright 2022 Prescryptive Health, Inc.

export const toggleFavoritedPharmacyHelper = (
  favoritePharmacyNcpdp: string,
  favoritedPharmacies: string[]
): string[] => {
  const ncpdpIndex = favoritedPharmacies.indexOf(favoritePharmacyNcpdp);

  if (ncpdpIndex >= 0) {
    const updatedFavoritedPharmacies = [
      ...favoritedPharmacies.slice(0, ncpdpIndex),
      ...favoritedPharmacies.slice(ncpdpIndex + 1),
    ];

    return updatedFavoritedPharmacies;
  } else {
    const updatedFavoritedPharmacies = [
      ...favoritedPharmacies,
      favoritePharmacyNcpdp,
    ];

    return updatedFavoritedPharmacies;
  }
};
