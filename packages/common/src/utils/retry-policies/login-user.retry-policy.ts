// Copyright 2020 Prescryptive Health, Inc.

import { IRetryPolicy } from './retry-policy.helper';
import { HttpStatusCodes } from '../../errors/error-codes';

export const loginMemberRetryPolicy: IRetryPolicy = {
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
  pause: 2000,
  remaining: 3,
};
