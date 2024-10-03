// Copyright 2020 Prescryptive Health, Inc.

export interface ITestResultContent {
  diagnosisHeader: string;
  testDateHeader: string;
  providerLabel: string;
  scheduleATestlabel: string;
  allowPopUpsText: string;
}

export const testResultContent: ITestResultContent = {
  diagnosisHeader: 'Test result',
  testDateHeader: 'Test performed',
  providerLabel: 'Provider:',
  scheduleATestlabel: 'Schedule a test',
  allowPopUpsText: 'Please allow pop ups in browser settings',
};
