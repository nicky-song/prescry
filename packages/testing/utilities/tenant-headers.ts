// Copyright 2023 Prescryptive Health, Inc.

const tenantHeaderKey = 'x-tenant-id';

export const TenantHeaders = {
  confluence: { [tenantHeaderKey]: 'TINBBG9B' },
  redirect: { [tenantHeaderKey]: 'TINBBF10' },
};

export type TenantType = 'confluence' | 'redirect';
