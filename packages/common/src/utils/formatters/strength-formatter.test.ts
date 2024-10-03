// Copyright 2019 Prescryptive Health, Inc.

import { StrengthFormatter } from './strength-formatter';

describe('StrengthFormatter', () => {
  it('formats strength', () => {
    expect(StrengthFormatter.format(undefined)).toEqual('');
    expect(StrengthFormatter.format({ unit: '', value: '' })).toEqual('');
    expect(StrengthFormatter.format({ unit: '', value: '1' })).toEqual('1');
    expect(StrengthFormatter.format({ unit: 'MG', value: '1' })).toEqual('1mg');
    expect(
      StrengthFormatter.format({ unit: 'MG/0.5ML', value: '0.75' })
    ).toEqual('0.75mg/0.5ml');
    expect(
      StrengthFormatter.format({ unit: 'MBQ/ML', value: '500-1900' })
    ).toEqual('500-1900mbq/ml');
  });
});
