// Copyright 2018 Prescryptive Health, Inc.

import { validateMemberDateOfBirth } from './member-date-of-birth.validator';

describe('validateMemberDateOfBirth()', () => {
  it.each([
    ['January-01-000', false],
    ['January-32-2020', false],
    ['Test-01-2020', false],
    ['1981-12-21', false],
    ['fake-date', false],
    ['February-29-2001', false],
    ['June-31-2001', false],
    ['July-31-2000', true],
    ['February-29-2004', true],
    ['January-01-2000', true],
  ])('validates date (%p, %s)', (date: string, isDateValid: boolean) => {
    expect(validateMemberDateOfBirth(date)).toEqual(isDateValid);
  });
});
