// Copyright 2020 Prescryptive Health, Inc.

import {
  IAddress,
  formatAddress,
  formatAddressWithName,
  formatAddressWithoutStateZip,
  formatZipCode,
} from './address.formatter';

describe('formatAddress', () => {
  it('should return expected string', () => {
    const testAddress: IAddress = {
      address1: 'Suite 7370',
      address2: '170th Ave NE',
      city: 'Redmond',
      state: 'WA',
      zip: '98052',
    };

    const expectedAddress = 'Suite 7370 170th Ave NE, Redmond, WA 98052';

    expect(formatAddress(testAddress)).toEqual(expectedAddress);
  });

  it('should return expected string when optional field undefined', () => {
    const testAddress: IAddress = {
      address1: '7370 170th Ave NE',
      city: 'Redmond',
      state: 'WA',
      zip: '98052',
    };

    const expectedAddress = '7370 170th Ave NE, Redmond, WA 98052';

    expect(formatAddress(testAddress)).toEqual(expectedAddress);
  });
  it('should return expected string for when optional name field is passed in', () => {
    const testAddress: IAddress = {
      address1: '7370 170th Ave NE',
      city: 'Redmond',
      state: 'WA',
      zip: '98052',
      name: 'Name',
    };

    const expectedAddress = 'Name - Redmond, WA 98052';

    expect(formatAddressWithName(testAddress)).toEqual(expectedAddress);
  });
});

describe('formatAddressWithoutStateZip', () => {
  it('should return expected string', () => {
    const testAddress: IAddress = {
      address1: 'Suite 7370',
      address2: '170th Ave NE',
      city: 'Redmond',
      state: 'WA',
      zip: '98052',
    };

    const expectedAddress = 'Suite 7370 170th Ave NE, Redmond';

    expect(formatAddressWithoutStateZip(testAddress)).toEqual(expectedAddress);
  });

  it('should return expected string when optional field undefined', () => {
    const testAddress: IAddress = {
      address1: '7370 170th Ave NE',
      city: 'Redmond',
      state: 'WA',
      zip: '98052',
    };

    const expectedAddress = '7370 170th Ave NE, Redmond';

    expect(formatAddressWithoutStateZip(testAddress)).toEqual(expectedAddress);
  });

  it("should return a '-' when zip code is more than 5 characters, or same when 5 or less", () => {
    const zipCodeMock1 = '98052';
    const expectedZipCode1 = '98052';
    const zipCodeMock2 = '980520000';
    const expectedZipCode2 = '98052-0000';
    const zipCodeMock3 = 'abc!@#98052------';
    const expectedZipCode3 = '98052';
    const zipCodeMock4 = '98052 ';
    const expectedZipCode4 = '98052';
    const zipCodeMock5 = '98052-0000';
    const expectedZipCode5 = '98052-0000';

    expect(formatZipCode(zipCodeMock1)).toEqual(expectedZipCode1);
    expect(formatZipCode(zipCodeMock2)).toEqual(expectedZipCode2);
    expect(formatZipCode(zipCodeMock3)).toEqual(expectedZipCode3);
    expect(formatZipCode(zipCodeMock4)).toEqual(expectedZipCode4);
    expect(formatZipCode(zipCodeMock5)).toEqual(expectedZipCode5);
  });
});
