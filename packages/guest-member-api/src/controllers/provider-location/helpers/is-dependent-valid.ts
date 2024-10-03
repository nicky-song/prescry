// Copyright 2020 Prescryptive Health, Inc.

import { IDependentInformation } from '@phx/common/src/models/api-request-body/create-booking.request-body';
import { CalculateAbsoluteAge } from '@phx/common/src/utils/date-time-helper';

import { validateMemberDateOfBirth } from '../../../validators/member-date-of-birth.validator';
import AddressValidator from '@phx/common/src/utils/validators/address.validator';

export const isDepdendentValid = (
  dependentInfo: IDependentInformation,
  dependentMinAge: number
): boolean => {
  const { firstName, lastName, dateOfBirth, addressSameAsParent, address } =
    dependentInfo;
  if (
    !firstName ||
    firstName.trim().length === 0 ||
    firstName.trim().length > 255
  ) {
    return false;
  }
  if (
    !lastName ||
    lastName.trim().length === 0 ||
    lastName.trim().length > 255
  ) {
    return false;
  }
  if (
    !dateOfBirth ||
    !validateMemberDateOfBirth(dateOfBirth) ||
    CalculateAbsoluteAge(new Date(), dateOfBirth) < dependentMinAge
  ) {
    return false;
  }
  if (!addressSameAsParent) {
    if (!AddressValidator.isAddressValid(address)) {
      return false;
    }
  }
  return true;
};
