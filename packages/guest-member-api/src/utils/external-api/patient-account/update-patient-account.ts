// Copyright 2022 Prescryptive Health, Inc.

import { assertHasAccountId } from '../../../assertions/assert-has-account-id';
import { gearsAccountsPath, IConfiguration } from '../../../configuration';
import { ApiConstants } from '../../../constants/api-constants';
import { EndpointError } from '../../../errors/endpoint.error';
import {
  IPatientAccount,
  IPatientAccountErrorResponse,
} from '../../../models/platform/patient-account/patient-account';
import { defaultRetryPolicy } from '../../fetch-retry.helper';
import { getDataFromUrlWithAuth0 } from '../../get-data-from-url-with-auth0';

export const updatePatientAccount = async (
  configuration: IConfiguration,
  patientAccount: IPatientAccount
): Promise<void> => {
  const { accountId } = patientAccount;
  assertHasAccountId(accountId);

  const apiResponse = await getDataFromUrlWithAuth0(
    'identity',
    configuration.auth0,
    buildUpdatePatientAccountUrl(configuration.platformGearsApiUrl, accountId),
    patientAccount,
    'PUT',
    {
      [ApiConstants.PLATFORM_API_HEADER_KEY]:
        configuration.gearsApiSubscriptionKey,
    },
    undefined,
    ApiConstants.DEFAULT_API_TIMEOUT,
    defaultRetryPolicy
  );

  if (!apiResponse.ok) {
    const errorResponse: IPatientAccountErrorResponse =
      await apiResponse.json();
    throw new EndpointError(
      apiResponse.status,
      errorResponse?.error || errorResponse?.title
    );
  }
};

const buildUpdatePatientAccountUrl = (
  platformGearsApiUrl: string,
  patientAccountId: string
) => `${platformGearsApiUrl}${gearsAccountsPath}/${patientAccountId}`;
