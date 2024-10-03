// Copyright 2021 Prescryptive Health, Inc.

import { ApiConstants } from '../../../constants/api-constants';
import { IConfiguration } from '../../../configuration';
import { getDataFromUrl } from '../../../utils/get-data-from-url';
// import { generateBearerToken } from '../../provider-location/helpers/oauth-api-helper';
import { IFhir } from '../../../models/fhir/fhir';
import { IPlatformApiError } from '../../../models/platform/platform-api-error.response';
import { defaultRetryPolicy } from '../../../utils/fetch-retry.helper';
export interface IGetPrescriptionsHelperResponse {
  prescriptions?: IFhir[];
  errorCode?: number;
  message?: string;
  blockchainPrescriptions?: IFhir[];
}
export async function getPrescriptionsEndpointHelper(
  clientPatientId: string,
  configuration: IConfiguration,
  retry: boolean
): Promise<IGetPrescriptionsHelperResponse> {
  try {
    const apiResponse = await getDataFromUrl(
      buildGetPrescriptionUrl(
        configuration.platformGearsApiUrl,
        clientPatientId
      ),
      undefined,
      'GET',
      {
        [ApiConstants.PLATFORM_API_HEADER_KEY]:
          configuration.gearsApiSubscriptionKey,
      },
      undefined,
      ApiConstants.MEDICINE_CABINET_API_TIMEOUT,
      retry ? defaultRetryPolicy : undefined
    );
    if (apiResponse.ok) {
      const prescriptions: IFhir[] = await apiResponse.json();
      return { prescriptions };
    }
    const error: IPlatformApiError = await apiResponse.json();
    const response: IGetPrescriptionsHelperResponse = {
      errorCode: apiResponse.status,
      message: error.title,
    };
    return response;
  } catch {
    return {
      errorCode: 500,
      message: 'error',
    };
  }
}

export function buildGetPrescriptionUrl(
  platformGearsApiUrl: string,
  clientPatientId: string
) {
  return `${platformGearsApiUrl}/whitefish/1.0/patient/${clientPatientId}/prescriptions?sourceSystem=MyRx`;
}
