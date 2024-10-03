// Copyright 2018 Prescryptive Health, Inc.

export interface IDefaultPolicyTemplates {
  GET: IRetryPolicy;
  PUT: IRetryPolicy;
  POST: IRetryPolicy;
  DELETE: IRetryPolicy;
}

export interface IRetryPolicy {
  remaining: number;
  pause: number;
  getNextRetry: (response: Response, policy: IRetryPolicy) => IRetryPolicy;
}

export const DefaultRetryPolicyTemplate: IRetryPolicy = {
  getNextRetry: (
    // tslint:disable-next-line:variable-name
    _response: Response,
    policy: IRetryPolicy
  ) => ({ ...policy }),
  pause: 0,
  remaining: 0,
};

export const DefaultPolicyTemplates: IDefaultPolicyTemplates = {
  DELETE: DefaultRetryPolicyTemplate,
  GET: DefaultRetryPolicyTemplate,
  POST: DefaultRetryPolicyTemplate,
  PUT: DefaultRetryPolicyTemplate,
};

export const getPolicy = (key: keyof IDefaultPolicyTemplates) => {
  return DefaultPolicyTemplates[key];
};
