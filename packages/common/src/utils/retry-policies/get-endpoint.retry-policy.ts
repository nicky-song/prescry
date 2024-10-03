// Copyright 2018 Prescryptive Health, Inc.

import { IRetryPolicy } from './retry-policy.helper';

export const getEndpointRetryPolicy: IRetryPolicy = {
  getNextRetry: (response: Response, policy: IRetryPolicy) => {
    if (
      response instanceof Error ||
      response.status < 200 ||
      response.status > 499
    ) {
      return {
        ...policy,
        pause: policy.pause * 2,
        remaining: policy.remaining - 1,
      };
    }
    return { ...policy, pause: 0, remaining: 0 };
  },
  pause: 1000,
  remaining: 3,
};
