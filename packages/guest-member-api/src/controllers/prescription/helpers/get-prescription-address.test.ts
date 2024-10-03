// Copyright 2022 Prescryptive Health, Inc.

import {
  mockAddressCurrent,
  mockAddressExpired,
  mockAddressNoPeriod,
  testAddressCurrent,
  testAddressCurrentAndExpired,
  testAddressNoPeriod,
} from '../mock/get-mock-fhir-address';
import {
  compareAddressPeriod,
  getFirstAddress,
  getIAddressAsIMemberAddress,
  getPreferredAddress,
} from './get-prescription-address';
import { IAddress } from '../../../models/fhir/address';
import { IMemberAddress } from '@phx/common/src/models/api-request-body/create-booking.request-body';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('getIAddressAsIMemberAddress', () => {
  it('return IMemberAddress from one address line IAddress ', () => {
    const testAddress: IAddress = {
      use: 'home',
      type: 'both',
      text: '534 Erewhon St PeasantVille, Rainbow, Vic  3999',
      line: ['534 Erewhon St'],
      city: 'PleasantVille',
      district: 'Current',
      state: 'MA',
      postalCode: '13999',
      period: {
        start: '1988-08-12',
      },
    };
    const expectedAddress: IMemberAddress = {
      address1: '534 Erewhon St',
      city: 'PleasantVille',
      state: 'MA',
      zip: '13999',
      county: 'Current',
    };
    const returnedAddress = getIAddressAsIMemberAddress(testAddress);
    expect(returnedAddress).toEqual(expectedAddress);
  });

  it('return IMemberAddress from one address line IAddress without city, state or zip', () => {
    const testAddress: IAddress = {
      use: 'home',
      type: 'both',
      text: '534 Erewhon St PeasantVille, Rainbow, Vic  3999',
      line: ['534 Erewhon St'],
      district: 'Current',
      period: {
        start: '1988-08-12',
      },
    };
    const expectedAddress: IMemberAddress = {
      address1: '534 Erewhon St',
      city: '',
      state: '',
      zip: '',
      county: 'Current',
    };
    const returnedAddress = getIAddressAsIMemberAddress(testAddress);
    expect(returnedAddress).toEqual(expectedAddress);
  });

  it('return IMemberAddress from two address line IAddress ', () => {
    const testAddress: IAddress = {
      use: 'home',
      type: 'both',
      text: '534 Erewhon St Circle Loop PeasantVille, Rainbow, Vic  3999',
      line: ['534 Erewhon St', 'Circle Loop'],
      city: 'PleasantVille',
      district: 'Current',
      state: 'MA',
      postalCode: '13999',
      period: {
        start: '1988-08-12',
      },
    };
    const expectedAddress: IMemberAddress = {
      address1: '534 Erewhon St',
      address2: 'Circle Loop',
      city: 'PleasantVille',
      state: 'MA',
      zip: '13999',
      county: 'Current',
    };
    const returnedAddress = getIAddressAsIMemberAddress(testAddress);
    expect(returnedAddress).toEqual(expectedAddress);
  });

  it('return IMemberAddress from no address line IAddress ', () => {
    const testAddress: IAddress = {
      use: 'home',
      type: 'both',
      text: '534 Erewhon St PeasantVille, Rainbow, Vic  3999',
      city: 'PleasantVille',
      district: 'Current',
      state: 'MA',
      postalCode: '13999',
      period: {
        start: '1988-08-12',
      },
    };
    const expectedAddress: IMemberAddress = {
      address1: '',
      city: 'PleasantVille',
      state: 'MA',
      zip: '13999',
      county: 'Current',
    };
    const returnedAddress = getIAddressAsIMemberAddress(testAddress);
    expect(returnedAddress).toEqual(expectedAddress);
  });

  it('return IMemberAddress from empty address line IAddress ', () => {
    const testAddress: IAddress = {
      use: 'home',
      type: 'both',
      text: '534 Erewhon St PeasantVille, Rainbow, Vic  3999',
      line: [],
      city: 'PleasantVille',
      district: 'Current',
      state: 'MA',
      postalCode: '13999',
      period: {
        start: '1988-08-12',
      },
    };
    const expectedAddress: IMemberAddress = {
      address1: '',
      city: 'PleasantVille',
      state: 'MA',
      zip: '13999',
      county: 'Current',
    };
    const returnedAddress = getIAddressAsIMemberAddress(testAddress);
    expect(returnedAddress).toEqual(expectedAddress);
  });
});

describe('getFirstAddress', () => {
  it('return first address of an array of one addresses', () => {
    const address: IAddress | undefined = getFirstAddress(testAddressNoPeriod);
    expect(testAddressNoPeriod.length).toEqual(1);
    expect(address?.district).toEqual('NoPeriod');
  });

  it('return first address of an array of addresses', () => {
    const address: IAddress | undefined = getFirstAddress(
      testAddressCurrentAndExpired
    );
    expect(testAddressCurrentAndExpired.length).toEqual(2);
    expect(address?.district).toEqual('Current');
  });

  it('return undefined if the array of addresses is empty', () => {
    const testAddress: IAddress[] = [];
    const address: IAddress | undefined = getFirstAddress(testAddress);
    expect(testAddress.length).toEqual(0);
    expect(address).toEqual(undefined);
  });
});

describe('compareAddressPeriod', () => {
  it('sorts array of expired, current and no period dates', () => {
    const testSortAddresses: IAddress[] = [
      mockAddressExpired,
      mockAddressCurrent,
      mockAddressNoPeriod,
    ];
    testSortAddresses.sort(compareAddressPeriod);
    expect(testSortAddresses[0]).toEqual(mockAddressNoPeriod);
    expect(testSortAddresses[1]).toEqual(mockAddressCurrent);
    expect(testSortAddresses[2]).toEqual(mockAddressExpired);
  });

  it('sorts array of expired and current dates', () => {
    const testSortAddresses: IAddress[] = [
      mockAddressExpired,
      mockAddressCurrent,
      mockAddressNoPeriod,
    ];
    testSortAddresses.sort(compareAddressPeriod);
  });

  it('sorts array of expired and current dates with different use', () => {
    const testSortAddresses: IAddress[] = [
      mockAddressExpired,
      mockAddressCurrent,
      mockAddressNoPeriod,
    ];
    testSortAddresses.sort(compareAddressPeriod);
  });
});

describe('getPrescriptionAddress', () => {
  it('returns address from single address no period prescription', () => {
    const address: IAddress | undefined = getPreferredAddress(
      testAddressNoPeriod,
      'home'
    );
    expect(testAddressNoPeriod.length).toEqual(1);
    expect(address?.district).toEqual('NoPeriod');
  });

  it('returns address from single address current prescription', () => {
    const address: IAddress | undefined = getPreferredAddress(
      testAddressCurrent,
      'home'
    );
    expect(testAddressCurrent.length).toEqual(1);
    expect(address?.district).toEqual('Current');
  });

  it('returns address from multi address prescription', () => {
    const address: IAddress | undefined = getPreferredAddress(
      testAddressCurrentAndExpired,
      'home'
    );
    expect(testAddressCurrentAndExpired.length).toEqual(2);
    expect(address?.district).toEqual('Current');
  });
});
