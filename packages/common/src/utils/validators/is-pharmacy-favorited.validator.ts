// Copyright 2022 Prescryptive Health, Inc.

export const isPharmacyFavorited = (
  ncpdp?: string,
  favoritedPharmacies?: string[]
): boolean => {
  return (
    !!ncpdp &&
    !!(favoritedPharmacies?.length && favoritedPharmacies.indexOf(ncpdp) !== -1)
  );
};
