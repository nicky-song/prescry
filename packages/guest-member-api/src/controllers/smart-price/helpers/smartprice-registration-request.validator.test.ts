// Copyright 2020 Prescryptive Health, Inc.

import { validateDateOfBirthForSmartPricePlan } from './smartprice-registration-request.validator';

describe('validateDateOfBirthForSmartPricePlan', () => {
  beforeEach(() => {
    jest.spyOn(Date.prototype, 'getFullYear').mockReturnValue(2021);
    jest.spyOn(Date.prototype, 'getMonth').mockReturnValue(12);
    jest.spyOn(Date.prototype, 'getDate').mockReturnValue(15);
  });
  it('should not accept invalid date', () => {
    expect(validateDateOfBirthForSmartPricePlan('dsafasd faewf')).toBeFalsy();
  });

  it('should accept older than 13 ', () => {
    expect(
      validateDateOfBirthForSmartPricePlan('2007-12-12T00:00:00.000Z')
    ).toBeTruthy();
  });

  it('should fail if too young ', () => {
    expect(
      validateDateOfBirthForSmartPricePlan('2010-12-12T00:00:00.000Z')
    ).toBeFalsy();
  });
});
