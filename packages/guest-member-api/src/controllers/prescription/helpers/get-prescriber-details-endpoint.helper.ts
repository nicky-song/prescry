// Copyright 2022 Prescryptive Health, Inc.

import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';
import { IPractitioner } from '@phx/common/src/models/practitioner';
import { IConfiguration } from '../../../configuration';
import { ApiConstants } from '../../../constants/api-constants';
import { ErrorConstants } from '../../../constants/response-messages';
import { IMedicationRequest } from '../../../models/fhir/medication-request/medication-request';
import { IPrescriberDetailsResponse } from '../../../models/prescriber-details-response';
import { defaultRetryPolicy } from '../../../utils/fetch-retry.helper';
import { getDataFromUrl } from '../../../utils/get-data-from-url';

export interface IPractitionerDetailsResponse {
  practitioner?: IPractitioner;
  isSuccess: boolean;
  responseCode?: number;
  responseMessage?: string;
}

export const getPrescriberDetailsEndpointHelper = async (
  medicationRequest: IMedicationRequest,
  configuration: IConfiguration
): Promise<IPractitionerDetailsResponse> => {
  try {
    const npi = medicationRequest?.requester?.reference;

    if (npi) {
      const apiResponse = await getDataFromUrl(
        buildGetPrescriberDetailsUrl(configuration.platformGearsApiUrl, npi),
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
        const prescriberDetails: IPrescriberDetailsResponse =
          await apiResponse.json();

        if (prescriberDetails.results.length) {
          const practitioner = {} as IPractitioner;

          const firstName =
            prescriberDetails?.results[0]?.basic?.firstName ?? '';
          const lastName = prescriberDetails?.results[0]?.basic?.lastName ?? '';

          practitioner.id =
            prescriberDetails?.results[0]?.number.toString() ?? '';
          practitioner.name = `${firstName} ${lastName}`;
          practitioner.phoneNumber =
            prescriberDetails?.results[0]?.addresses[0]?.telephoneNumber ?? '';

          return { practitioner, isSuccess: true };
        }
      }

      return {
        isSuccess: false,
        responseCode: apiResponse.status,
        responseMessage: ErrorConstants.PRESCRIBER_DETAILS_NOT_FOUND,
      };
    }

    return {
      isSuccess: false,
      responseCode: HttpStatusCodes.BAD_REQUEST,
      responseMessage: ErrorConstants.PRESCRIBER_NPI_MISSING,
    };
  } catch (error) {
    return {
      isSuccess: false,
      responseCode: HttpStatusCodes.INTERNAL_SERVER_ERROR,
      responseMessage: ErrorConstants.INTERNAL_SERVER_ERROR,
    };
  }
};

export function buildGetPrescriberDetailsUrl(
  platformGearsApiUrl: string,
  npi: string
) {
  return `${platformGearsApiUrl}/dds/api?version=2.1&number=${npi}&useFirstNameAlias=False&limit=10&skip=0&pretty=false`;
}
