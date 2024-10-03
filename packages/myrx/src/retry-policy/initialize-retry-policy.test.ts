// Copyright 2022 Prescryptive Health, Inc.

import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';
import { GuestExperienceConfig } from '@phx/common/src/experiences/guest-experience/guest-experience-config';
import {
  DefaultPolicyTemplates,
  IRetryPolicy,
} from '@phx/common/src/utils/retry-policies/retry-policy.helper';
import { initializeRetryPolicy } from './initialize-retry-policy';

const mockResponse = {
  status: HttpStatusCodes.NOT_FOUND,
} as Response;
const mockPolicy = { pause: 2000, remaining: 2 } as IRetryPolicy;

describe('initializeRetryPolicy', () => {
  it.each([['GET'], ['POST'], ['PUT']])(
    'returns pause and remaining count as 0 if HttpStatusCodes is other than SERVICE_UNAVAILABLE for %p',
    (method: string) => {
      initializeRetryPolicy(GuestExperienceConfig.apis.guestExperienceApi);

      const methodMap = new Map([
        ['GET', DefaultPolicyTemplates.GET],
        ['POST', DefaultPolicyTemplates.POST],
        ['PUT', DefaultPolicyTemplates.PUT],
      ]);

      const responsePolicy = methodMap
        .get(method)
        ?.getNextRetry(mockResponse, mockPolicy);

      expect(responsePolicy?.pause).toBe(0);
      expect(responsePolicy?.remaining).toBe(0);
    }
  );

  it.each([['GET'], ['POST'], ['PUT']])(
    'returns policy with double pause time and decrease remaining counter by 1 if HttpStatusCodes is SERVICE_UNAVAILABLE for %p',
    (method: string) => {
      initializeRetryPolicy(GuestExperienceConfig.apis.guestExperienceApi);

      const methodMap = new Map([
        ['GET', DefaultPolicyTemplates.GET],
        ['POST', DefaultPolicyTemplates.POST],
        ['PUT', DefaultPolicyTemplates.PUT],
      ]);

      const responseServiceUnavailable = {
        status: HttpStatusCodes.SERVICE_UNAVAILABLE,
      } as Response;
      const responsePolicy = methodMap
        .get(method)
        ?.getNextRetry(responseServiceUnavailable, mockPolicy);

      expect(responsePolicy?.pause).toBe(mockPolicy.pause * 2);
      expect(responsePolicy?.remaining).toBe(mockPolicy.remaining - 1);
    }
  );

  it.each([['GET'], ['POST'], ['PUT']])(
    'returns policy with double pause time and decrease remaining counter by 1 if api response is error for %p',
    (method: string) => {
      initializeRetryPolicy(GuestExperienceConfig.apis.guestExperienceApi);

      const methodMap = new Map([
        ['GET', DefaultPolicyTemplates.GET],
        ['POST', DefaultPolicyTemplates.POST],
        ['PUT', DefaultPolicyTemplates.PUT],
      ]);

      const error = new Error('TypeError: Failed to fetch');

      const responsePolicy = methodMap
        .get(method)
        ?.getNextRetry(error as unknown as Response, mockPolicy);

      expect(responsePolicy?.pause).toBe(mockPolicy.pause * 2);
      expect(responsePolicy?.remaining).toBe(mockPolicy.remaining - 1);
    }
  );
});
