// Copyright 2022 Prescryptive Health, Inc.

import { gearsAccountsPath, IConfiguration } from '../../../configuration';
import { ApiConstants } from '../../../constants/api-constants';
import { EndpointError } from '../../../errors/endpoint.error';
import {
  IPatientAccountStatus,
  IPatientAccountStatusErrorResponse,
} from '../../../models/platform/patient-account/properties/patient-account-status';
import { getDataFromUrlWithAuth0 } from '../../get-data-from-url-with-auth0';

export const updatePatientAccountStatus = async (
  configuration: IConfiguration,
  accountId: string,
  status: IPatientAccountStatus
) => {
  const apiResponse = await getDataFromUrlWithAuth0(
    'identity',
    configuration.auth0,
    buildStatusUpdateUrl(configuration.platformGearsApiUrl, accountId),
    status,
    'PATCH',
    {
      [ApiConstants.PLATFORM_API_HEADER_KEY]:
        configuration.gearsApiSubscriptionKey,
    },
    undefined,
    ApiConstants.DEFAULT_API_TIMEOUT,
    undefined
  );

  if (!apiResponse.ok) {
    const errorResponse: IPatientAccountStatusErrorResponse =
      await apiResponse.json();
    throw new EndpointError(
      apiResponse.status,
      errorResponse?.error || errorResponse?.title
    );
  }
};

const buildStatusUpdateUrl = (platformGearsApiUrl: string, accountId: string) =>
  `${platformGearsApiUrl}${gearsAccountsPath}/${accountId}/status`;
