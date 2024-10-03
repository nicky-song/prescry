// Copyright 2021 Prescryptive Health, Inc.

import { ApiConstants } from '../../../constants/api-constants';
import { IConfiguration } from '../../../configuration';
import { getDataFromUrl } from '../../../utils/get-data-from-url';
import { IFhir } from '../../../models/fhir/fhir';
import { IPlatformApiError } from '../../../models/platform/platform-api-error.response';
import { defaultRetryPolicy } from '../../../utils/fetch-retry.helper';

export interface IGetPrescriptionHelperResponse {
  prescription?: IFhir;
  errorCode?: number;
  message?: string;
}
export async function getPrescriptionById(
  prescriptionId: string,
  configuration: IConfiguration
): Promise<IGetPrescriptionHelperResponse> {
  const apiResponse = await getDataFromUrl(
    buildGetPrescriptionUrl(configuration.platformGearsApiUrl, prescriptionId),
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
    const prescription: IFhir = await apiResponse.json();
    return { prescription };
  }
  const error: IPlatformApiError = await apiResponse.json();
  return { errorCode: apiResponse.status, message: error.title };
}

export function buildGetPrescriptionUrl(
  platformGearsApiUrl: string,
  prescriptionId: string
) {
  return `${platformGearsApiUrl}/whitefish/1.0/prescription/${prescriptionId}`;
}
