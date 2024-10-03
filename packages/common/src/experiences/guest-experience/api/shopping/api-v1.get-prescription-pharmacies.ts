// Copyright 2021 Prescryptive Health, Inc.

import { IFailureResponse } from '../../../../models/api-response';
import { IPharmacyPriceSearchResponse } from '../../../../models/api-response/pharmacy-price-search.response';
import { ILocationCoordinates } from '../../../../models/location-coordinates';
import { ErrorConstants } from '../../../../theming/constants';
import {
  buildCommonHeaders,
  buildUrl,
  call,
  IApiConfig,
} from '../../../../utils/api.helper';
import { IRetryPolicy } from '../../../../utils/retry-policies/retry-policy.helper';
import { APITypes, handleHttpErrors } from '../api-v1-helper';
import { ensureGetPrescriptionPharmaciesResponse } from '../ensure-api-response/ensure-get-prescription-pharmacies-response';
import { withRefreshToken } from '../with-refresh-token';

export const getPrescriptionPharmacies = async (
  apiConfig: IApiConfig,
  location: ILocationCoordinates,
  sortBy: string,
  prescriptionId: string,
  distance: number,
  authToken?: string,
  deviceToken?: string,
  retryPolicy?: IRetryPolicy,
  blockchain?: boolean
): Promise<IPharmacyPriceSearchResponse> => {
  const blockchainParams = '&blockchain=true';

  const url = buildUrl(
    apiConfig,
    'prescriptionPharmacies',
    {
      ':zipCode': location.zipCode ?? '',
      ':latitude': location.latitude ? location.latitude.toString() : '',
      ':longitude': location.longitude ? location.longitude.toString() : '',
      ':sortby': sortBy,
      ':prescriptionId': prescriptionId,
      ':distance': distance.toString(),
    },
    blockchain ? blockchainParams : undefined
  );

  const response: Response = await call(
    url,
    undefined,
    'GET',
    buildCommonHeaders(apiConfig, authToken, deviceToken),
    retryPolicy
  );
  const responseJson = await response.json();
  if (response.ok && ensureGetPrescriptionPharmaciesResponse(responseJson)) {
    const searchResponse = responseJson as IPharmacyPriceSearchResponse;

    return withRefreshToken<IPharmacyPriceSearchResponse>(
      searchResponse,
      response
    );
  }

  const errorResponse = responseJson as IFailureResponse;
  throw handleHttpErrors(
    response.status,
    ErrorConstants.errorForGettingPrescriptionPharmacies,
    APITypes.GET_PRESCRIPTION_PHARMACIES,
    errorResponse.code,
    errorResponse
  );
};
