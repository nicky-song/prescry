// Copyright 2019 Prescryptive Health, Inc.

import { DrugCodesFormatter } from './drug-codes-formatter';

describe('DrugCodesFormatter', () => {
  it('formats codes', () => {
    expect(DrugCodesFormatter.formatCodes('', '')).toEqual('?/?');
    expect(DrugCodesFormatter.formatCodes('M', '')).toEqual('M/?');
    expect(DrugCodesFormatter.formatCodes('', 'B')).toEqual('?/B');
    expect(DrugCodesFormatter.formatCodes('M', 'B')).toEqual('M/B');
  });
});
