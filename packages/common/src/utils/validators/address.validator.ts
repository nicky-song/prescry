// Copyright 2021 Prescryptive Health, Inc.

import { AddressFieldName } from '../../models/address-fields';
import { IMemberAddress } from '../../models/api-request-body/create-booking.request-body';

export const maximumStreetAddressLength = 200;

export const maximumCityLength = 40;

export const validateMaxCharacters = (
  value: string,
  fieldName: AddressFieldName
): boolean => {
  switch (fieldName) {
    case AddressFieldName.STREET_NAME:
      if (value.trim().length <= maximumStreetAddressLength) {
        return true;
      }
      return false;
    case AddressFieldName.CITY:
      if (value.trim().length <= maximumCityLength) {
        return true;
      }
      return false;
    case AddressFieldName.COUNTY:
    case AddressFieldName.STATE:
    case AddressFieldName.ZIP:
      return true;
  }
};

function isAddressValid(address: IMemberAddress | undefined): boolean {
  if (!address) {
    return false;
  }
  const { address1, city, state, zip, county } = address;
  return (
    isStreetAddressValid(address1) &&
    isCityCountyValid(city) &&
    isStateValid(state) &&
    isZipValid(zip) &&
    isCityCountyValid(county)
  );
}

function isAddressWithoutCountyValid(
  address: IMemberAddress | undefined
): boolean {
  if (!address) {
    return false;
  }
  const { address1, city, state, zip } = address;
  return (
    isStreetAddressValid(address1) &&
    isCityCountyValid(city) &&
    isStateValid(state) &&
    isZipValid(zip)
  );
}

function isStreetAddressValid(value: string | undefined) {
  const addressValidationRegEx = /^[a-zA-Z0-9\s,.'-/#]{5,200}$/;

  if (
    !value ||
    value.trim().length === 0 ||
    !addressValidationRegEx.test(value.trim())
  ) {
    return false;
  }
  return true;
}
function isCityCountyValid(value: string | undefined) {
  const cityCountyValidationRegEx = /^[a-zA-Z0-9\s]{2,40}$/;
  if (
    !value ||
    value.trim().length === 0 ||
    !cityCountyValidationRegEx.test(value.trim())
  ) {
    return false;
  }
  return true;
}
function isStateValid(value: string | undefined) {
  if (!value || value.trim().length === 0) {
    return false;
  }
  return true;
}
function isZipAllDigits(value: string | undefined) {
  const allDigitsRegEx = /(^\d{0,5}$)/;
  return !value || allDigitsRegEx.test(value);
}

function isZipValid(value: string | undefined) {
  const zipCodeValidationRegEx = /(^\d{5}$)|(^\d{5}-\d{4}$)/;

  if (!value || !zipCodeValidationRegEx.test(value)) {
    return false;
  }
  return true;
}

const AddressValidator = {
  isStreetAddressValid,
  isCityCountyValid,
  isStateValid,
  isAddressValid,
  isZipValid,
  isZipAllDigits,
  isAddressWithoutCountyValid,
};

export default AddressValidator;
