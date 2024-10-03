// Copyright 2022 Prescryptive Health, Inc.

import { IConfiguration } from '../../../configuration';
import { ApiConstants } from '../../../constants/api-constants';
import { IFhir } from '../../../models/fhir/fhir';
import { defaultRetryPolicy } from '../../../utils/fetch-retry.helper';
import { getDataFromUrl } from '../../../utils/get-data-from-url';
import { IGetPrescriptionHelperResponse } from './get-prescription-by-id';

export const getPrescriptionInfoForSmartContractAddress = async (
  smartContractAddress: string,
  configuration: IConfiguration
): Promise<IGetPrescriptionHelperResponse> => {
  const apiResponse = await getDataFromUrl(
    buildPlatformBlockchainPrescriptionLookupUrl(
      configuration.platformGearsApiUrl,
      smartContractAddress
    ),
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
    const blockchainPrescription: IFhir = await apiResponse.json();
    return { prescription: blockchainPrescription };
  }

  return { errorCode: apiResponse.status };
};

export function buildPlatformBlockchainPrescriptionLookupUrl(
  platformGearsApiUrl: string,
  smartContractAddress: string
) {
  return `${platformGearsApiUrl}/myrx-account/digital-rx/${smartContractAddress}`;
}
