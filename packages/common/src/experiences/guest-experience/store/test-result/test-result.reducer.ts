// Copyright 2020 Prescryptive Health, Inc.

import { Reducer } from 'redux';
import { IAddress } from '../../../../utils/formatters/address.formatter';
import {
  TestResultActionKeysEnum,
  TestResultActionTypes,
} from './actions/test-result-actions';

export interface ITestResultState {
  readonly icd10?: string[];
  readonly date?: string;
  readonly time?: string;
  readonly memberFirstName?: string;
  readonly memberLastName?: string;
  readonly memberDateOfBirth?: string;
  readonly orderNumber?: string;
  readonly productOrServiceId?: string;
  readonly providerName?: string;
  readonly providerAddress?: IAddress;
  readonly colorMyRx?: string;
  readonly textColorMyRx?: string;
  readonly descriptionMyRx?: string;
  readonly valueMyRx?: string;
  readonly factSheetLinks?: string[];
  readonly serviceDescription?: string;
  readonly resultPdf?: string;
}

export const defaultTestResultState: ITestResultState = {};

export const testResultReducer: Reducer<
  ITestResultState,
  TestResultActionTypes
> = (
  state: ITestResultState = defaultTestResultState,
  action: TestResultActionTypes
): ITestResultState => {
  switch (action.type) {
    case TestResultActionKeysEnum.TEST_RESULT_RESPONSE: {
      const testResult = action.payload?.testResult;
      const resultPdf = action.payload?.testResultPdf;
      const date = testResult?.date;
      const time = testResult?.time;
      const memberFirstName = testResult?.memberFirstName;
      const memberLastName = testResult?.memberLastName;
      const memberDateOfBirth = testResult?.memberDateOfBirth;
      const orderNumber = testResult?.orderNumber;
      const productOrServiceId = testResult?.productOrService;
      const providerName = testResult?.providerName;
      const providerAddress = testResult?.providerAddress;
      const colorMyRx = testResult?.colorMyRx;
      const textColorMyRx = testResult?.textColorMyRx;
      const descriptionMyRx = testResult?.descriptionMyRx;
      const valueMyRx = testResult?.valueMyRx;
      const factSheetLinks = testResult?.factSheetLinks;
      const serviceDescription = testResult?.serviceDescription;
      const icd10 = testResult?.icd10;

      return {
        ...state,
        date,
        time,
        memberFirstName,
        memberLastName,
        memberDateOfBirth,
        orderNumber,
        productOrServiceId,
        providerName,
        providerAddress,
        colorMyRx,
        textColorMyRx,
        descriptionMyRx,
        valueMyRx,
        factSheetLinks,
        serviceDescription,
        icd10,
        resultPdf,
      };
    }
    default:
      return state;
  }
};
