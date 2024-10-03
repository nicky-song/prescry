// Copyright 2020 Prescryptive Health, Inc.

import { AddressFieldName } from '../../../../models/address-fields';
import { fieldValidator } from './field-validator';

describe('fieldValidator', () => {
  it('returns false when value is undefined or blank', () => {
    expect(fieldValidator(AddressFieldName.STREET_NAME, '')).toBe(false);
  });

  it('validates street adress ', () => {
    expect(fieldValidator(AddressFieldName.STREET_NAME, '900')).toBe(false);
    expect(fieldValidator(AddressFieldName.STREET_NAME, '900 East Grand')).toBe(
      true
    );
    expect(fieldValidator(AddressFieldName.STREET_NAME, '')).toBe(false);
    expect(fieldValidator(AddressFieldName.STREET_NAME, 'hello world @')).toBe(
      false
    );
  });

  it('validates city and county ', () => {
    expect(fieldValidator(AddressFieldName.CITY, '')).toBe(false);
    expect(fieldValidator(AddressFieldName.CITY, 'Renton')).toBe(true);
    expect(fieldValidator(AddressFieldName.CITY, 'Mercer Island')).toBe(true);

    expect(fieldValidator(AddressFieldName.COUNTY, '')).toBe(false);
    expect(fieldValidator(AddressFieldName.COUNTY, 'King')).toBe(true);
    expect(fieldValidator(AddressFieldName.COUNTY, 'New Orange')).toBe(true);
  });

  it('validates zip code', () => {
    expect(fieldValidator(AddressFieldName.ZIP, '')).toBe(false);
    expect(fieldValidator(AddressFieldName.ZIP, '98055')).toBe(true);
    expect(fieldValidator(AddressFieldName.ZIP, '980551')).toBe(false);
    expect(fieldValidator(AddressFieldName.ZIP, 'abcdef')).toBe(false);
    expect(fieldValidator(AddressFieldName.ZIP, '98055-1234')).toBe(true);
    expect(fieldValidator(AddressFieldName.ZIP, '98055-33333')).toBe(false);
  });
});
