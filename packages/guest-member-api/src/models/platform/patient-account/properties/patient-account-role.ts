// Copyright 2022 Prescryptive Health, Inc.

export interface IPatientAccountRole {
  type: string;
  resource: string;
  accountId: string;
  access: string;
  resourceIds: string[];
}
