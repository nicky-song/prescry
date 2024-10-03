// Copyright 2018 Prescryptive Health, Inc.

import { IPerson } from '@phx/common/src/models/person';
import { generateTokenPayload, isLoginDataValid } from './login-helper';

jest.mock('@phx/common/src/utils/date-time-helper', () => ({
  UTCDate: jest.fn().mockReturnValue(1564747583),
}));

const firstName = 'John';
const dateOfBirth = '1980-10-05';

const documentsFoundMock = {
  dateOfBirth: '1980-10-05',
  firstName: 'John',
  identifier: 'mock-identifier',
  isPhoneNumberVerified: true,
  lastName: 'Doe',
  phoneNumber: 'mock-phoneNumber',
  primaryMemberRxId: '201704071001',
} as IPerson;

describe('isLoginDataValid()', () => {
  it('should return true if request data and model data from database are same', () => {
    expect(
      isLoginDataValid(
        { firstName, dateOfBirth },
        {
          firstName: documentsFoundMock.firstName,
          dateOfBirth: documentsFoundMock.dateOfBirth,
        }
      )
    ).toBeTruthy();
  });

  it('should return false if request data and model data from database are same', () => {
    const invalidfirstName = 'jack';
    expect(
      isLoginDataValid(
        { firstName: invalidfirstName, dateOfBirth },
        {
          firstName: documentsFoundMock.firstName,
          dateOfBirth: documentsFoundMock.dateOfBirth,
        }
      )
    ).toBeFalsy();
  });
});

describe('generateTokenPayload()', () => {
  it('should generate payload with the person information and isTokenAuthenticated flag', () => {
    const payload = generateTokenPayload(documentsFoundMock, true);
    expect(payload).toEqual({
      firstName: 'John',
      identifier: 'mock-identifier',
      isPhoneNumberVerified: true,
      isTokenAuthenticated: true,
      lastName: 'Doe',
      phoneNumber: 'mock-phoneNumber',
    });
  });
});
