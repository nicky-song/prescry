// Copyright 2021 Prescryptive Health, Inc.

import { IPrescriptionPharmacy } from '../../../models/platform/pharmacy-lookup.response';
import { IPharmacy } from '@phx/common/src/models/pharmacy';
import { convertHours } from '../../../utils/convert-hours';

export const buildPharmacySearchResponse = (
  pharmacies: IPrescriptionPharmacy[]
): IPharmacy[] => {
  const pharmacyList: IPharmacy[] = [];

  pharmacies.map((pharm) => {
    const pharmacy: IPharmacy = {
      address: pharm.address,
      hours: convertHours(pharm.hours),
      name: pharm.name,
      ncpdp: pharm.ncpdp,
      twentyFourHours: pharm.twentyFourHours ?? false,
      phoneNumber: pharm.phone,
      distance: pharm.distanceFromSearchPointInMiles
        ? Number(pharm.distanceFromSearchPointInMiles.toFixed(2))
        : pharm.distanceFromSearchPointInMiles === 0
        ? 0
        : undefined,
      isMailOrderOnly: pharm.isMailOrderOnly ?? false,
      inNetwork: pharm.inNetwork,
    };
    pharmacyList.push(pharmacy);
  });

  return pharmacyList;
};
