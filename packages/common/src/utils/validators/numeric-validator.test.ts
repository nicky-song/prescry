// Copyright 2019 Prescryptive Health, Inc.

import { NumericValidator } from './numeric-validator';

describe('NumericValidator', () => {
  it('validates whole numbers (positive integers and 0)', () => {
    expect(NumericValidator.isWholeNumber(undefined)).toEqual(false);
    expect(NumericValidator.isWholeNumber('')).toEqual(false);
    expect(NumericValidator.isWholeNumber('-1')).toEqual(false);
    expect(NumericValidator.isWholeNumber('0')).toEqual(true);
    expect(NumericValidator.isWholeNumber('1')).toEqual(true);
    expect(NumericValidator.isWholeNumber('10')).toEqual(true);
    expect(NumericValidator.isWholeNumber('11')).toEqual(true);
    expect(NumericValidator.isWholeNumber('0.5')).toEqual(false);
    expect(NumericValidator.isWholeNumber('1.5')).toEqual(false);
  });
});
