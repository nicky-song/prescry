// Copyright 2022 Prescryptive Health, Inc.

import { IPharmacy } from '@phx/common/src/models/pharmacy';
import { IConfiguration } from '../../../configuration';
import { convertPrescriptionPharmacyToPharmacy } from '../../../utils/convert-prescription-pharmacy-to-pharmacy';
import { getPharmacyDetailsByNcpdp } from '../../prescription/helpers/get-pharmacy-details-by-ncpdp';

export const getFavoritedPharmaciesByNcpdpList = async (
  ncpdpList: string[],
  configuration: IConfiguration
): Promise<IPharmacy[]> => {
  const pharmacyDetailsList: IPharmacy[] = [];
  for await (const ncpdp of ncpdpList) {
    const pharmacyDetails = await getPharmacyDetailsByNcpdp(
      ncpdp,
      configuration
    );

    if (pharmacyDetails)
      pharmacyDetailsList.push(
        convertPrescriptionPharmacyToPharmacy(pharmacyDetails)
      );
  }
  return pharmacyDetailsList;
};
