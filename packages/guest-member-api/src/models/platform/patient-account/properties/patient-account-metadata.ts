// Copyright 2022 Prescryptive Health, Inc.

import { IAdditionalProp } from './patient-account-additional-prop';

export interface IPatientAccountMetadata {
  [key: string]: IAdditionalProp[];
}
