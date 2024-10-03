// Copyright 2020 Prescryptive Health, Inc.

import { IApiDataResponse } from '../api-response';

export interface IPastProcedure {
  memberFirstName?: string;
  memberLastName?: string;
  orderNumber: string;
  date?: string;
  time?: string;
  serviceDescription?: string;
  serviceType?: string;
  procedureType: string;
}
export interface IPastProcedureResponseData {
  pastProcedures: IPastProcedure[];
}

export type IPastProcedureResponse =
  IApiDataResponse<IPastProcedureResponseData>;
