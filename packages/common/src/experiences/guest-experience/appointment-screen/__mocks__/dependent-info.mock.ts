// Copyright 2021 Prescryptive Health, Inc.

import { IDependentInformation } from '../../../../models/api-request-body/create-booking.request-body';
import { memberAddressMock } from './member-address.mock';

export const dependentInfoMock: IDependentInformation = {
  identifier: 'identifier',
  firstName: 'first-name',
  lastName: 'last-name',
  dateOfBirth: new Date().toDateString(),
  addressSameAsParent: true,
  address: memberAddressMock,
};
