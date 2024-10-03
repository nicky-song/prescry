// Copyright 2021 Prescryptive Health, Inc.

import { IDrugInformationItem } from '../../../models/api-response/drug-information-response';
import { buildUrl, call, IApiConfig } from '../../../utils/api.helper';
import { getEndpointRetryPolicy } from '../../../utils/retry-policies/get-endpoint.retry-policy';
import { ensureGetDrugInformationResponse } from './ensure-api-response/ensure-get-drug-information-response';
export const getDrugInformation = async (
  config: IApiConfig,
  ndc?: string
): Promise<IDrugInformationItem | undefined> => {
  if (!ndc) return undefined;
  const url = buildUrl(config, 'learnMore', {
    ':id': ndc,
  });
  const response = await call(
    url,
    undefined,
    'GET',
    undefined,
    getEndpointRetryPolicy
  );
  const responseJson = await response.json();
  if (response.ok && ensureGetDrugInformationResponse(responseJson)) {
    return responseJson;
  }
  return undefined;
};
