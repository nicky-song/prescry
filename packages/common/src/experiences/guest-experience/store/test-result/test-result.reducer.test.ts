// Copyright 2020 Prescryptive Health, Inc.

import { ITestResultResponseData } from '../../../../models/api-response/test-result-response';
import { getTestResultResponseAction } from './actions/get-test-result-response-action';
import { ITestResultState, testResultReducer } from './test-result.reducer';

describe('TestResultReducer', () => {
  it('updates state for get test result response', () => {
    const result: ITestResultResponseData = {
      testResult: {
        icd10: ['U07.1'],
        fillDate: new Date(),
        memberId: 'member_1',
        orderNumber: '1234',
        time: 'appointment-time',
        date: 'appointment-date',
        memberFirstName: 'test-firstName',
        memberLastName: 'test-lastName',
        memberDateOfBirth: '2005-01-01',
        productOrService: 'test-service',
        serviceDescription: 'test',
        providerName: 'Test Name',
        providerAddress: {
          address1: '212 Main Ave',
          address2: 'Suite 1',
          city: 'Seattle',
          state: 'WA',
          zip: '23994',
        },
        colorMyRx: 'color',
        textColorMyRx: '#FFFFFF',
        descriptionMyRx: 'description',
        valueMyRx: 'value',
        factSheetLinks: ['link one', 'link two'],
      },
      testResultPdf: '',
    };

    const action = getTestResultResponseAction(result);
    const expectedState: ITestResultState = {
      date: result.testResult?.date,
      time: result.testResult?.time,
      memberFirstName: result.testResult?.memberFirstName,
      memberLastName: result.testResult?.memberLastName,
      memberDateOfBirth: result.testResult?.memberDateOfBirth,
      icd10: result.testResult?.icd10,
      orderNumber: result.testResult?.orderNumber,
      productOrServiceId: result.testResult?.productOrService,
      providerName: result.testResult?.providerName,
      providerAddress: result.testResult?.providerAddress,
      colorMyRx: result.testResult?.colorMyRx,
      textColorMyRx: result.testResult?.textColorMyRx,
      descriptionMyRx: result.testResult?.descriptionMyRx,
      valueMyRx: result.testResult?.valueMyRx,
      factSheetLinks: result.testResult?.factSheetLinks,
      serviceDescription: result.testResult?.serviceDescription,
      resultPdf: result.testResultPdf,
    };

    const initialState: ITestResultState = {};
    const updatedState = testResultReducer(initialState, action);
    expect(updatedState).toEqual(expectedState);
  });
});
