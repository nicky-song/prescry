// Copyright 2020 Prescryptive Health, Inc.

import { existingAccountHelper } from './existing-account.helper';
import { LoginMessages } from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import { UTCDateString } from '@phx/common/src/utils/date-time-helper';
import { IPerson } from '@phx/common/src/models/person';
import { searchAccountByPhoneNumber } from '../../../databases/mongo-database/v1/query-helper/account-collection-helper';
import { publishAccountUpdateMessageAndAddToRedis } from '../../../utils/account/account.helper';
import { createCashProfileAndAddToRedis } from '../../../utils/person/create-cash-profile-and-add-to-redis';
import { getAllRecordsForLoggedInPerson } from '../../../utils/person/get-logged-in-person.helper';
import { updatePrescriptionWithMemberId } from '../../prescription/helpers/update-prescriptions-with-member-id';
import { IMemberAddress } from '@phx/common/src/models/api-request-body/create-booking.request-body';
import { databaseMock } from '../../../mock-data/database.mock';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { ForbiddenRequestError } from '../../../errors/request-errors/forbidden.request-error';
import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';
import { RxGroupTypesEnum } from '@phx/common/src/models/member-profile/member-profile-info';

jest.mock('../../../utils/account/account.helper');
const publishAccountUpdateMessageAndAddToRedisMock =
  publishAccountUpdateMessageAndAddToRedis as jest.Mock;

jest.mock(
  '../../../databases/mongo-database/v1/query-helper/account-collection-helper'
);
const searchAccountByPhoneNumberMock = searchAccountByPhoneNumber as jest.Mock;

jest.mock('../../../utils/person/create-cash-profile-and-add-to-redis');
const createCashProfileAndAddToRedisMock =
  createCashProfileAndAddToRedis as jest.Mock;

jest.mock('../../../utils/person/get-logged-in-person.helper');
const getAllRecordsForLoggedInPersonMock =
  getAllRecordsForLoggedInPerson as jest.Mock;

jest.mock('../../prescription/helpers/update-prescriptions-with-member-id');
const updatePrescriptionWithMemberIdMock =
  updatePrescriptionWithMemberId as jest.Mock;

describe('existingAccountHelper -> ', () => {
  const addressMock: IMemberAddress = {
    address1: 'Mock address #1',
    address2: 'Mock 2 address',
    city: 'Mock city',
    state: 'Mock state',
    zip: 'Mock zip',
    county: 'Mock county',
  };

  beforeEach(() => {
    jest.clearAllMocks();

    createCashProfileAndAddToRedisMock.mockResolvedValue({});
  });

  it('calls searchAccountByPhoneNumber to fetch account details', async () => {
    const phoneNumberMock = '111-222-3333';
    const masterIdMock = 'master-id';
    const accountIdMock = 'account-id';
    const familyIdMock = 'family-id';

    await existingAccountHelper(
      databaseMock,
      phoneNumberMock,
      'Johnny',
      'Appleseed',
      '01/01/2020',
      'test@test.com',
      configurationMock,
      undefined,
      undefined,
      familyIdMock,
      masterIdMock,
      accountIdMock
    );

    expectToHaveBeenCalledOnceOnlyWith(
      searchAccountByPhoneNumberMock,
      databaseMock,
      phoneNumberMock
    );
  });

  it('throws exception when account already exists', async () => {
    const dateOfBirthMock = '01/01/2020';
    searchAccountByPhoneNumberMock.mockResolvedValue({
      dateOfBirth: dateOfBirthMock,
    });

    try {
      await existingAccountHelper(
        databaseMock,
        '111-222-3333',
        'Johnny',
        'Appleseed',
        '01/01/2020',
        'test@test.com',
        configurationMock
      );
      fail('Expected exception but none thrown!');
    } catch (error) {
      const expectedError = new ForbiddenRequestError(
        LoginMessages.PHONE_NUMBER_EXISTS
      );
      expect(error).toEqual(expectedError);
    }
  });

  it.each([
    [undefined, undefined, undefined],
    ['family-id', 'master-id', 'account-id'],
  ])(
    'publishes account update and adds to Redis when account does not exist',
    async (
      masterIdMock?: string,
      accountIdMock?: string,
      familyIdMock?: string
    ) => {
      const firstNameMock = ' Johnny ';
      const lastNameMock = ' Appleseed ';
      const dateOfBirthMock = '01/01/2020';
      const phoneNumberMock = '111-222-3333';
      const recoveryEmail = 'test@test.com';
      searchAccountByPhoneNumberMock.mockResolvedValue(null);

      await existingAccountHelper(
        databaseMock,
        phoneNumberMock,
        firstNameMock,
        lastNameMock,
        dateOfBirthMock,
        recoveryEmail,
        configurationMock,
        undefined,
        undefined,
        familyIdMock,
        masterIdMock,
        accountIdMock
      );

      expect(publishAccountUpdateMessageAndAddToRedisMock).toBeCalledWith(
        {
          dateOfBirth: dateOfBirthMock,
          firstName: firstNameMock.toUpperCase().trim(),
          lastName: lastNameMock.toUpperCase().trim(),
          phoneNumber: phoneNumberMock,
          recoveryEmail,
          masterId: masterIdMock,
          accountId: accountIdMock,
          recentlyUpdated: true,
        },
        configurationMock.redisPhoneNumberRegistrationKeyExpiryTime
      );
    }
  );

  it('creates cash profile when no existing cash profile and account does not exist', async () => {
    const firstNameMock = 'Johnny1';
    const lastNameMock = 'Appleseed';
    const dateOfBirthMock = '01/01/2020';
    const phoneNumberMock = '111-222-3333';
    const recoveryEmail = 'test@test.com';
    const primaryMemberFamilyIdMock = 'family-id';

    const personMock: Partial<IPerson> = {
      firstName: 'first-name',
      lastName: 'last-name',
      primaryMemberFamilyId: primaryMemberFamilyIdMock,
      rxGroupType: RxGroupTypesEnum.CASH,
    };
    getAllRecordsForLoggedInPersonMock.mockReturnValue([]);
    createCashProfileAndAddToRedisMock.mockResolvedValue(personMock);

    const familyId = await existingAccountHelper(
      databaseMock,
      phoneNumberMock,
      firstNameMock,
      lastNameMock,
      dateOfBirthMock,
      recoveryEmail,
      configurationMock,
      addressMock
    );

    expectToHaveBeenCalledOnceOnlyWith(
      createCashProfileAndAddToRedisMock,
      databaseMock,
      configurationMock,
      firstNameMock,
      lastNameMock,
      dateOfBirthMock,
      phoneNumberMock,
      recoveryEmail,
      addressMock,
      undefined,
      undefined,
      undefined
    );

    expect(familyId).toEqual(primaryMemberFamilyIdMock);
  });

  it('does not create cash profile if cash profile already exists and account does not exist', async () => {
    const primaryMemberFamilyIdMock = 'family-id';
    const personMock: Partial<IPerson> = {
      firstName: 'first-name',
      lastName: 'last-name',
      primaryMemberFamilyId: primaryMemberFamilyIdMock,
      rxGroupType: RxGroupTypesEnum.CASH,
    };
    getAllRecordsForLoggedInPersonMock.mockReturnValue([personMock]);
    createCashProfileAndAddToRedisMock.mockResolvedValue(undefined);

    const familyId = await existingAccountHelper(
      databaseMock,
      '111-222-3333',
      'Johnny',
      'Appleseed',
      '01/01/2020',
      'test@test.com',
      configurationMock,
      addressMock
    );

    expect(createCashProfileAndAddToRedisMock).not.toHaveBeenCalled();
    expect(familyId).toEqual(primaryMemberFamilyIdMock);
  });

  it('calls updatePrescriptionsWithMemberId endpoint only when updatePrescriptionparams is passed and clientPatientid exists', async () => {
    const firstNameMock = 'Johnny';
    const lastNameMock = 'Appleseed';
    const dateOfBirthMock = '01/01/2020';
    const phoneNumberMock = '111-222-3333';
    const recoveryEmail = 'test@test.com';
    const updatedPrescriptionParamsMock = {
      clientPatientId: 'CAJY01',
      rxNo: 'MOCK-RXNUMBER',
      pharmacyManagementSystemPatientId: 'PRIMERX-ID',
      refillNo: 0,
    };

    const personMock: Partial<IPerson> = {
      firstName: 'first-name',
      lastName: 'last-name',
      rxGroupType: RxGroupTypesEnum.CASH,
    };
    getAllRecordsForLoggedInPersonMock.mockReturnValue([]);
    createCashProfileAndAddToRedisMock.mockResolvedValue(personMock);

    updatePrescriptionWithMemberIdMock.mockReturnValueOnce({ success: true });

    await existingAccountHelper(
      databaseMock,
      phoneNumberMock,
      firstNameMock,
      lastNameMock,
      dateOfBirthMock,
      recoveryEmail,
      configurationMock,
      addressMock,
      updatedPrescriptionParamsMock
    );

    expectToHaveBeenCalledOnceOnlyWith(
      createCashProfileAndAddToRedisMock,
      databaseMock,
      configurationMock,
      firstNameMock,
      lastNameMock,
      dateOfBirthMock,
      phoneNumberMock,
      recoveryEmail,
      addressMock,
      undefined,
      undefined,
      undefined
    );
    expectToHaveBeenCalledOnceOnlyWith(
      updatePrescriptionWithMemberIdMock,
      updatedPrescriptionParamsMock,
      configurationMock
    );
  });

  it('utilizes memberID from created cash profile if updatePrescriptionparams is passed with empty clientpatientId', async () => {
    const updatedPrescriptionParamsMock = {
      clientPatientId: '',
      rxNo: 'MOCK-RXNUMBER',
      pharmacyManagementSystemPatientId: 'PRIMERX-ID',
      refillNo: 0,
    };
    const firstNameMock = 'Johnny';
    const lastNameMock = 'Appleseed';
    const dateOfBirthMock = '01/01/2020';
    const phoneNumberMock = '111-222-3333';
    const recoveryEmail = 'test@test.com';
    const primaryMemberFamilyIdMock = 'family-id';
    const memberIdMock = 'member-id';

    const personMock: Partial<IPerson> = {
      firstName: firstNameMock.toUpperCase(),
      lastName: lastNameMock.toUpperCase(),
      dateOfBirth: UTCDateString(dateOfBirthMock),
      primaryMemberFamilyId: primaryMemberFamilyIdMock,
      primaryMemberRxId: memberIdMock,
      rxGroupType: RxGroupTypesEnum.CASH,
    };

    getAllRecordsForLoggedInPersonMock.mockReturnValue([]);
    createCashProfileAndAddToRedisMock.mockResolvedValue(personMock);
    updatePrescriptionWithMemberIdMock.mockReturnValueOnce({ success: true });

    await existingAccountHelper(
      databaseMock,
      phoneNumberMock,
      firstNameMock,
      lastNameMock,
      dateOfBirthMock,
      recoveryEmail,
      configurationMock,
      addressMock,
      updatedPrescriptionParamsMock
    );

    expectToHaveBeenCalledOnceOnlyWith(
      createCashProfileAndAddToRedisMock,
      databaseMock,
      configurationMock,
      firstNameMock,
      lastNameMock,
      dateOfBirthMock,
      phoneNumberMock,
      recoveryEmail,
      addressMock,
      undefined,
      undefined,
      undefined
    );
    expectToHaveBeenCalledOnceOnlyWith(
      updatePrescriptionWithMemberIdMock,
      {
        ...updatedPrescriptionParamsMock,
        clientPatientId: memberIdMock,
      },
      configurationMock
    );
  });
});
