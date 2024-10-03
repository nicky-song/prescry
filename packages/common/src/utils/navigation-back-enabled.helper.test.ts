// Copyright 2022 Prescryptive Health, Inc.

import { Workflow } from '../models/workflow';
import { navigationBackEnabled } from './navigation-back-enabled.helper';

describe('navigationBackEnabled', () => {
  it.each([
    ['pbmActivate', true],
    ['prescriptionTransfer', true],
    ['startSaving', true],
    ['prescriptionInvite', false],
    ['unknownWorflow', true],
    ['register', false],
  ])(
    'when worflow is %p navigationBackEnabled should return %p',
    (workflowMock: string, expected: boolean) => {
      const result = navigationBackEnabled(workflowMock as Workflow);

      expect(result).toEqual(expected);
    }
  );
});
