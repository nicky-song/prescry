// Copyright 2022 Prescryptive Health, Inc.

import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';
import { gearsAccountsPath, IConfiguration } from '../../../configuration';
import { ApiConstants } from '../../../constants/api-constants';
import { ErrorConstants } from '../../../constants/response-messages';
import { IFhir } from '../../../models/fhir/fhir';
import { ResourceWrapper } from '../../../models/fhir/resource-wrapper';
import { defaultRetryPolicy } from '../../../utils/fetch-retry.helper';
import { getDataFromUrlWithAuth0 } from '../../../utils/get-data-from-url-with-auth0';
import { IGetPrescriptionsHelperResponse } from './get-prescriptions-endpoint.helper';

export const getBlockchainPrescriptionsEndpointHelper = async (
  masterId: string,
  configuration: IConfiguration
): Promise<IGetPrescriptionsHelperResponse> => {
  try {
    const apiResponse = await getDataFromUrlWithAuth0(
      'identity',
      configuration.auth0,
      buildGetBlockchainPrescriptionsUrl(
        configuration.platformGearsApiUrl,
        masterId
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
      const bundle: IFhir = await apiResponse.json();

      const resources: ResourceWrapper[] =
        bundle.entry && bundle.entry.length ? bundle.entry : [];

      const prescriptions: IFhir[] = [];

      for (const resource of resources) {
        const prescription: IFhir = resource.resource as IFhir;

        prescriptions.push(prescription);
      }

      return { prescriptions };
    }

    return { errorCode: apiResponse.status };
  } catch (error) {
    return {
      errorCode: HttpStatusCodes.INTERNAL_SERVER_ERROR,
      message: ErrorConstants.INTERNAL_SERVER_ERROR,
    };
  }
};

export function buildGetBlockchainPrescriptionsUrl(
  platformGearsApiUrl: string,
  masterId: string
) {
  return `${platformGearsApiUrl}${gearsAccountsPath}/${masterId}/digital-rx`;
}
