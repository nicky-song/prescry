// Copyright 2020 Prescryptive Health, Inc.

import { membershipVerificationHelper } from './membership-verification.helper';
import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';
import {
  ErrorConstants,
  LoginMessages as responseMessage,
} from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import { isLoginDataValid } from '../../../utils/login-helper';
import {
  findPersonByPrimaryMemberRxId,
  findPersonByFamilyId,
} from '../../../utils/person/find-matching-person.helper';
import {
  invalidMemberRxIdResponse,
  invalidMemberResponse,
  invalidMemberDetailsResponse,
} from '../../login/helpers/login-response.helper';
import { IPerson } from '@phx/common/src/models/person';
import { getAllRecordsForLoggedInPerson } from '../../../utils/person/get-logged-in-person.helper';
import { searchPersonByPhoneNumber } from '../../../databases/mongo-database/v1/query-helper/person-collection-helper';
import { searchAccountByPhoneNumber } from '../../../databases/mongo-database/v1/query-helper/account-collection-helper';
import { verifyActivationRecord } from '../../../utils/verify-activation-record';
import { trackActivationPersonFailureEvent } from '../../../utils/custom-event-helper';

jest.mock('../../../utils/person/find-matching-person.helper');
jest.mock('../../login/helpers/login-response.helper');
jest.mock('../../../utils/login-helper');
jest.mock('../../../utils/person/get-logged-in-person.helper');
jest.mock(
  '../../../databases/mongo-database/v1/query-helper/person-collection-helper'
);
jest.mock(
  '../../../databases/mongo-database/v1/query-helper/account-collection-helper'
);

jest.mock('../../../utils/verify-activation-record');
const verifyActivationRecordMock = verifyActivationRecord as jest.Mock;

jest.mock('../../../utils/custom-event-helper');
const trackActivationPersonFailureEventMock =
  trackActivationPersonFailureEvent as jest.Mock;

const findPersonByPrimaryMemberRxIdMock =
  findPersonByPrimaryMemberRxId as jest.Mock;
const findPersonByFamilyIdMock = findPersonByFamilyId as jest.Mock;
const invalidMemberRxIdResponseMock = invalidMemberRxIdResponse as jest.Mock;
const invalidMemberResponseMock = invalidMemberResponse as jest.Mock;
const isLoginDataValidMock = isLoginDataValid as jest.Mock;
const invalidMemberDetailsResponseMock =
  invalidMemberDetailsResponse as jest.Mock;
const getAllRecordsForLoggedInPersonMock =
  getAllRecordsForLoggedInPerson as jest.Mock;
const searchPersonByPhoneNumberMock = searchPersonByPhoneNumber as jest.Mock;
const searchAccountByPhoneNumberMock = searchAccountByPhoneNumber as jest.Mock;

const databaseMock = {
  Models: {
    PersonModel: {
      findOne: jest.fn(),
    },
  },
} as unknown as IDatabase;
const primaryMemberRxIdMock = '1234567890';
const firstNameMock = 'Johnny';
const lastNameMock = 'Appleseed';
const dateOfBirthMock = '2000-01-01';
const phoneNumberMock = '111-222-3333';

beforeEach(() => {
  jest.clearAllMocks();
  verifyActivationRecordMock.mockReturnValue({ isValid: true });
});
describe('membershipVerificationHelper -> ', () => {
  it('findPersonByPrimaryMemberRxId is called to find person by Primary member id', async () => {
    await membershipVerificationHelper(
      databaseMock,
      phoneNumberMock,
      firstNameMock,
      lastNameMock,
      dateOfBirthMock,
      primaryMemberRxIdMock
    );
    expect(findPersonByPrimaryMemberRxIdMock).toBeCalledWith(
      databaseMock,
      primaryMemberRxIdMock
    );
  });
  it('findPersonByFamilyId is called when "findPersonByPrimaryMemberRxId" failed to find person by Primary member id', async () => {
    findPersonByPrimaryMemberRxIdMock.mockReturnValue(null);
    await membershipVerificationHelper(
      databaseMock,
      phoneNumberMock,
      firstNameMock,
      lastNameMock,
      dateOfBirthMock,
      primaryMemberRxIdMock
    );
    expect(findPersonByFamilyIdMock).toBeCalledWith(
      databaseMock,
      firstNameMock,
      dateOfBirthMock,
      primaryMemberRxIdMock
    );
  });

  it('invalidMemberRxIdResponse is called when failed to find person by primary member id and Family id', async () => {
    findPersonByPrimaryMemberRxIdMock.mockReturnValue(null);
    findPersonByFamilyIdMock.mockReturnValue(null);
    await membershipVerificationHelper(
      databaseMock,
      phoneNumberMock,
      firstNameMock,
      lastNameMock,
      dateOfBirthMock,
      primaryMemberRxIdMock
    );
    expect(invalidMemberRxIdResponseMock).toBeCalledWith(
      firstNameMock,
      lastNameMock,
      dateOfBirthMock,
      primaryMemberRxIdMock
    );
  });

  it('invalidMemberResponse is called when member identifier is null', async () => {
    findPersonByPrimaryMemberRxIdMock.mockReturnValue(null);
    findPersonByFamilyIdMock.mockReturnValue({ identifier: null });
    await membershipVerificationHelper(
      databaseMock,
      phoneNumberMock,
      firstNameMock,
      lastNameMock,
      dateOfBirthMock,
      primaryMemberRxIdMock
    );
    expect(invalidMemberResponseMock).toBeCalledWith(primaryMemberRxIdMock);
  });

  it('invalidMemberDetailsResponse is called when Login data is invalid', async () => {
    findPersonByPrimaryMemberRxIdMock.mockReturnValue(null);
    findPersonByFamilyIdMock.mockReturnValue({
      identifier: 123,
      firstName: 'person-first-name',
      dateOfBirth: 'person-date-of-birth',
    });
    isLoginDataValidMock.mockReturnValue(false);
    await membershipVerificationHelper(
      databaseMock,
      phoneNumberMock,
      firstNameMock,
      lastNameMock,
      dateOfBirthMock,
      primaryMemberRxIdMock
    );
    expect(isLoginDataValidMock).toBeCalledWith(
      { firstName: firstNameMock, dateOfBirth: dateOfBirthMock },
      { firstName: 'person-first-name', dateOfBirth: 'person-date-of-birth' }
    );
    expect(invalidMemberDetailsResponseMock).toBeCalledWith(
      firstNameMock,
      lastNameMock,
      dateOfBirthMock,
      primaryMemberRxIdMock
    );
  });

  it('return unauthorized response when the phone number found is different from supplied phone number for verification', async () => {
    const modelFoundMock = {
      identifier: 123,
      phoneNumber: '0000000000',
    };
    findPersonByPrimaryMemberRxIdMock.mockReturnValue(modelFoundMock);
    isLoginDataValidMock.mockReturnValue(true);
    const actual = await membershipVerificationHelper(
      databaseMock,
      phoneNumberMock,
      firstNameMock,
      lastNameMock,
      dateOfBirthMock,
      primaryMemberRxIdMock
    );
    expect(actual).toEqual({
      isValidMembership: false,
      responseCode: HttpStatusCodes.UNAUTHORIZED_REQUEST,
      responseMessage: responseMessage.PHONE_NUMBER_EXISTS,
    });
  });

  it('return BAD REQUEST when user entered profile does not have phone number and user entered phone already has a SIE profile', async () => {
    const modelFoundMock = {
      identifier: 123,
      phoneNumber: '',
    };
    const sieMock = {
      phoneNumber: phoneNumberMock,
      rxGroupType: 'SIE',
    } as IPerson;

    findPersonByPrimaryMemberRxIdMock.mockReturnValue(modelFoundMock);
    isLoginDataValidMock.mockReturnValue(true);
    searchPersonByPhoneNumberMock.mockReturnValue([sieMock]);
    const actual = await membershipVerificationHelper(
      databaseMock,
      phoneNumberMock,
      firstNameMock,
      lastNameMock,
      dateOfBirthMock,
      primaryMemberRxIdMock
    );
    expect(actual).toEqual({
      isValidMembership: false,
      responseCode: HttpStatusCodes.BAD_REQUEST,
      responseMessage: responseMessage.PHONE_NUMBER_INVALID,
    });
  });
  it('return NOT FOUND error when user entered profile does match with account info if account exists', async () => {
    const modelFoundMock = {
      identifier: 123,
      phoneNumber: phoneNumberMock,
      firstName: firstNameMock,
      dateOfBirth: dateOfBirthMock,
    };
    const sieMock = {
      phoneNumber: phoneNumberMock,
      rxGroupType: 'SIE',
    } as IPerson;
    const accountMock = {
      phoneNumber: phoneNumberMock,
      firstName: 'first-name2',
      dateOfBirth: 'date-of-birth',
    };

    findPersonByPrimaryMemberRxIdMock.mockReturnValue(modelFoundMock);
    searchAccountByPhoneNumberMock.mockReturnValueOnce(accountMock);
    isLoginDataValidMock.mockReturnValueOnce(true).mockReturnValueOnce(false);
    searchPersonByPhoneNumberMock.mockReturnValue([sieMock]);
    const actual = await membershipVerificationHelper(
      databaseMock,
      phoneNumberMock,
      firstNameMock,
      lastNameMock,
      dateOfBirthMock,
      primaryMemberRxIdMock
    );
    expect(actual).toEqual({
      isValidMembership: false,
      responseCode: HttpStatusCodes.NOT_FOUND,
      responseMessage: ErrorConstants.ACCOUNT_PERSON_DATA_MISMATCH,
    });
  });
  it('return NOT FOUND error when user entered profile does not match with activation phone number record info', async () => {
    const modelFoundMock = {
      identifier: 123,
      phoneNumber: '',
      firstName: firstNameMock,
      dateOfBirth: dateOfBirthMock,
    };
    const activationRecordMock = {
      activationPhoneNumber: phoneNumberMock,
      firstName: 'DIFFERENT FIRST NAME',
      lastName: lastNameMock,
      dateOfBirth: '2000-01-10',
      phoneNumber: '',
      rxGroupType: 'SIE',
    } as IPerson;
    findPersonByPrimaryMemberRxIdMock.mockReturnValue(modelFoundMock);
    searchAccountByPhoneNumberMock.mockReturnValueOnce(undefined);
    isLoginDataValidMock.mockReturnValueOnce(true);
    searchPersonByPhoneNumberMock.mockReturnValue([]);
    verifyActivationRecordMock.mockReturnValueOnce({
      isValid: false,
      activationRecord: activationRecordMock,
    });
    const actual = await membershipVerificationHelper(
      databaseMock,
      phoneNumberMock,
      firstNameMock,
      lastNameMock,
      dateOfBirthMock,
      primaryMemberRxIdMock
    );
    expect(actual).toEqual({
      isValidMembership: false,
      responseCode: HttpStatusCodes.NOT_FOUND,
      responseMessage:
        ErrorConstants.ACCOUNT_CREATION_ACTIVATION_PERSON_RECORD_DATA_MISMATCH,
    });
    expect(trackActivationPersonFailureEventMock).toBeCalledWith(
      'MEMBER_VERIFICATION_FAILURE',
      activationRecordMock.firstName,
      activationRecordMock.dateOfBirth,
      phoneNumberMock,
      firstNameMock,
      dateOfBirthMock,
      primaryMemberRxIdMock
    );
  });
  it('return NOT FOUND error when user entered phone number does not match with SIE record activation phone number record info', async () => {
    const modelFoundMock = {
      identifier: 123,
      phoneNumber: '',
      firstName: firstNameMock,
      lastName: lastNameMock,
      dateOfBirth: dateOfBirthMock,
      activationPhoneNumber: 'test',
      rxGroupType: 'SIE',
    } as unknown as IPerson;

    findPersonByPrimaryMemberRxIdMock.mockReturnValue(modelFoundMock);
    searchAccountByPhoneNumberMock.mockReturnValueOnce(undefined);
    isLoginDataValidMock.mockReturnValueOnce(true);
    searchPersonByPhoneNumberMock.mockReturnValue([]);
    verifyActivationRecordMock.mockReturnValueOnce({
      isValid: true,
      activationRecord: modelFoundMock,
    });
    const actual = await membershipVerificationHelper(
      databaseMock,
      phoneNumberMock,
      firstNameMock,
      lastNameMock,
      dateOfBirthMock,
      primaryMemberRxIdMock
    );
    expect(actual).toEqual({
      isValidMembership: false,
      responseCode: HttpStatusCodes.NOT_FOUND,
      responseMessage:
        ErrorConstants.ACCOUNT_CREATION_ACTIVATION_PERSON_RECORD_DATA_MISMATCH,
    });
  });
  it('returns success response when user entered profile does not have phone number but has a CASH profile', async () => {
    const modelFoundMock = {
      identifier: '123',
      phoneNumber: '',
    };
    const cashMock = {
      phoneNumber: phoneNumberMock,
      rxGroupType: 'CASH',
    } as IPerson;

    const accountMock = {
      phoneNumber: phoneNumberMock,
      firstName: firstNameMock,
      dateOfBirth: dateOfBirthMock,
    };

    findPersonByPrimaryMemberRxIdMock.mockReturnValue(modelFoundMock);
    isLoginDataValidMock.mockReturnValue(true);
    searchPersonByPhoneNumberMock.mockReturnValue([cashMock]);
    getAllRecordsForLoggedInPersonMock.mockReturnValue([cashMock]);
    searchAccountByPhoneNumberMock.mockReturnValueOnce(accountMock);
    const actual = await membershipVerificationHelper(
      databaseMock,
      phoneNumberMock,
      firstNameMock,
      lastNameMock,
      dateOfBirthMock,
      primaryMemberRxIdMock
    );

    expect(actual).toEqual({
      isValidMembership: true,
      member: modelFoundMock,
    });
  });

  it('returns success response when user entered details matches with database details', async () => {
    const modelFoundMock = {
      identifier: '123',
    };

    findPersonByPrimaryMemberRxIdMock.mockReturnValue(modelFoundMock);
    isLoginDataValidMock.mockReturnValue(true);
    searchPersonByPhoneNumberMock.mockReturnValue([]);
    searchAccountByPhoneNumberMock.mockReturnValueOnce(null);
    const actual = await membershipVerificationHelper(
      databaseMock,
      phoneNumberMock,
      firstNameMock,
      lastNameMock,
      dateOfBirthMock,
      primaryMemberRxIdMock
    );

    expect(actual).toEqual({
      isValidMembership: true,
      member: modelFoundMock,
    });
  });
});
