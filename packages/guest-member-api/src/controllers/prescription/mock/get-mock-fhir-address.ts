// Copyright 2022 Prescryptive Health, Inc.

import { IAddress } from '../../../models/fhir/address';

export const mockAddressNoPeriod: IAddress = {
  use: 'home',
  type: 'both',
  text: '534 Erewhon St PeasantVille, Rainbow, Vic  3999',
  line: ['534 Erewhon St'],
  city: 'PleasantVille',
  district: 'NoPeriod',
  state: 'MA',
  postalCode: '13999',
};

export const mockAddressCurrent: IAddress = {
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

export const mockAddressExpired: IAddress = {
  use: 'home',
  type: 'both',
  text: '1050 W Wishard Blvd RG 5th floor',
  line: ['1050 W Wishard Blvd', 'RG 5th floor'],
  city: 'Indianapolis',
  district: 'Expired',
  state: 'IN',
  postalCode: '46240',
  period: {
    start: '1974-12-25',
    end: '1988-08-12',
  },
};

export const testAddressCurrentAndExpired: IAddress[] = [
  mockAddressCurrent,
  mockAddressExpired,
];
export const testAddressCurrent: IAddress[] = [mockAddressCurrent];
export const testAddressExpired: IAddress[] = [mockAddressExpired];
export const testAddressNoPeriod: IAddress[] = [mockAddressNoPeriod];
