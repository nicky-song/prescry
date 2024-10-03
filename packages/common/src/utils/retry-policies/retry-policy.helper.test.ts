// Copyright 2018 Prescryptive Health, Inc.

import {
  DefaultPolicyTemplates,
  DefaultRetryPolicyTemplate,
  getPolicy,
  IRetryPolicy,
} from './retry-policy.helper';

describe('DefaultRetryPolicyTemplate', () => {
  it('should have default pause and remaining count as 0', () => {
    expect(DefaultRetryPolicyTemplate.pause).toBe(0);
    expect(DefaultRetryPolicyTemplate.remaining).toBe(0);
  });

  it('getNextRetry should return the policy', () => {
    const mockPolicy = { pause: 1000, remaining: 2 } as IRetryPolicy;
    const mockResponse = {} as Response;
    expect(
      DefaultRetryPolicyTemplate.getNextRetry(mockResponse, mockPolicy)
    ).toEqual(mockPolicy);
  });
});

describe('DefaultPolicyTemplates', () => {
  it('DefaultRetryPolicyTemplate should be the default policy template', () => {
    expect(DefaultPolicyTemplates.DELETE).toBe(DefaultRetryPolicyTemplate);
    expect(DefaultPolicyTemplates.GET).toBe(DefaultRetryPolicyTemplate);
    expect(DefaultPolicyTemplates.POST).toBe(DefaultRetryPolicyTemplate);
    expect(DefaultPolicyTemplates.PUT).toBe(DefaultRetryPolicyTemplate);
  });
});

describe('getPolicy', () => {
  it('should return retry policy template based on the key', () => {
    expect(getPolicy('GET')).toBe(DefaultPolicyTemplates.GET);
  });
});
