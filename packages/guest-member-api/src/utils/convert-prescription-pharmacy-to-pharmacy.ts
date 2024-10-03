// Copyright 2022 Prescryptive Health, Inc.

import { IPharmacy } from '@phx/common/src/models/pharmacy';
import { IPrescriptionPharmacy } from '../models/platform/pharmacy-lookup.response';
import { convertHours } from './convert-hours';

export const convertPrescriptionPharmacyToPharmacy = (
  prescriptionPharmacy: IPrescriptionPharmacy
) => {
  const pharmacy: IPharmacy = {
    address: {
      ...prescriptionPharmacy.address,
      lineOne: prescriptionPharmacy.address.lineOne.trim(),
      lineTwo: prescriptionPharmacy.address.lineTwo?.trim(),
      city: prescriptionPharmacy.address.city.trim(),
      state: prescriptionPharmacy.address.state.trim(),
      zip: prescriptionPharmacy.address.zip.trim(),
    },
    isMailOrderOnly: prescriptionPharmacy.isMailOrderOnly ?? false,
    name: prescriptionPharmacy.name.trim(),
    ncpdp: prescriptionPharmacy.ncpdp,
    hours: convertHours(prescriptionPharmacy.hours),
    phoneNumber: prescriptionPharmacy.phone?.trim(),
    twentyFourHours: prescriptionPharmacy.twentyFourHours ?? false,
    distance:
      prescriptionPharmacy.distanceFromSearchPointInMiles ||
      prescriptionPharmacy.distanceFromSearchPointInMiles === 0
        ? Number(prescriptionPharmacy.distanceFromSearchPointInMiles.toFixed(2))
        : undefined,
    inNetwork: prescriptionPharmacy.inNetwork,
    nationalProviderIdentifier: prescriptionPharmacy.nationalProviderIdentifier,
    type: prescriptionPharmacy.type,
    hasDriveThru: prescriptionPharmacy.hasDriveThru,
    fax: prescriptionPharmacy.fax,
    email: prescriptionPharmacy.email,
    brand: prescriptionPharmacy.brand,
    chainId: prescriptionPharmacy.chainId,
  };
  return pharmacy;
};
