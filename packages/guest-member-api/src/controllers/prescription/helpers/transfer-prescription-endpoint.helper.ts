// Copyright 2021 Prescryptive Health, Inc.

import { ApiConstants } from '../../../constants/api-constants';
import { IConfiguration } from '../../../configuration';
import { getDataFromUrl } from '../../../utils/get-data-from-url';
import { generateBearerToken } from '../../provider-location/helpers/oauth-api-helper';
import { IFhir } from '../../../models/fhir/fhir';

export interface ITransferPrescriptionHelperResponse {
  success: boolean;
  bundleId?: string;
  errorMessage?: string;
}
export async function transferPrescriptionEndpointHelper(
  prescription: IFhir,
  configuration: IConfiguration
): Promise<ITransferPrescriptionHelperResponse> {
  const token: string = await generateBearerToken(
    configuration.platformApiTenantId,
    configuration.platformApiClientId,
    configuration.platformApiClientSecret,
    configuration.platformApiResource,
    true
  );

  const apiResponse = await getDataFromUrl(
    buildtransferPrescriptionUrl(configuration.platformApiUrl),
    prescription,
    'POST',
    {
      Authorization: `Bearer ${token}`,
      [ApiConstants.PLATFORM_API_HEADER_KEY]:
        configuration.platformPrescriptionApiHeaderKey,
    }
  );

  const prescriptionTransferResponse = await apiResponse.json();

  if (apiResponse.ok) {
    return { success: true, bundleId: prescriptionTransferResponse };
  }
  return { success: false, errorMessage: prescriptionTransferResponse };
}

export function buildtransferPrescriptionUrl(platformApi: string) {
  return `${platformApi}/prescription/route`;
}
