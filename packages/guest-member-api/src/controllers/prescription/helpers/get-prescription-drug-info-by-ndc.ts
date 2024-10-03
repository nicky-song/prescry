// Copyright 2021 Prescryptive Health, Inc.

import { getDataFromUrl } from '../../../utils/get-data-from-url';
import { IConfiguration } from '../../../configuration';
import { ApiConstants } from '../../../constants/api-constants';
import { defaultRetryPolicy } from '../../../utils/fetch-retry.helper';

export interface IDrugInfoResponse {
  name?: string;
  genericName?: string;
  ndc?: string;
  formCode?: string;
  strength?: string;
  strengthUnit?: string;
  multiSourceCode?: string;
  brandNameCode?: string;
  packageTypeCode?: string;
  packageQuantity?: number;
  isGeneric?: boolean;
  success?: boolean;
  errorCode?: number;
  message?: string;
}

export async function getDrugInfoByNdc(
  ndc: string,
  configuration: IConfiguration
): Promise<IDrugInfoResponse> {
  const apiResponse = await getDataFromUrl(
    buildDrugInfoUrl(configuration.platformGearsApiUrl, ndc),
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
    const response: IDrugInfoResponse = await apiResponse.json();
    return { ...response, success: true };
  }

  const error: IDrugInfoResponse = await apiResponse.json();
  return {
    success: false,
    errorCode: error.errorCode,
    message: error.message,
  };
}

export function buildDrugInfoUrl(platformGearsApiUrl: string, ndc: string) {
  return `${platformGearsApiUrl}/dds/1.0/drugs/${ndc}`;
}
