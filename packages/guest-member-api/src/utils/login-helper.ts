// Copyright 2018 Prescryptive Health, Inc.

import { IPerson } from '@phx/common/src/models/person';
import { IJwtTokenPayload } from '../models/token-payload';

export interface IDataToValidate {
  firstName: string;
  dateOfBirth: string;
}
export const isLoginDataValid = (
  userData: IDataToValidate,
  comparator: IDataToValidate
) => {
  const dateMatch = userData.dateOfBirth === comparator.dateOfBirth;
  const firstNameMatch =
    userData.firstName.toLowerCase() === comparator.firstName.toLowerCase();
  return firstNameMatch && dateMatch;
};

export const generateTokenPayload = (
  personModel: IPerson,
  isTokenAuthenticated: boolean
): IJwtTokenPayload => {
  return {
    firstName: personModel.firstName,
    identifier: personModel.identifier,
    isPhoneNumberVerified: personModel.isPhoneNumberVerified,
    isTokenAuthenticated,
    lastName: personModel.lastName,
    phoneNumber: personModel.phoneNumber,
  };
};
