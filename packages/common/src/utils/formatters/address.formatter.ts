// Copyright 2020 Prescryptive Health, Inc.

export interface IAddress {
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  name?: string;
}

export const formatAddress = (address: IAddress): string => {
  const formattedAddress = [address.address1, address.address2]
    .filter(Boolean)
    .join(' ');
  const formatted =
    `${formattedAddress}, ${address.city}, ${address.state} ${address.zip}`.trim();
  return formatted;
};

export const formatAddressWithoutStateZip = (address: IAddress): string => {
  const formattedAddress = [address.address1, address.address2]
    .filter(Boolean)
    .join(' ');
  const formatted = `${formattedAddress}, ${address.city}`.trim();
  return formatted;
};

export const formatAddressWithName = (address: IAddress): string => {
  const formatted =
    address.name +
    ' - ' +
    address.city +
    ', ' +
    address.state +
    ' ' +
    address.zip;
  return formatted;
};

export const formatZipCode = (zipCode: string) => {
  const originalZipCode = zipCode ?? '';
  const replacedZipCode = originalZipCode.replace(/[^0-9]/g, '');

  const formattedZipCode =
    replacedZipCode.length > 5
      ? replacedZipCode?.slice(0, 5) + '-' + replacedZipCode?.slice(5)
      : replacedZipCode;

  return formattedZipCode;
};
