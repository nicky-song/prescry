// Copyright 2022 Prescryptive Health, Inc.

import { ApiConstants } from '../../../constants/api-constants';
import { IConfiguration } from '../../../configuration';
import { ISendPrescriptionHelperResponse } from './update-prescription-by-id';
import { defaultRetryPolicy } from '../../../utils/fetch-retry.helper';
import { getDataFromUrlWithAuth0 } from '../../../utils/get-data-from-url-with-auth0';

export async function assignPharmacyToBlockchainPrescription(
  smartContractAddress: string,
  accountId: string,
  ncpdpid: string,
  configuration: IConfiguration
): Promise<ISendPrescriptionHelperResponse> {
  try {
    const apiResponse = await getDataFromUrlWithAuth0(
      'identity',
      configuration.auth0,
      buildAssignPharmacyToBlockchainPrescriptionUrl(
        configuration.platformGearsApiUrl,
        smartContractAddress
      ),
      { accountId, ncpdpid, masterId: accountId },
      'POST',
      {
        [ApiConstants.PLATFORM_API_HEADER_KEY]:
          configuration.gearsApiSubscriptionKey,
      },
      undefined,
      undefined,
      defaultRetryPolicy
    );
    if (apiResponse.ok) {
      return { success: true };
    }
    return { success: false, errorCode: apiResponse.status };
  } catch {
    return { success: false, errorCode: 500 };
  }
}

export function buildAssignPharmacyToBlockchainPrescriptionUrl(
  platformGearsApiUrl: string,
  smartContractAddress: string
) {
  return `${platformGearsApiUrl}/myrx-account/digital-rx/${smartContractAddress}/assign-pharmacy`;
}
