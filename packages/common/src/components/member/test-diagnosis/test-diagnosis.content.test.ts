// Copyright 2020 Prescryptive Health, Inc.

import { testDiagnosisContent } from './test-diagnosis.content';

describe('TestDiagnosisContent', () => {
  it('has expected content', () => {
    expect(testDiagnosisContent.testPerformedAt()).toEqual('at ');
  });
});
