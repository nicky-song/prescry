// Copyright 2022 Prescryptive Health, Inc.

import { IPharmacyDrugPrice } from '@phx/common/src/models/pharmacy-drug-price';

export const pharmacyDrugPriceGrouper = (
  pharmacyDrugPriceList: IPharmacyDrugPrice[]
): IPharmacyDrugPrice[] => {
  if (!pharmacyDrugPriceList.length) {
    return [];
  }

  const pharmacyDrugPriceMap: Map<string, IPharmacyDrugPrice> = new Map<
    string,
    IPharmacyDrugPrice
  >();

  pharmacyDrugPriceList.forEach(
    (pharmacyDrugPrice: IPharmacyDrugPrice, index: number) => {
      if (
        pharmacyDrugPrice.pharmacy.brand &&
        pharmacyDrugPrice.pharmacy.chainId &&
        pharmacyDrugPrice.price?.memberPays !== undefined &&
        pharmacyDrugPrice.price?.planPays !== undefined
      ) {
        const {
          pharmacy: { brand, chainId },
          price: { memberPays, planPays },
        } = pharmacyDrugPrice;
        const pharmacyDrugPriceKey = `${brand}${chainId}${memberPays}${planPays}`;
        const originalPharmacyDrugPrice =
          pharmacyDrugPriceMap.get(pharmacyDrugPriceKey);

        if (originalPharmacyDrugPrice) {
          const newPharmacyDrugPrice: IPharmacyDrugPrice =
            originalPharmacyDrugPrice;
          newPharmacyDrugPrice.otherPharmacies = [
            ...(originalPharmacyDrugPrice.otherPharmacies ?? []),
            pharmacyDrugPrice,
          ];

          pharmacyDrugPriceMap.set(pharmacyDrugPriceKey, newPharmacyDrugPrice);
        } else {
          pharmacyDrugPriceMap.set(pharmacyDrugPriceKey, pharmacyDrugPrice);
        }
      } else {
        pharmacyDrugPriceMap.set(`no-group-${index}`, pharmacyDrugPrice);
      }
    }
  );

  return [...pharmacyDrugPriceMap.values()];
};
