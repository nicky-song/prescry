// Copyright 2021 Prescryptive Health, Inc.

import { ITestResult } from '../../../../../models/api-response/test-result-response';
import { testResultPdfMock } from '../../../__mocks__/test-result-pdf.mock';
import { getTestResultResponseAction } from './get-test-result-response-action';

describe('getTestResultResponse', () => {
  it('returns action', () => {
    const result: ITestResult = {
      icd10: ['U07.1'],
      fillDate: new Date(),
      memberId: 'member_1',
      orderNumber: '1234',
      time: 'appointment-time',
      date: 'appointment-date',
      productOrService: 'test-service',
      serviceDescription: 'test',
    };

    const action = getTestResultResponseAction({
      testResult: result,
      testResultPdf: testResultPdfMock,
    });
    expect(action.type).toEqual('TEST_RESULT_RESPONSE');
    expect(action.payload).toEqual({
      testResult: result,
      testResultPdf: testResultPdfMock,
    });
  });
});
