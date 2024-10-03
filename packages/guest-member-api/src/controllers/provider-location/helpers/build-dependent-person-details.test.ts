// Copyright 2021 Prescryptive Health, Inc.

import {
  IDependentInformation,
  IMemberAddress,
} from '@phx/common/src/models/api-request-body/create-booking.request-body';
import { IPerson } from '@phx/common/src/models/person';
import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import { buildDependentPersonDetails } from './build-dependent-person-details';
import { getNextAvailablePersonCode } from '../../../utils/person/get-dependent-person.helper';
import moment from 'moment';
import {
  addPersonCreationKeyInRedis,
  getPersonCreationDataFromRedis,
} from '../../../databases/redis/redis-query-helper';
import { publishPersonCreateMessage } from '../../../utils/service-bus/person-update-helper';
import { UTCDateString } from '@phx/common/src/utils/date-time-helper';
import { ErrorConstants } from '../../../constants/response-messages';
import { assertHasFamilyId } from '../../../assertions/assert-has-family-id';
import { assertHasPersonCode } from '../../../assertions/assert-has-person-code';

jest.mock('@phx/common/src/utils/date-time-helper');
jest.mock('../../../utils/service-bus/person-update-helper');
jest.mock('../../../databases/redis/redis-query-helper');
jest.mock('../../../utils/person/get-dependent-person.helper');
jest.mock('../../../assertions/assert-has-family-id');
jest.mock('../../../assertions/assert-has-person-code');

const addPersonCreationKeyInRedisMock =
  addPersonCreationKeyInRedis as jest.Mock;
const publishPersonCreateMessageMock = publishPersonCreateMessage as jest.Mock;
const utcDateStringMock = UTCDateString as jest.Mock;
const getNextAvailablePersonCodeMock = getNextAvailablePersonCode as jest.Mock;
const getPersonCreationDataFromRedisMock =
  getPersonCreationDataFromRedis as jest.Mock;
const assertHasFamilyIdMock = assertHasFamilyId as jest.Mock;
const assertHasPersonCodeMock = assertHasPersonCode as jest.Mock;

const databaseMock = {} as IDatabase;

const masterIdMock = 'master-id';
const accountIdMock = 'account-id';

const parentInfoMock = {
  phoneNumber: 'mock-phone',
  firstName: 'FAKE-FIRSTNAME',
  lastName: 'FAKE-LASTNAME',
  identifier: '',
  rxSubGroup: 'CASH01',
  rxGroup: '200P32F',
  primaryMemberRxId: 'CAJ1DLLQ01',
  primaryMemberFamilyId: 'CAJ1DLLQ',
  rxGroupType: 'CASH',
  rxBin: '610749',
  carrierPCN: 'X01',
  isPhoneNumberVerified: true,
  isPrimary: true,
  email: '',
  primaryMemberPersonCode: '01',
  address1: 'PERSON-ADDR1',
  address2: 'PERSON-ADDR2',
  county: 'FAKE-COUNTY',
  state: 'WA',
  zip: '1111',
  city: 'FAKE-CITY',
  isTestMembership: false,
  dateOfBirth: '2000-02-02',
} as unknown as IPerson;

const dependentInfoMock: IDependentInformation = {
  firstName: 'dep-firstname',
  lastName: 'dep-lastname',
  addressSameAsParent: true,
  dateOfBirth: 'February-03-2015',
};
const newDependentResponseMock = {
  phoneNumber: '',
  firstName: 'DEP-FIRSTNAME',
  lastName: 'DEP-LASTNAME',
  identifier: '',
  rxSubGroup: 'CASH01',
  rxGroup: '200P32F',
  primaryMemberRxId: 'CAJ1DLLQ04',
  primaryMemberFamilyId: 'CAJ1DLLQ',
  rxGroupType: 'CASH',
  rxBin: '610749',
  carrierPCN: 'X01',
  isPhoneNumberVerified: false,
  isPrimary: false,
  email: '',
  primaryMemberPersonCode: '04',
  address1: 'PERSON-ADDR1',
  address2: 'PERSON-ADDR2',
  county: 'FAKE-COUNTY',
  state: 'WA',
  zip: '1111',
  city: 'FAKE-CITY',
  isTestMembership: false,
  dateOfBirth: '2015-02-02',
  effectiveDate: moment(new Date().toUTCString()).format('YYYYMMDD'),
  masterId: masterIdMock,
  accountId: accountIdMock,
} as unknown as IPerson;

const redisexpiryTimeMock = 3600;
describe('buildDependentPersonDetails', () => {
  beforeEach(() => {
    getNextAvailablePersonCodeMock.mockReset();
    utcDateStringMock.mockReset();
    utcDateStringMock.mockReturnValue('2015-02-02');
    publishPersonCreateMessageMock.mockReset();
    addPersonCreationKeyInRedisMock.mockReset();
  });

  it('builds dependent person details for a new dependent and publish it to the topic from the given dependent information', async () => {
    getNextAvailablePersonCodeMock.mockReturnValueOnce('04');
    getPersonCreationDataFromRedisMock.mockReturnValueOnce(null);

    const actual = await buildDependentPersonDetails(
      dependentInfoMock,
      databaseMock,
      parentInfoMock,
      redisexpiryTimeMock,
      undefined,
      masterIdMock,
      accountIdMock
    );
    expect(publishPersonCreateMessageMock).toBeCalledWith(
      newDependentResponseMock
    );
    expect(addPersonCreationKeyInRedisMock).toHaveBeenCalledWith(
      'mock-phone',
      [newDependentResponseMock],
      redisexpiryTimeMock
    );
    expect(actual).toEqual(newDependentResponseMock);
  });

  it.each([['1001'], ['1000']])(
    'Does not build dependent person details for a new dependent if next available person code is more than 999',
    async (nextPersonCode) => {
      getNextAvailablePersonCodeMock.mockReturnValueOnce(nextPersonCode);

      try {
        await buildDependentPersonDetails(
          dependentInfoMock,
          databaseMock,
          parentInfoMock,
          redisexpiryTimeMock,
          undefined,
          masterIdMock,
          accountIdMock
        );
      } catch (ex) {
        expect(ex).toEqual(
          new Error(ErrorConstants.MAX_DEPENDENT_LIMIT_REACHED)
        );
      }

      const expectedFamilyId = 'CAJ1DLLQ';
      const expectedPersonCode = '04';

      expect(assertHasFamilyIdMock).toHaveBeenCalledWith(expectedFamilyId);
      expect(assertHasPersonCodeMock).toHaveBeenCalledWith(expectedPersonCode);

      expect(publishPersonCreateMessageMock).not.toBeCalled();
      expect(addPersonCreationKeyInRedisMock).not.toBeCalled();
    }
  );
  it('doesnt build dependent person details again for an existing dependent', async () => {
    const existingDependentInfoMock = {
      phoneNumber: 'mock-phone',
      firstName: 'dep-first-name',
      lastName: 'DEP-LASTNAME',
      identifier: '',
      rxSubGroup: 'CASH01',
      rxGroup: '200P32F',
      primaryMemberRxId: 'CAJ1DLLQ02',
      primaryMemberFamilyId: 'CAJ1DLLQ',
      rxGroupType: 'CASH',
      rxBin: '610749',
      carrierPCN: 'X01',
      isPhoneNumberVerified: true,
      isPrimary: true,
      email: '',
      primaryMemberPersonCode: '01',
      address1: 'PERSON-ADDR1',
      address2: 'PERSON-ADDR2',
      county: 'FAKE-COUNTY',
      state: 'WA',
      zip: '1111',
      city: 'FAKE-CITY',
      isTestMembership: false,
      dateOfBirth: '2015-02-02',
    } as unknown as IPerson;

    const response = await buildDependentPersonDetails(
      dependentInfoMock,
      databaseMock,
      parentInfoMock,
      redisexpiryTimeMock,
      existingDependentInfoMock,
      masterIdMock,
      accountIdMock
    );

    expect(response).toEqual(existingDependentInfoMock);
    expect(getNextAvailablePersonCodeMock).not.toBeCalled();
    expect(publishPersonCreateMessageMock).not.toBeCalled();
    expect(addPersonCreationKeyInRedisMock).not.toBeCalled();
  });

  it('Adds dependent details to the parent information in the redis if parent info already exists in the redis', async () => {
    getNextAvailablePersonCodeMock.mockReturnValueOnce('04');

    const parentInfoArray = [parentInfoMock];
    getPersonCreationDataFromRedisMock.mockReturnValueOnce(parentInfoArray);
    await buildDependentPersonDetails(
      dependentInfoMock,
      databaseMock,
      parentInfoMock,
      redisexpiryTimeMock,
      undefined,
      masterIdMock,
      accountIdMock
    );
    expect(publishPersonCreateMessageMock).toBeCalledWith(
      newDependentResponseMock
    );

    expect(addPersonCreationKeyInRedisMock).toHaveBeenCalledWith(
      'mock-phone',
      parentInfoArray,
      redisexpiryTimeMock
    );
  });

  it('Inserts person creation key in redis if parent info doesnt exist in the redis', async () => {
    getNextAvailablePersonCodeMock.mockReturnValueOnce('04');
    getPersonCreationDataFromRedisMock.mockReturnValueOnce(null);
    await buildDependentPersonDetails(
      dependentInfoMock,
      databaseMock,
      parentInfoMock,
      redisexpiryTimeMock,
      undefined,
      masterIdMock,
      accountIdMock
    );
    expect(publishPersonCreateMessageMock).toBeCalledWith(
      newDependentResponseMock
    );

    expect(addPersonCreationKeyInRedisMock).toHaveBeenCalledWith(
      parentInfoMock.phoneNumber,
      [newDependentResponseMock],
      redisexpiryTimeMock
    );
  });

  it('trims spaces  in name and address fields and converts to uppercase before publishing it to the topic', async () => {
    const dependentInfoMockWithSpaces: IDependentInformation = {
      firstName: '   dep-firstname   ',
      lastName: ' dep-lastname        ',
      addressSameAsParent: true,
      dateOfBirth: 'February-03-2015',
    };
    getNextAvailablePersonCodeMock.mockReturnValueOnce('04');
    getPersonCreationDataFromRedisMock.mockReturnValueOnce(null);
    await buildDependentPersonDetails(
      dependentInfoMockWithSpaces,
      databaseMock,
      parentInfoMock,
      redisexpiryTimeMock,
      undefined,
      masterIdMock,
      accountIdMock
    );
    expect(publishPersonCreateMessageMock).toBeCalledWith(
      newDependentResponseMock
    );
    expect(addPersonCreationKeyInRedisMock).toHaveBeenCalledWith(
      'mock-phone',
      [newDependentResponseMock],
      redisexpiryTimeMock
    );
  });

  it('uses dependent address if dependent addressSameAsParent field is set to false ', async () => {
    getNextAvailablePersonCodeMock.mockReturnValueOnce('03');
    getPersonCreationDataFromRedisMock.mockReturnValueOnce(null);
    utcDateStringMock.mockReturnValue('2006-02-03');
    const dependentInfoMockWithSpaces: IDependentInformation = {
      firstName: '   first-name   ',
      lastName: ' dep-lastname        ',
      addressSameAsParent: false,
      dateOfBirth: 'February-03-2006',
      address: {
        address1: 'address1  ',
        city: 'Renton',
        state: 'WA',
        county: '        KING',
        zip: '98055',
      } as IMemberAddress,
    };

    const responseMock = {
      phoneNumber: '',
      firstName: 'FIRST-NAME',
      lastName: 'DEP-LASTNAME',
      identifier: '',
      rxSubGroup: 'CASH01',
      rxGroup: '200P32F',
      primaryMemberRxId: 'CAJ1DLLQ03',
      primaryMemberFamilyId: 'CAJ1DLLQ',
      rxGroupType: 'CASH',
      rxBin: '610749',
      carrierPCN: 'X01',
      isPhoneNumberVerified: false,
      isPrimary: false,
      email: '',
      primaryMemberPersonCode: '03',
      address1: 'ADDRESS1',
      address2: '',
      county: 'KING',
      state: 'WA',
      zip: '98055',
      city: 'RENTON',
      isTestMembership: false,
      dateOfBirth: '2006-02-03',
      effectiveDate: moment(new Date().toUTCString()).format('YYYYMMDD'),
      masterId: masterIdMock,
      accountId: accountIdMock,
    } as unknown as IPerson;

    await buildDependentPersonDetails(
      dependentInfoMockWithSpaces,
      databaseMock,
      parentInfoMock,
      redisexpiryTimeMock,
      undefined,
      masterIdMock,
      accountIdMock
    );
    expect(publishPersonCreateMessageMock).toBeCalledWith(responseMock);
    expect(addPersonCreationKeyInRedisMock).toHaveBeenCalledWith(
      'mock-phone',
      [responseMock],
      redisexpiryTimeMock
    );
  });
});
