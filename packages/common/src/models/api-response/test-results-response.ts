// Copyright 2020 Prescryptive Health, Inc.

import { IApiDataResponse } from '../api-response';
import { ITestResult } from './test-result-response';

export interface ITestResultsResponseData {
  testResults: ITestResult[];
}

export type ITestResultsResponse = IApiDataResponse<ITestResultsResponseData>;
