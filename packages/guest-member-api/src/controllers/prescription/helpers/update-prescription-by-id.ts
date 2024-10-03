// Copyright 2021 Prescryptive Health, Inc.

import { ApiConstants } from '../../../constants/api-constants';
import { IConfiguration } from '../../../configuration';
import { getDataFromUrl } from '../../../utils/get-data-from-url';
import { generateBearerToken } from '../../provider-location/helpers/oauth-api-helper';
import { IFhir } from '../../../models/fhir/fhir';
import { IPlatformApiError } from '../../../models/platform/platform-api-error.response';

export interface ISendPrescriptionHelperResponse {
  success: boolean;
  errorCode?: number;
  message?: string;
}
export async function updatePrescriptionById(
  prescription: IFhir,
  configuration: IConfiguration
): Promise<ISendPrescriptionHelperResponse> {
  const token: string = await generateBearerToken(
    configuration.platformApiTenantId,
    configuration.platformApiClientId,
    configuration.platformApiClientSecret,
    configuration.platformApiResource,
    true
  );

  const apiResponse = await getDataFromUrl(
    buildUpdatePrescriptionUrl(configuration.platformApiUrl, prescription.id),
    prescription,
    'PATCH',
    {
      Authorization: `Bearer ${token}`,
      [ApiConstants.PLATFORM_API_HEADER_KEY]:
        configuration.platformPrescriptionApiHeaderKey,
    }
  );
  if (apiResponse.ok) {
    return { success: true };
  }
  const error: IPlatformApiError = await apiResponse.json();
  return { success: false, errorCode: error.status, message: error.title };
}

export function buildUpdatePrescriptionUrl(
  platformApi: string,
  prescriptionId: string
) {
  return `${platformApi}/prescription/${prescriptionId}/pharmacy`;
}
