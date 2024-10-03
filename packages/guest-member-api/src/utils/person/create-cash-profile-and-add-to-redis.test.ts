// Copyright 2021 Prescryptive Health, Inc.

import { createCashProfileAndAddToRedis } from './create-cash-profile-and-add-to-redis';
import {
  createPersonHelper,
  generatePrimaryMemberFamilyId,
} from './person-creation.helper';
import { publishPersonCreateMessage } from '../service-bus/person-update-helper';
import {
  addPersonCreationKeyInRedis,
  getPersonCreationDataFromRedis,
} from '../../databases/redis/redis-query-helper';
import { IPerson } from '@phx/common/src/models/person';
import { IMemberAddress } from '@phx/common/src/models/api-request-body/create-booking.request-body';
import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';
import { RxGroupTypesEnum } from '@phx/common/src/models/member-profile/member-profile-info';
import { databaseMock } from '../../mock-data/database.mock';
import { configurationMock } from '../../mock-data/configuration.mock';

jest.mock('./person-creation.helper');
const createPersonHelperMock = createPersonHelper as jest.Mock;
const generatePrimaryMemberFamilyIdMock =
  generatePrimaryMemberFamilyId as jest.Mock;

jest.mock('../service-bus/person-update-helper');
const publishPersonCreateMessageMock = publishPersonCreateMessage as jest.Mock;

jest.mock('../../databases/redis/redis-query-helper');
const getPersonCreationDataFromRedisMock =
  getPersonCreationDataFromRedis as jest.Mock;
const addPersonCreationKeyInRedisMock =
  addPersonCreationKeyInRedis as jest.Mock;

describe('createCashProfile', () => {
  const firstNameMock = 'Test';
  const lastNameMock = 'Testing';
  const dateOfBirthMock = '01/01/1999';
  const phoneNumberMock = '+12223334444';
  const recoveryEmailMock = 'test@test.com';
  const cashPersonMock: IPerson = {
    dateOfBirth: '1990-01-01',
    email: 'mockEmail',
    firstName: 'John',
    identifier: '',
    isPhoneNumberVerified: true,
    isPrimary: true,
    lastName: 'mockLastName',
    phoneNumber: 'mockPhoneNumber',
    primaryMemberFamilyId: 'family-id',
    primaryMemberPersonCode: 'person-code-id1',
    primaryMemberRxId: 'mock-id1',
    rxGroupType: RxGroupTypesEnum.CASH,
    rxGroup: 'group1',
    rxBin: 'rx-bin',
    carrierPCN: 'pcn',
  };

  const siePersonMock = {
    email: 'fake_email',
    firstName: 'fake_firstName',
    lastName: 'fake_lastName',
    identifier: 'fake-identifier',
    phoneNumber: 'fake_phoneNumber',
    primaryMemberRxId: 'fake_primaryMemberRxId',
    rxGroupType: RxGroupTypesEnum.SIE,
    rxSubGroup: 'HMA01',
    dateOfBirth: '2000-01-01',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    createPersonHelperMock.mockReturnValue(cashPersonMock);
  });

  it.each([[undefined], ['familyId']])(
    'calls createPersonHelper to build a cash profile for the user (familyId: %p)',
    async (familyIdMock: string | undefined) => {
      const masterIdMock = 'master-id';
      const patientAccountIdMock = 'patient-account';

      const generatedFamilyIdMock = 'generated-family-id';
      generatePrimaryMemberFamilyIdMock.mockResolvedValue(
        generatedFamilyIdMock
      );

      const actual = await createCashProfileAndAddToRedis(
        databaseMock,
        configurationMock,
        firstNameMock,
        lastNameMock,
        dateOfBirthMock,
        phoneNumberMock,
        recoveryEmailMock,
        undefined,
        masterIdMock,
        patientAccountIdMock,
        familyIdMock
      );

      const expectedFamilyId = familyIdMock ?? generatedFamilyIdMock;

      if (!familyIdMock) {
        expectToHaveBeenCalledOnceOnlyWith(
          generatePrimaryMemberFamilyIdMock,
          databaseMock,
          configurationMock
        );
      } else {
        expect(generatePrimaryMemberFamilyIdMock).not.toHaveBeenCalled();
      }

      expectToHaveBeenCalledOnceOnlyWith(
        createPersonHelperMock,
        expectedFamilyId,
        firstNameMock,
        lastNameMock,
        dateOfBirthMock,
        phoneNumberMock,
        recoveryEmailMock,
        undefined,
        masterIdMock,
        patientAccountIdMock
      );

      expect(actual).toEqual(cashPersonMock);
    }
  );

  it('calls createPersonHelper to build a cash profile with address for the user.', async () => {
    const memberAddress: IMemberAddress = {
      address1: 'address1Mock',
      address2: 'address2Mock',
      county: 'countyMock',
      city: 'cityMock',
      state: 'stateMock',
      zip: 'zipMock',
    };

    const masterIdMock = 'master-id';
    const patientAccountIdMock = 'patient-account';
    const familyIdMock = 'family-id';

    const actual = await createCashProfileAndAddToRedis(
      databaseMock,
      configurationMock,
      firstNameMock,
      lastNameMock,
      dateOfBirthMock,
      phoneNumberMock,
      recoveryEmailMock,
      memberAddress,
      masterIdMock,
      patientAccountIdMock,
      familyIdMock
    );

    expectToHaveBeenCalledOnceOnlyWith(
      createPersonHelperMock,
      familyIdMock,
      firstNameMock,
      lastNameMock,
      dateOfBirthMock,
      phoneNumberMock,
      recoveryEmailMock,
      memberAddress,
      masterIdMock,
      patientAccountIdMock
    );

    expect(actual).toEqual(cashPersonMock);
  });

  it('publishes message to service bus to create a cash profile for the user.', async () => {
    await createCashProfileAndAddToRedis(
      databaseMock,
      configurationMock,
      firstNameMock,
      lastNameMock,
      dateOfBirthMock,
      phoneNumberMock,
      recoveryEmailMock
    );
    expectToHaveBeenCalledOnceOnlyWith(
      publishPersonCreateMessageMock,
      cashPersonMock
    );
  });

  it('gets person record from redis for phone number if exists and push cash profile to it', async () => {
    getPersonCreationDataFromRedisMock.mockReturnValueOnce([siePersonMock]);
    await createCashProfileAndAddToRedis(
      databaseMock,
      configurationMock,
      firstNameMock,
      lastNameMock,
      dateOfBirthMock,
      phoneNumberMock,
      recoveryEmailMock
    );
    expectToHaveBeenCalledOnceOnlyWith(
      addPersonCreationKeyInRedisMock,
      phoneNumberMock,
      [siePersonMock, cashPersonMock],
      configurationMock.redisPersonCreateKeyExpiryTime
    );
  });

  it('creates person record in redis for phone number if doesnt exist', async () => {
    getPersonCreationDataFromRedisMock.mockReturnValueOnce(undefined);
    await createCashProfileAndAddToRedis(
      databaseMock,
      configurationMock,
      firstNameMock,
      lastNameMock,
      dateOfBirthMock,
      phoneNumberMock,
      recoveryEmailMock
    );
    expectToHaveBeenCalledOnceOnlyWith(
      addPersonCreationKeyInRedisMock,
      phoneNumberMock,
      [cashPersonMock],
      configurationMock.redisPersonCreateKeyExpiryTime
    );
  });
});
