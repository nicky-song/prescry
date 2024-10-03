// Copyright 2023 Prescryptive Health, Inc.

import { ISendEventRequestBody } from '../../../models/api-request-body/send-event.request-body';
import {
  buildCommonHeaders,
  buildUrl,
  call,
  IApiConfig,
} from '../../../utils/api.helper';
import { IRetryPolicy } from '../../../utils/retry-policies/retry-policy.helper';

export const sendErrorEvent = async (
  config: IApiConfig,
  sendEventRequestBody: ISendEventRequestBody,
  deviceToken?: string,
  authToken?: string,
  retryPolicy?: IRetryPolicy
): Promise<void> => {
  const url = buildUrl(config, 'eventErrors', {});
  await call(
    url,
    sendEventRequestBody,
    'POST',
    buildCommonHeaders(config, authToken, deviceToken),
    retryPolicy
  );
};
