// Copyright 2021 Prescryptive Health, Inc.

import { AddressFieldName } from '../../models/address-fields';
import { IMemberAddress } from '../../models/api-request-body/create-booking.request-body';
import AddressValidator, { validateMaxCharacters } from './address.validator';

const longStringMock = `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`;

describe('AddressValidator', () => {
  it.each([
    [false, undefined],
    [
      false,
      {
        county: 'county',
        city: 'city',
        state: 'state',
        zip: '11111',
      } as IMemberAddress,
    ],
    [
      false,
      {
        address1: 'addr1',
        city: 'city',
        state: 'state',
        zip: '11111',
      } as IMemberAddress,
    ],
    [
      false,
      {
        address1: 'addr1',
        county: 'county',
        state: 'state',
        zip: '11111',
      } as IMemberAddress,
    ],
    [
      false,
      {
        address1: 'addr1',
        county: 'county',
        city: 'city',
        zip: '11111',
      } as IMemberAddress,
    ],
    [
      false,
      {
        address1: 'addr1',
        county: 'county',
        city: 'city',
        state: 'state',
      } as IMemberAddress,
    ],
    [
      false,
      {
        address1: '       ',
        county: 'county',
        city: 'city',
        state: 'state',
        zip: '11111',
      } as IMemberAddress,
    ],
    [
      false,
      {
        address1: 'addr1',
        county: '  ',
        city: 'city',
        state: 'state',
        zip: '11111',
      } as IMemberAddress,
    ],
    [
      false,
      {
        address1: 'addr1',
        county: 'county',
        city: '   ',
        state: 'state',
        zip: '11111',
      } as IMemberAddress,
    ],
    [
      false,
      {
        address1: 'addr1',
        county: 'county',
        city: 'city',
        state: '',
        zip: '11111',
      } as IMemberAddress,
    ],
    [
      false,
      {
        address1: 'addr1',
        county: 'county',
        city: 'city',
        state: 'state',
        zip: '  111',
      } as IMemberAddress,
    ],
    [
      true,
      {
        address1: 'addr1',
        county: 'county',
        city: 'city',
        state: 'state',
        zip: '11111',
      } as IMemberAddress,
    ],
  ])(
    `validates address (%p)`,
    (isValid: boolean, address: IMemberAddress | undefined) => {
      expect(AddressValidator.isAddressValid(address)).toEqual(isValid);
    }
  );

  it.each([
    [false, undefined],
    [
      false,
      {
        city: 'city',
        state: 'state',
        zip: '11111',
      } as IMemberAddress,
    ],
    [
      true,
      {
        address1: 'addr1',
        city: 'city',
        state: 'state',
        zip: '11111',
        county: 'test',
      } as IMemberAddress,
    ],
    [
      true,
      {
        address1: 'addr1',
        city: 'city',
        state: 'state',
        zip: '11111',
      } as IMemberAddress,
    ],
  ])(
    `validates address without county in full address(%p)`,
    (isValid: boolean, address: IMemberAddress | undefined) => {
      expect(AddressValidator.isAddressWithoutCountyValid(address)).toEqual(
        isValid
      );
    }
  );

  it.each([
    [false, undefined],
    [false, ''],
    [false, ' t'],
    [true, 'city'],
  ])(
    `validates city or county (%p)`,
    (isValid: boolean, value: string | undefined) => {
      expect(AddressValidator.isCityCountyValid(value)).toEqual(isValid);
    }
  );

  it.each([
    [true, undefined],
    [true, ''],
    [false, '  '],
    [false, 'ttttt'],
    [false, '&%))'],
    [true, '112'],
    [true, '11111'],
  ])(
    `validates incomplete zip code (%p)`,
    (isValid: boolean, value: string | undefined) => {
      expect(AddressValidator.isZipAllDigits(value)).toEqual(isValid);
    }
  );

  it.each([
    [false, undefined],
    [false, ''],
    [false, '  '],
    [false, 'ttttt'],
    [true, '11111'],
    [true, '11111-2222'],
    [false, '11111-222'],
    [false, '11111-22222'],
  ])(
    `validates zip code (%p)`,
    (isValid: boolean, value: string | undefined) => {
      expect(AddressValidator.isZipValid(value)).toEqual(isValid);
    }
  );

  it.each([
    [false, undefined],
    [false, ''],
    [true, 'wa'],
  ])(`validates state (%p)`, (isValid: boolean, value: string | undefined) => {
    expect(AddressValidator.isStateValid(value)).toEqual(isValid);
  });

  it.each([
    ['valid-city-mock', 'valid-city-mock', AddressFieldName.CITY, true],
    ['not-valid-city-mock', longStringMock, AddressFieldName.CITY, false],
    ['valid-county-mock', 'valid-county-mock', AddressFieldName.COUNTY, true],
    ['valid-state-mock', 'valid-state-mock', AddressFieldName.STATE, true],
    [
      'valid-street-name-mock',
      'valid-street-name-mock',
      AddressFieldName.STREET_NAME,
      true,
    ],
    [
      'not-valid-street-name-mock',
      longStringMock,
      AddressFieldName.STREET_NAME,
      false,
    ],
    ['valid-zip-mock', 'valid-zip-mock', AddressFieldName.ZIP, true],
  ])(
    `validates (%p)`,
    (
      _: string,
      valueMock: string,
      fieldNameMock: AddressFieldName,
      isValid: boolean
    ) => {
      expect(validateMaxCharacters(valueMock, fieldNameMock)).toEqual(isValid);
    }
  );
});
