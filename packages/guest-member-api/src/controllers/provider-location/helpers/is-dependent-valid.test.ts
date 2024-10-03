// Copyright 2020 Prescryptive Health, Inc.

import { isDepdendentValid } from './is-dependent-valid';
import { IDependentInformation } from '@phx/common/src/models/api-request-body/create-booking.request-body';

describe('isDepdendentValid', () => {
  it.each([
    [
      true,
      {
        firstName: 'firstName',
        lastName: 'LastName',
        dateOfBirth: 'September-22-2010',
        addressSameAsParent: true,
      },
    ],
    [
      true,
      {
        firstName: 'firstName',
        lastName: 'LastName',
        dateOfBirth: 'September-22-2010',
        addressSameAsParent: false,
        address: {
          address1: 'addr1',
          county: 'county',
          city: 'city',
          state: 'state',
          zip: '11111',
        },
      },
    ],
    [
      true,
      {
        firstName: 'firstName',
        lastName: 'LastName',
        dateOfBirth: 'September-22-2010',
        address: {
          address1: 'addr1',
          county: 'county',
          city: 'city',
          state: 'state',
          zip: '11111',
        },
      },
    ],
  ])(
    `Validates dependent and returns true if valid: ('%s')`,
    (isValid: boolean, dependentInfo: IDependentInformation) => {
      expect(isDepdendentValid(dependentInfo, 3)).toEqual(isValid);
    }
  );

  it.each([
    [
      false,
      {
        lastName: 'LastName',
        dateOfBirth: 'September-22-2000',
        addressSameAsParent: true,
      },
    ],
    [
      false,
      {
        firstName: '',
        lastName: 'LastName',
        dateOfBirth: 'September-22-2000',
        addressSameAsParent: true,
      },
    ],
    [
      false,
      {
        firstName:
          'SuperLongFirstNameTestSuperLongFirstNameTestSuperLongFirstNameTestSuperLongFirstNameTestSuperLongFirstNameTestSuperLongFirstNameTestSuperLongFirstNameTestSuperLongFirstNameTestSuperLongFirstNameTestSuperLongFirstNameTestSuperLongFirstNameTestSuperLongFirstNameTest',
        lastName: 'LastName',
      },
    ],
  ])(
    `Validates dependent on firstName and returns false if not valid: ('%s')`,
    (isValid: boolean, dependentInfo: IDependentInformation) => {
      expect(isDepdendentValid(dependentInfo, 3)).toEqual(isValid);
    }
  );

  it.each([
    [
      false,
      {
        firstName: 'firstName',
        dateOfBirth: 'September-22-2000',
        addressSameAsParent: true,
      },
    ],
    [
      false,
      {
        firstName: 'firstName',
        lastName: '',
        dateOfBirth: 'September-22-2000',
        addressSameAsParent: true,
      },
    ],
    [
      false,
      {
        firstName: 'firstName',
        lastName:
          'SuperLongLastNameTestSuperLongLastNameTestSuperLongLastNameTestSuperLongLastNameTestSuperLongLastNameTestSuperLongLastNameTestSuperLongLastNameTestSuperLongLastNameTestSuperLongLastNameTestSuperLongLastNameTestSuperLongLastNameTestSuperLongLastNameTestSuperLongLastNameTest',

        dateOfBirth: 'September-22-2000',
        addressSameAsParent: true,
      },
    ],
  ])(
    `Validates dependent on lastName and returns false if not valid: ('%s')`,
    (isValid: boolean, dependentInfo: IDependentInformation) => {
      expect(isDepdendentValid(dependentInfo, 3)).toEqual(isValid);
    }
  );

  it.each([
    [
      false,
      {
        firstName: 'firstName',
        lastName: 'LastName',
        addressSameAsParent: true,
      },
    ],
    [
      false,
      {
        firstName: 'firstName',
        lastName: 'LastName',
        dateOfBirth: 'fake-dob',
        addressSameAsParent: true,
      },
    ],
    [
      false,
      {
        firstName: 'firstName',
        lastName: 'LastName',
        dateOfBirth: 'fake-dob',
        addressSameAsParent: true,
      },
    ],
    [
      false,
      {
        firstName: 'firstName',
        lastName: 'LastName',
        dateOfBirth: 'February-32-2010',
        addressSameAsParent: true,
      },
    ],
    [
      false,
      {
        firstName: 'firstName',
        lastName: 'LastName',
        dateOfBirth: 'June-31-2019',
        addressSameAsParent: true,
      },
    ],
    [
      false,
      {
        firstName: 'firstName',
        lastName: 'LastName',
        dateOfBirth: 'September-22-2020',
        addressSameAsParent: true,
      },
    ],
  ])(
    `Validates dependent on dateOfBirth and returns false if not valid: ('%s')`,
    (isValid: boolean, dependentInfo: IDependentInformation) => {
      expect(isDepdendentValid(dependentInfo, 3)).toEqual(isValid);
    }
  );
  it.each([
    [
      false,
      {
        firstName: 'firstName',
        lastName: 'LastName',
        dateOfBirth: 'September-22-2010',
      },
    ],
    [
      false,
      {
        firstName: 'firstName',
        lastName: 'LastName',
        dateOfBirth: 'September-22-2010',
        addressSameAsParent: false,
      },
    ],
    [
      false,
      {
        firstName: 'firstName',
        lastName: 'LastName',
        dateOfBirth: 'September-22-2010',
        address: {
          county: 'county',
          city: 'city',
          state: 'state',
          zip: '11111',
        },
      } as IDependentInformation,
    ],
    [
      false,
      {
        firstName: 'firstName',
        lastName: 'LastName',
        dateOfBirth: 'September-22-2010',
        address: {
          address1: 'addr1',
          city: 'city',
          state: 'state',
          zip: '11111',
        },
      } as IDependentInformation,
    ],
    [
      false,
      {
        firstName: 'firstName',
        lastName: 'LastName',
        dateOfBirth: 'September-22-2010',
        address: {
          address1: 'addr1',
          county: 'county',
          state: 'state',
          zip: '11111',
        },
      } as IDependentInformation,
    ],
    [
      false,
      {
        firstName: 'firstName',
        lastName: 'LastName',
        dateOfBirth: 'September-22-2010',
        address: {
          address1: 'addr1',
          county: 'county',
          city: 'city',
          zip: '11111',
        },
      } as IDependentInformation,
    ],
    [
      false,
      {
        firstName: 'firstName',
        lastName: 'LastName',
        dateOfBirth: 'September-22-2010',
        address: {
          address1: 'addr1',
          county: 'county',
          city: 'city',
          state: 'state',
        },
      } as IDependentInformation,
    ],
  ])(
    `Validates dependent on address and returns false if not valid: ('%s')`,
    (isValid: boolean, dependentInfo: IDependentInformation) => {
      expect(isDepdendentValid(dependentInfo, 3)).toEqual(isValid);
    }
  );
  it.each([
    [
      false,
      {
        firstName: 'firstName',
        lastName: 'LastName',
        dateOfBirth: 'September-22-2010',
        addressSameAsParent: true,
      },
    ],
    [
      true,
      {
        firstName: 'firstName',
        lastName: 'LastName',
        dateOfBirth: 'September-22-2000',
        addressSameAsParent: true,
      },
    ],
  ])(
    `Validates dependent on dateOfBirth against the min date passed and returns false only if min age requirement not met: ('%s')`,
    (isValid: boolean, dependentInfo: IDependentInformation) => {
      expect(isDepdendentValid(dependentInfo, 18)).toEqual(isValid);
    }
  );
});
