// Copyright 2021 Prescryptive Health, Inc.

import { ApiConstants } from '../../../constants/api-constants';
import { IConfiguration } from '../../../configuration';
import { getDataFromUrl } from '../../../utils/get-data-from-url';
import { IPrescriptionPharmacy } from '../../../models/platform/pharmacy-lookup.response';
import { defaultRetryPolicy } from '../../../utils/fetch-retry.helper';

export async function getPharmacyDetailsByNcpdp(
  ncpdp: string,
  configuration: IConfiguration
): Promise<IPrescriptionPharmacy | undefined> {
  try {
    if (!ncpdp || ncpdp === '') {
      return undefined;
    }
    const apiResponse = await getDataFromUrl(
      buildPlatformPharmacyLookupUrl(configuration.platformGearsApiUrl, ncpdp),
      undefined,
      'GET',
      {
        [ApiConstants.PLATFORM_API_HEADER_KEY]:
          configuration.gearsApiSubscriptionKey,
      },
      undefined,
      undefined,
      defaultRetryPolicy
    );
    if (apiResponse.ok) {
      const pharmacy: IPrescriptionPharmacy = await apiResponse.json();
      return pharmacy;
    }
    return undefined;
  } catch (error) {
    return undefined;
  }
}

export function buildPlatformPharmacyLookupUrl(
  platformGearsApiUrl: string,
  ncpdp: string
) {
  return `${platformGearsApiUrl}/pharmacies/1.0/pharmacy?ncpdp=${ncpdp}`;
}
