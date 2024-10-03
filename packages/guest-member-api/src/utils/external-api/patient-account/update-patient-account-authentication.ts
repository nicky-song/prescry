// Copyright 2022 Prescryptive Health, Inc.

import { assertHasAccountId } from '../../../assertions/assert-has-account-id';
import { IConfiguration, gearsAccountsPath } from '../../../configuration';
import { ApiConstants } from '../../../constants/api-constants';
import { EndpointError } from '../../../errors/endpoint.error';
import {
  IPatientAccount,
  IPatientAccountErrorResponse,
} from '../../../models/platform/patient-account/patient-account';
import { IPatientAccountAuthentication } from '../../../models/platform/patient-account/properties/patient-account-authentication';
import { defaultRetryPolicy } from '../../fetch-retry.helper';
import { getDataFromUrlWithAuth0 } from '../../get-data-from-url-with-auth0';

export const updatePatientAccountAuthentication = async (
  configuration: IConfiguration,
  authentication: IPatientAccountAuthentication,
  patientAccount: IPatientAccount
): Promise<IPatientAccount> => {
  const patientAccountId = patientAccount.accountId;
  assertHasAccountId(patientAccountId);

  const apiResponse = await getDataFromUrlWithAuth0(
    'identity',
    configuration.auth0,
    buildUpdatePatientAccountAuthenticationUrl(
      configuration.platformGearsApiUrl,
      patientAccountId
    ),
    authentication,
    'PATCH',
    {
      [ApiConstants.PLATFORM_API_HEADER_KEY]:
        configuration.gearsApiSubscriptionKey,
    },
    undefined,
    ApiConstants.DEFAULT_API_TIMEOUT,
    defaultRetryPolicy
  );
  if (apiResponse.ok) {
    const patientAccount = (await apiResponse.json()) as IPatientAccount;
    return patientAccount;
  }

  const errorResponse: IPatientAccountErrorResponse = await apiResponse.json();
  throw new EndpointError(
    apiResponse.status,
    errorResponse?.error || errorResponse?.title
  );
};

const buildUpdatePatientAccountAuthenticationUrl = (
  platformGearsApiUrl: string,
  patientAccountId: string
) => {
  return `${platformGearsApiUrl}${gearsAccountsPath}/${patientAccountId}/authentication`;
};
