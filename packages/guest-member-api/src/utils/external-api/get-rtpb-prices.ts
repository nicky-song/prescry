// Copyright 2022 Prescryptive Health, Inc.

import { ApiConstants } from '../../constants/api-constants';
import { IConfiguration } from '../../configuration';
import { defaultRetryPolicy } from '../fetch-retry.helper';
import { RTPBRequest, RTPBResponse } from '../../models/rtpb/rtpb';
import path from 'path';
import { getDataFromUrlWithAuth0 } from '../get-data-from-url-with-auth0';

export interface IRTPBResponse {
  rtpb?: RTPBResponse;
  errorCode?: number;
  message?: string;
}

export const getRTPBPrices = async (
  rtpbRequest: RTPBRequest,
  configuration: IConfiguration
): Promise<IRTPBResponse> => {
  const apiResponse = await getDataFromUrlWithAuth0(
    'identity',
    configuration.auth0,
    buildRTPBUrl(configuration.platformGearsApiUrl),
    { message: { rtpbBody: { RTPBRequest: rtpbRequest } } },
    'POST',
    {
      [ApiConstants.PLATFORM_API_HEADER_KEY]:
        configuration.gearsApiSubscriptionKey,
    },
    undefined,
    undefined,
    defaultRetryPolicy
  );

  const rtpbResponseText = await apiResponse?.text?.();

  const rtpbResponse = rtpbResponseText ? JSON.parse(rtpbResponseText) : {};

  if (apiResponse.ok) {
    const rtpb = rtpbResponse;

    return { rtpb };
  }
  const error: string = await apiResponse.json();
  return { errorCode: apiResponse.status, message: error };
};

export const buildRTPBUrl = (platformGearsApiUrl: string) => {
  return path.normalize(`${platformGearsApiUrl}/rtpb/1.0/pricing`);
};
