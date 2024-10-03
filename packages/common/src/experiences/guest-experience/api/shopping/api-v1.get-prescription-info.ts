// Copyright 2021 Prescryptive Health, Inc.

import { IFailureResponse } from '../../../../models/api-response';
import { IPrescriptionInfoResponse } from '../../../../models/api-response/prescryption-info.response';
import { ErrorConstants } from '../../../../theming/constants';
import {
  buildCommonHeaders,
  buildUrl,
  call,
  IApiConfig,
} from '../../../../utils/api.helper';
import { IRetryPolicy } from '../../../../utils/retry-policies/retry-policy.helper';
import { APITypes, handleHttpErrors } from '../api-v1-helper';
import { ensureGetPrescriptionInfoResponse } from '../ensure-api-response/ensure-get-prescription-info-response';
import { withRefreshToken } from '../with-refresh-token';

export const getPrescriptionInfo = async (
  apiConfig: IApiConfig,
  prescriptionId: string,
  authToken?: string,
  deviceToken?: string,
  retryPolicy?: IRetryPolicy,
  blockchain?: boolean
): Promise<IPrescriptionInfoResponse> => {
  const additionalParams = '?blockchain=true';

  const url = buildUrl(
    apiConfig,
    'prescriptionInfo',
    {
      ':prescriptionId': prescriptionId,
    },
    blockchain ? additionalParams : undefined
  );

  const response: Response = await call(
    url,
    undefined,
    'GET',
    buildCommonHeaders(apiConfig, authToken, deviceToken),
    retryPolicy
  );
  const responseJson = await response.json();
  if (response.ok && ensureGetPrescriptionInfoResponse(responseJson)) {
    const infoResponse = responseJson as IPrescriptionInfoResponse;

    const pharmacy = infoResponse.data.pharmacy;
    if (pharmacy) {
      infoResponse.data.pharmacy = {
        ...pharmacy,
        address: {
          ...pharmacy.address,
          lineOne: pharmacy.address.lineOne.trim(),
          lineTwo: pharmacy.address.lineTwo?.trim(),
          city: pharmacy.address.city.trim(),
          state: pharmacy.address.state.trim(),
          zip: pharmacy.address.zip.trim(),
        },
        name: pharmacy.name.trim(),
        phoneNumber: pharmacy.phoneNumber?.trim(),
      };
    }

    const orderDate = infoResponse.data.orderDate;
    infoResponse.data.orderDate = deserializeDate(orderDate);

    return withRefreshToken<IPrescriptionInfoResponse>(infoResponse, response);
  }

  const errorResponse = responseJson as IFailureResponse;
  throw handleHttpErrors(
    response.status,
    ErrorConstants.errorForGettingPrescriptionInfo,
    APITypes.GET_PRESCRIPTION_INFO,
    errorResponse.code,
    errorResponse
  );
};

const deserializeDate = (isoDateString?: Date | string): Date | undefined =>
  isoDateString ? new Date(isoDateString) : undefined;
