// Copyright 2020 Prescryptive Health, Inc.

import { IDatabase } from '../../databases/mongo-database/v1/setup/setup-database';
import { IPerson } from '@phx/common/src/models/person';
import {
  searchPersonByPhoneNumber,
  searchPersonByIdentifier,
} from '../../databases/mongo-database/v1/query-helper/person-collection-helper';
import { getFirstOrDefault, sortMemberByPersonCode } from './person-helper';
import {
  getPhoneRegistrationDataFromRedis,
  getPersonCreationDataFromRedis,
} from '../../databases/redis/redis-query-helper';

import {
  getAllRecordsForLoggedInPerson,
  getLoggedInPerson,
} from './get-logged-in-person.helper';
import { RxGroupTypesEnum } from '@phx/common/src/models/member-profile/member-profile-info';

jest.mock(
  '../../databases/mongo-database/v1/query-helper/person-collection-helper'
);
jest.mock('./person-helper');
jest.mock('../../databases/redis/redis-query-helper');

const searchPersonByPhoneNumberMock = searchPersonByPhoneNumber as jest.Mock;
const searchPersonByIdentifierMock = searchPersonByIdentifier as jest.Mock;
const getFirstOrDefaultMock = getFirstOrDefault as jest.Mock;
const sortMemberByPersonCodeMock = sortMemberByPersonCode as jest.Mock;
const getPhoneRegistrationDataFromRedisMock =
  getPhoneRegistrationDataFromRedis as jest.Mock;
const getPersonCreationDataFromRedisMock =
  getPersonCreationDataFromRedis as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});
const mockPhoneNumber = 'fake-phone';
const mockDatabase = {} as IDatabase;

describe('getLoggedInPerson', () => {
  it('should return primary person from database if it exists in DB', async () => {
    const personList: IPerson[] = [
      {
        identifier: 'id-1',
        firstName: 'fake-first',
        lastName: 'fake-last',
        dateOfBirth: '01-01-2000',
        phoneNumber: 'fake-phone',
        isPhoneNumberVerified: true,
        primaryMemberRxId: 'rxid-01',
        isPrimary: true,
        email: 'email',
        primaryMemberPersonCode: '01',
        rxGroupType: RxGroupTypesEnum.CASH,
        rxGroup: 'rx-group',
        rxBin: 'bin',
        carrierPCN: 'pcn01',
      },
      {
        identifier: 'id-2',
        firstName: 'fake-first',
        lastName: 'fake-last',
        dateOfBirth: '01-01-2000',
        phoneNumber: 'fake-phone',
        isPhoneNumberVerified: true,
        primaryMemberRxId: 'rxid-02',
        isPrimary: false,
        email: 'email',
        primaryMemberPersonCode: '02',
        rxGroupType: RxGroupTypesEnum.CASH,
        rxGroup: 'rx-group',
        rxBin: 'bin',
        carrierPCN: 'pcn01',
      },
    ];

    searchPersonByPhoneNumberMock.mockReturnValueOnce(personList);
    getFirstOrDefaultMock.mockReturnValueOnce(personList[0]);
    const loggedInMember = await getLoggedInPerson(
      mockDatabase,
      mockPhoneNumber
    );
    expect(searchPersonByPhoneNumberMock).toHaveBeenCalledWith(
      mockDatabase,
      mockPhoneNumber
    );
    expect(getPhoneRegistrationDataFromRedisMock).not.toHaveBeenCalled();
    expect(searchPersonByIdentifierMock).not.toHaveBeenCalled();
    expect(getFirstOrDefaultMock).toHaveBeenCalledWith(
      personList,
      sortMemberByPersonCodeMock
    );
    expect(loggedInMember).toEqual(personList[0]);
  });
  it('should should look for person in redis if phonenumber does not exists in DB', async () => {
    const personRedis = {
      identifier: 'id-1',
      firstName: 'fake-first',
      lastName: 'fake-last',
      dateOfBirth: '01-01-2000',
    };
    const personDb = {} as IPerson;
    searchPersonByPhoneNumberMock.mockReturnValueOnce(null);
    getPhoneRegistrationDataFromRedisMock.mockReturnValueOnce(personRedis);
    searchPersonByIdentifierMock.mockReturnValueOnce(personDb);
    const loggedInMember = await getLoggedInPerson(
      mockDatabase,
      mockPhoneNumber
    );
    expect(getFirstOrDefaultMock).not.toHaveBeenCalled();
    expect(getPhoneRegistrationDataFromRedisMock).toHaveBeenCalledWith(
      mockPhoneNumber
    );
    expect(searchPersonByIdentifierMock).toHaveBeenCalledWith(
      mockDatabase,
      'id-1'
    );
    expect(loggedInMember).toEqual(personDb);
  });
  it('should should return undefined if person does not exists in redis or DB', async () => {
    searchPersonByPhoneNumberMock.mockReturnValueOnce(null);
    getPhoneRegistrationDataFromRedisMock.mockReturnValueOnce(undefined);
    const loggedInMember = await getLoggedInPerson(
      mockDatabase,
      mockPhoneNumber
    );
    expect(getFirstOrDefaultMock).not.toHaveBeenCalled();
    expect(searchPersonByIdentifierMock).not.toHaveBeenCalled();
    expect(getPhoneRegistrationDataFromRedisMock).toHaveBeenCalledWith(
      mockPhoneNumber
    );
    expect(loggedInMember).toEqual(undefined);
  });
});

describe('getAllRecordsForLoggedInPerson', () => {
  it('should return all records for person from database if it exists in DB', async () => {
    const personList: IPerson[] = [
      {
        identifier: 'id-1',
        firstName: 'fake-first',
        lastName: 'fake-last',
        dateOfBirth: '01-01-2000',
        phoneNumber: 'fake-phone',
        isPhoneNumberVerified: true,
        primaryMemberRxId: 'rxid-01',
        isPrimary: true,
        email: 'email',
        primaryMemberPersonCode: '01',
        rxGroupType: RxGroupTypesEnum.CASH,
        rxGroup: 'rx-group',
        rxBin: 'bin',
        carrierPCN: 'pcn01',
      },
      {
        identifier: 'id-2',
        firstName: 'fake-first',
        lastName: 'fake-last',
        dateOfBirth: '01-01-2000',
        phoneNumber: 'fake-phone',
        isPhoneNumberVerified: true,
        primaryMemberRxId: 'rxid-02',
        isPrimary: false,
        email: 'email',
        primaryMemberPersonCode: '02',
        rxGroupType: RxGroupTypesEnum.CASH,
        rxGroup: 'rx-group',
        rxBin: 'bin',
        carrierPCN: 'pcn01',
      },
    ];

    searchPersonByPhoneNumberMock.mockReturnValueOnce(personList);
    const loggedInMember = await getAllRecordsForLoggedInPerson(
      mockDatabase,
      mockPhoneNumber
    );
    expect(searchPersonByPhoneNumberMock).toHaveBeenCalledWith(
      mockDatabase,
      mockPhoneNumber
    );
    expect(getPhoneRegistrationDataFromRedisMock).not.toHaveBeenCalled();
    expect(searchPersonByIdentifierMock).not.toHaveBeenCalled();
    expect(loggedInMember).toEqual(personList);
  });
  it('should should look for person in redis for phone registration key if phonenumber does not exists in DB', async () => {
    const personRedis = {
      identifier: 'id-1',
      firstName: 'fake-first',
      lastName: 'fake-last',
      dateOfBirth: '01-01-2000',
    };
    const personDb = {} as IPerson;
    searchPersonByPhoneNumberMock.mockReturnValueOnce(null);
    getPhoneRegistrationDataFromRedisMock.mockReturnValueOnce(personRedis);
    searchPersonByIdentifierMock.mockReturnValueOnce(personDb);
    const loggedInMember = await getAllRecordsForLoggedInPerson(
      mockDatabase,
      mockPhoneNumber
    );
    expect(getPhoneRegistrationDataFromRedisMock).toHaveBeenCalledWith(
      mockPhoneNumber
    );
    expect(searchPersonByIdentifierMock).toHaveBeenCalledWith(
      mockDatabase,
      'id-1'
    );
    expect(loggedInMember).toEqual([personDb]);
  });
  it('should should look for person in redis for create person key if phonenumber does not exists in DB and phone registration key does not exists', async () => {
    const primaryPerson = {
      firstName: 'fake-first',
      lastName: 'fake-last',
      dateOfBirth: '01-01-2000',
      isPrimary: true,
    };
    const personListInRedis = [
      primaryPerson,
      {
        firstName: 'fake-first2',
        lastName: 'fake-last2',
        dateOfBirth: '01-01-2001',
        isPrimary: false,
      },
    ];
    searchPersonByPhoneNumberMock.mockReturnValueOnce(null);
    getPhoneRegistrationDataFromRedisMock.mockReturnValueOnce(undefined);

    getPersonCreationDataFromRedisMock.mockReturnValueOnce(personListInRedis);

    const loggedInMember = await getAllRecordsForLoggedInPerson(
      mockDatabase,
      mockPhoneNumber
    );
    expect(getPhoneRegistrationDataFromRedisMock).toHaveBeenCalledWith(
      mockPhoneNumber
    );
    expect(getPersonCreationDataFromRedisMock).toHaveBeenCalledWith(
      mockPhoneNumber
    );
    expect(searchPersonByIdentifierMock).not.toHaveBeenCalled();
    expect(loggedInMember).toEqual([primaryPerson]);
  });
  it('should should return null if person does not exists in both redis keys or DB', async () => {
    searchPersonByPhoneNumberMock.mockReturnValueOnce(null);
    getPhoneRegistrationDataFromRedisMock.mockReturnValueOnce(undefined);
    getPersonCreationDataFromRedisMock.mockReturnValueOnce(undefined);
    const loggedInMember = await getAllRecordsForLoggedInPerson(
      mockDatabase,
      mockPhoneNumber
    );
    expect(searchPersonByIdentifierMock).not.toHaveBeenCalled();
    expect(getPhoneRegistrationDataFromRedisMock).toHaveBeenCalledWith(
      mockPhoneNumber
    );
    expect(loggedInMember).toEqual([]);
  });
});
