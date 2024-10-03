// Copyright 2021 Prescryptive Health, Inc.

import { IApiDataResponse } from '../api-response';

export interface IImmunizationRecord {
  orderNumber: string;
  manufacturer: string;
  lotNumber: string;
  doseNumber: number;
  locationName?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zip?: string;
  date?: string;
  time?: string;
  memberId: string;
  vaccineCode: string;
  serviceDescription?: string;
  memberFirstName?: string;
  memberLastName?: string;
  memberDateOfBirth?: string;
  factSheetLinks?: string[];
}

export interface IImmunizationRecordResponseData {
  immunizationResult: IImmunizationRecord[];
}

export type IImmunizationRecordResponse =
  IApiDataResponse<IImmunizationRecordResponseData>;
