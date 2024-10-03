// Copyright 2022 Prescryptive Health, Inc.

import { IMemberAddress } from '@phx/common/src/models/api-request-body/create-booking.request-body';
import { IAddress } from '../../../models/fhir/address';

export function getIAddressAsIMemberAddress(address: IAddress): IMemberAddress {
  let address1 = '';
  let address2: string | undefined;
  let city = '';
  let state = '';
  let zip = '';

  if (address.line) {
    if (address.line[0]) address1 = address.line[0];
    if (address.line[1]) address2 = address.line[1];
  }

  const county = address.district;

  if (address.city) city = address.city;
  if (address.state) state = address.state;
  if (address.postalCode) zip = address.postalCode;
  const memberAddress: IMemberAddress = {
    address1,
    address2,
    county,
    city,
    state,
    zip,
  };
  return memberAddress;
}

export function compareAddressPeriod(
  address1: IAddress | undefined,
  address2: IAddress | undefined
): number {
  if (address1?.period && address2?.period) {
    if (address2.period.end && address1.period.end) {
      if (address2.period.end === address1.period.end) {
        return 0;
      } else {
        return address2.period.end < address1.period.end ? -1 : 1;
      }
    } else {
      if (!address1.period.end && !address2.period.end) {
        if (address2.period.start && address1.period.start) {
          if (address2.period.start === address1.period.start) {
            return 0;
          } else {
            return address2.period.start < address1.period.start ? -1 : 1;
          }
        }
      }
      if (!address1.period.end && address2.period.end) {
        return -1;
      }
      return 1;
    }
  } else {
    if (address2?.period) {
      return -1;
    }
    if (address1?.period) {
      return 1;
    }
    return 0;
  }
}

export function getFirstAddress(addresses: IAddress[]): IAddress | undefined {
  if (addresses.length > 0) {
    return addresses[0];
  }
  return undefined;
}

export function getPreferredAddress(
  addresses: IAddress[],
  use: string
): IAddress | undefined {
  let mostRecentAddress: IAddress | undefined;
  let preferredAddress: IAddress | undefined;
  addresses.sort(compareAddressPeriod);
  addresses.forEach((address) => {
    if (address.use && address.use === use) {
      if (preferredAddress === undefined) {
        preferredAddress = address;
      }
    } else {
      if (mostRecentAddress === undefined) {
        mostRecentAddress = address;
      }
    }
  });
  if (preferredAddress === undefined) {
    preferredAddress = mostRecentAddress;
  }
  return preferredAddress;
}
