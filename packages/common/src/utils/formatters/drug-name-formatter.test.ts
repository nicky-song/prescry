// Copyright 2019 Prescryptive Health, Inc.

import { DrugNameFormatter } from './drug-name-formatter';

describe('DrugNameFormatter', () => {
  it('formats names', () => {
    expect(DrugNameFormatter.formatNames(undefined, undefined)).toEqual('');
    expect(DrugNameFormatter.formatNames('name', undefined)).toEqual('name');
    expect(DrugNameFormatter.formatNames(undefined, 'generic')).toEqual(
      'generic'
    );
    expect(DrugNameFormatter.formatNames('name', 'generic')).toEqual(
      'name (generic)'
    );
  });
});
