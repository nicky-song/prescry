// Copyright 2020 Prescryptive Health, Inc.

import { IAddress } from '../../utils/formatters/address.formatter';
import { IApiDataResponse } from '../api-response';

export interface ITestResult {
  fillDate: Date;
  icd10: string[];
  memberId: string;
  memberFirstName?: string;
  memberLastName?: string;
  memberDateOfBirth?: string;
  orderNumber: string;
  date?: string;
  time?: string;
  productOrService: string;
  serviceDescription?: string;
  providerName?: string;
  providerAddress?: IAddress;
  colorMyRx?: string;
  textColorMyRx?: string;
  valueMyRx?: string;
  descriptionMyRx?: string;
  factSheetLinks?: string[];
  providerPhoneNumber?: string;
  providerCliaNumber?: string;
  manufacturer?: string;
  testType?: string;
  administrationMethod?: string;
}
export interface ITestResultResponseData {
  testResult?: ITestResult;
  testResultPdf?: string;
}

export type ITestResultResponse = IApiDataResponse<ITestResultResponseData>;
