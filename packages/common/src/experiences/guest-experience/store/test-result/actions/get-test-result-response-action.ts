// Copyright 2021 Prescryptive Health, Inc.

import { ITestResultResponseData } from '../../../../../models/api-response/test-result-response';
import {
  IGetTestResultResponseAction,
  TestResultActionKeysEnum,
} from './test-result-actions';

export const getTestResultResponseAction = (
  result?: ITestResultResponseData
): IGetTestResultResponseAction => ({
  payload: result,
  type: TestResultActionKeysEnum.TEST_RESULT_RESPONSE,
});
