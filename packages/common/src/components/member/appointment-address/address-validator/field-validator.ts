// Copyright 2020 Prescryptive Health, Inc.

import { AddressFieldName } from '../../../../models/address-fields';

import AddressValidator from '../../../../utils/validators/address.validator';

export const fieldValidator = (
  fieldName: AddressFieldName,
  value: string
): boolean => {
  if (!value || !value.trim().length) {
    return false;
  }

  if (fieldName === AddressFieldName.STREET_NAME) {
    return AddressValidator.isStreetAddressValid(value);
  }

  if (
    fieldName === AddressFieldName.COUNTY ||
    fieldName === AddressFieldName.CITY
  ) {
    return AddressValidator.isCityCountyValid(value);
  }

  if (fieldName === AddressFieldName.ZIP) {
    return AddressValidator.isZipValid(value);
  }

  return true;
};
