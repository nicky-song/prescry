// Copyright 2022 Prescryptive Health, Inc.

import { IPharmacyDrugPrice } from '../../models/pharmacy-drug-price';

export const findPharmacy = (
  pharmacies: IPharmacyDrugPrice[],
  ncpdp: string
): IPharmacyDrugPrice | undefined => {
  const isFoundPharmacy = (pharmacyNcpdp?: string) => {
    return pharmacyNcpdp === ncpdp;
  };

  const getOtherPharmacy = (otherPharmacies?: IPharmacyDrugPrice[]) => {
    return otherPharmacies?.find((otherPharmacy: IPharmacyDrugPrice) => {
      return isFoundPharmacy(otherPharmacy.pharmacy.ncpdp);
    });
  };

  const foundPharmacy = pharmacies.find((pharmacy: IPharmacyDrugPrice) => {
    return (
      isFoundPharmacy(pharmacy.pharmacy.ncpdp) ||
      getOtherPharmacy(pharmacy.otherPharmacies)
    );
  });

  if (isFoundPharmacy(foundPharmacy?.pharmacy.ncpdp)) {
    return foundPharmacy;
  }

  return getOtherPharmacy(foundPharmacy?.otherPharmacies);
};
