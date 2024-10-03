// Copyright 2022 Prescryptive Health, Inc.

import { IPharmacyDrugPrice } from '../../models/pharmacy-drug-price';

export const favoritePharmaciesGroupLeaderGrouper = (
  groupedPharmacyDrugPrice: IPharmacyDrugPrice,
  favoritedPharmacies: string[]
) => {
  const temporaryPharmaciesFlattened = [
    groupedPharmacyDrugPrice,
    ...(groupedPharmacyDrugPrice.otherPharmacies ?? []),
  ];
  const temporaryPharmaciesFavorited: IPharmacyDrugPrice[] = [];
  const temporaryPharmaciesNormal: IPharmacyDrugPrice[] = [];

  temporaryPharmaciesFlattened.forEach((temporaryPharmacyDrugPrice) => {
    if (
      favoritedPharmacies.includes(temporaryPharmacyDrugPrice.pharmacy.ncpdp)
    ) {
      temporaryPharmaciesFavorited.push({
        ...temporaryPharmacyDrugPrice,
        otherPharmacies: undefined,
      });
    } else {
      temporaryPharmaciesNormal.push({
        ...temporaryPharmacyDrugPrice,
        otherPharmacies: undefined,
      });
    }
  });

  const sortPharmacyDrugPriceByDistance = (
    pharmacyDrugPriceToBeSorted: IPharmacyDrugPrice[]
  ) => {
    return pharmacyDrugPriceToBeSorted.sort(
      (pharmacyDrugPrice1, pharmacyDrugPrice2) =>
        (pharmacyDrugPrice1.pharmacy.distance ?? Infinity) <=
        (pharmacyDrugPrice2.pharmacy.distance ?? Infinity)
          ? -1
          : 1
    );
  };

  const favoritedPharmaciesSortedByDistance = sortPharmacyDrugPriceByDistance(
    temporaryPharmaciesFavorited
  );

  const normalPharmaciesSortedByDistance = sortPharmacyDrugPriceByDistance(
    temporaryPharmaciesNormal
  );

  const temporaryPharmaciesCombined = [
    ...favoritedPharmaciesSortedByDistance,
    ...normalPharmaciesSortedByDistance,
  ];

  groupedPharmacyDrugPrice.pharmacy = temporaryPharmaciesCombined[0].pharmacy;
  groupedPharmacyDrugPrice.otherPharmacies =
    temporaryPharmaciesCombined.splice(1);

  return groupedPharmacyDrugPrice;
};
