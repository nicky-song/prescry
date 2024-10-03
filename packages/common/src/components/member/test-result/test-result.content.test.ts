// Copyright 2020 Prescryptive Health, Inc.

import { ITestResultContent, testResultContent } from './test-result.content';

describe('testResultContent', () => {
  it('has expected content', () => {
    const expectedContent: ITestResultContent = {
      diagnosisHeader: 'Test result',
      testDateHeader: 'Test performed',
      providerLabel: 'Provider:',
      scheduleATestlabel: 'Schedule a test',
      allowPopUpsText: 'Please allow pop ups in browser settings',
    };

    expect(testResultContent).toEqual(expectedContent);
  });
});
