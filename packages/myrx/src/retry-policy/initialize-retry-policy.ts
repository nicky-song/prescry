// Copyright 2022 Prescryptive Health, Inc.

import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';
import { IApiConfig } from '@phx/common/src/utils/api.helper';
import {
  DefaultPolicyTemplates,
  IRetryPolicy,
} from '@phx/common/src/utils/retry-policies/retry-policy.helper';

export const initializeRetryPolicy = (guestExperienceApi: IApiConfig) => {
  const defaultRetryPolicy = guestExperienceApi.retryPolicy || {
    pause: 2000,
    remaining: 3,
  };

  const serviceUnavailableRetryPolicyTemplate: IRetryPolicy = {
    getNextRetry: (response: Response, policy: IRetryPolicy) => {
      if (
        response instanceof Error ||
        response.status === HttpStatusCodes.SERVICE_UNAVAILABLE
      ) {
        return {
          ...policy,
          pause: policy.pause * 2,
          remaining: policy.remaining - 1,
        };
      }
      return { ...policy, pause: 0, remaining: 0 };
    },
    pause: defaultRetryPolicy.pause,
    remaining: defaultRetryPolicy.remaining,
  };

  DefaultPolicyTemplates.GET = serviceUnavailableRetryPolicyTemplate;
  DefaultPolicyTemplates.POST = serviceUnavailableRetryPolicyTemplate;
  DefaultPolicyTemplates.PUT = serviceUnavailableRetryPolicyTemplate;
};
