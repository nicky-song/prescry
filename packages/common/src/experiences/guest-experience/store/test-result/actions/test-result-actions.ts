// Copyright 2020 Prescryptive Health, Inc.

import { ITestResultResponseData } from '../../../../../models/api-response/test-result-response';

export enum TestResultActionKeysEnum {
  TEST_RESULT_RESPONSE = 'TEST_RESULT_RESPONSE',
}

export interface IGetTestResultResponseAction {
  readonly type: TestResultActionKeysEnum.TEST_RESULT_RESPONSE;
  readonly payload: ITestResultResponseData | undefined;
}

export type TestResultActionTypes = IGetTestResultResponseAction;
