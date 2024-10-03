// Copyright 2022 Prescryptive Health, Inc.

import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';
import { gearsPatientPath, IConfiguration } from '../../../configuration';
import { ApiConstants } from '../../../constants/api-constants';
import { ErrorConstants } from '../../../constants/response-messages';
import { EndpointError } from '../../../errors/endpoint.error';
import { BadRequestError } from '../../../errors/request-errors/bad.request-error';
import { IFhir } from '../../../models/fhir/fhir';
import { IPatient } from '../../../models/fhir/patient/patient';
import { IPatientErrorResponse } from '../../../models/identity/patient/patient-error-response';
import { defaultRetryPolicy } from '../../fetch-retry.helper';
import { findFhirPatientResources } from '../../fhir/fhir-resource.helper';
import { getDataFromUrlWithAuth0 } from '../../get-data-from-url-with-auth0';

export interface IPatientDetails {
  birthDate?: string;
  familyName?: string;
  firstName?: string;
  phoneNumber?: string;
}

export const getPatientByPatientDetails = async (
  { birthDate, familyName, firstName, phoneNumber }: IPatientDetails,
  configuration: IConfiguration
): Promise<IPatient[]> => {
  if (!(firstName && familyName && birthDate) && !phoneNumber) {
    throw new BadRequestError(ErrorConstants.BAD_REQUEST_PARAMS);
  }

  const patientPayload =
    firstName && familyName && birthDate
      ? { birthDate, familyName, firstName }
      : { phoneNumber };

  const apiResponse = await getDataFromUrlWithAuth0(
    'identity',
    configuration.auth0,
    buildGetPatientByPatientDetailsUrl(configuration.platformGearsApiUrl),
    patientPayload,
    'POST',
    {
      [ApiConstants.PLATFORM_API_HEADER_KEY]:
        configuration.gearsApiSubscriptionKey,
    },
    undefined,
    ApiConstants.DEFAULT_API_TIMEOUT,
    defaultRetryPolicy
  );

  if (apiResponse.ok) {
    const fhirResponse: IFhir = await apiResponse.json();

    const patients = findFhirPatientResources(fhirResponse);

    return patients;
  }

  if (apiResponse.status === HttpStatusCodes.BAD_REQUEST) {
    const errorResponse: IPatientErrorResponse = await apiResponse.json();
    throw new EndpointError(apiResponse.status, errorResponse.error);
  }

  throw new EndpointError(apiResponse.status, apiResponse.statusText);
};

const buildGetPatientByPatientDetailsUrl = (platformGearsApiUrl: string) => {
  return `${platformGearsApiUrl}${gearsPatientPath}/query?allTenants=true`;
};
