// Copyright 2022 Prescryptive Health, Inc.

import { ApiConstants } from '../../../constants/api-constants';
import { IConfiguration } from '../../../configuration';
import { getDataFromUrl } from '../../../utils/get-data-from-url';
import { generateBearerToken } from '../../provider-location/helpers/oauth-api-helper';
import { defaultRetryPolicy } from '../../../utils/fetch-retry.helper';

export interface IUpdatePrescriptionHelperResponse {
  success?: boolean;
  errorCode?: number;
  message?: string;
}
export interface IUpdatePrescriptionParams {
  pharmacyManagementSystemPatientId: string;
  rxNo: string;
  refillNo: number;
  clientPatientId: string;
}

export async function updatePrescriptionWithMemberId(
  requestBody: IUpdatePrescriptionParams,
  configuration: IConfiguration
): Promise<IUpdatePrescriptionHelperResponse> {
  try {
    const token: string = await generateBearerToken(
      configuration.platformApiTenantId,
      configuration.platformApiClientId,
      configuration.platformApiClientSecret,
      configuration.platformApiResource,
      true
    );

    const apiResponse = await getDataFromUrl(
      `${configuration.platformGearsApiUrl}/prescription/1.0/prescription`,
      requestBody,
      'PATCH',
      {
        Authorization: `Bearer ${token}`,
        [ApiConstants.PLATFORM_API_HEADER_KEY]:
          configuration.gearsApiSubscriptionKey,
      },
      true,
      undefined,
      defaultRetryPolicy
    );
    if (apiResponse.ok) {
      return { success: true };
    }
    return { success: false };
  } catch {
    return {
      errorCode: 500,
      message: 'error',
    };
  }
}
