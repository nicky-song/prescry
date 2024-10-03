// Copyright 2020 Prescryptive Health, Inc.

import { searchPersonByPhoneNumber } from '../../../databases/mongo-database/v1/query-helper/person-collection-helper';
import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import { getPhoneRegistrationDataFromRedis } from '../../../databases/redis/redis-query-helper';
import { trackPhoneNumberAssignedToMultipleMembers } from '../../../utils/custom-event-helper';

import { getPersonIdentifiers } from './get-person-identifiers.helper';

const mockPhoneNumber = 'fake-phone';
const mockDatabase = {} as IDatabase;

jest.mock('../../../databases/redis/redis-query-helper');
jest.mock('../../../utils/custom-event-helper');
jest.mock(
  '../../../databases/mongo-database/v1/query-helper/person-collection-helper'
);

const searchPersonByPhoneNumberMock = searchPersonByPhoneNumber as jest.Mock;
const getPhoneRegistrationDataFromRedisMock =
  getPhoneRegistrationDataFromRedis as jest.Mock;
const trackPhoneNumberAssignedToMultipleMembersMock =
  trackPhoneNumberAssignedToMultipleMembers as jest.Mock;

beforeEach(() => {
  searchPersonByPhoneNumberMock.mockReset();
  getPhoneRegistrationDataFromRedisMock.mockReset();
  trackPhoneNumberAssignedToMultipleMembersMock.mockReset();
});

describe('getPersonIdentifiers', () => {
  it('Should return members from database if it exists', async () => {
    searchPersonByPhoneNumberMock.mockReturnValue([
      {
        identifier: 'id-1',
      },
    ]);

    const personIdentifiers = await getPersonIdentifiers(
      mockPhoneNumber,
      mockDatabase
    );

    expect(searchPersonByPhoneNumberMock).toHaveBeenCalledTimes(1);
    expect(searchPersonByPhoneNumberMock).toBeCalledWith(
      mockDatabase,
      mockPhoneNumber
    );
    expect(personIdentifiers).toEqual(['id-1']);
    expect(
      trackPhoneNumberAssignedToMultipleMembersMock
    ).not.toHaveBeenCalled();
    expect(getPhoneRegistrationDataFromRedisMock).not.toHaveBeenCalled();
  });
  it('Should track multiple members assigned to same phone number if multiple person for same phone number exists in database', async () => {
    searchPersonByPhoneNumberMock.mockReturnValue([
      {
        identifier: 'id-1',
      },
      {
        identifier: 'id-2',
      },
    ]);

    const personIdentifiers = await getPersonIdentifiers(
      mockPhoneNumber,
      mockDatabase
    );
    expect(personIdentifiers).toEqual(['id-1', 'id-2']);
    expect(trackPhoneNumberAssignedToMultipleMembersMock).toHaveBeenCalledTimes(
      1
    );
    expect(trackPhoneNumberAssignedToMultipleMembersMock).toHaveBeenCalledWith(
      mockPhoneNumber,
      ['id-1', 'id-2']
    );
    expect(getPhoneRegistrationDataFromRedisMock).not.toHaveBeenCalled();
  });
  it('Should get data from redis if person does not exists in DB', async () => {
    searchPersonByPhoneNumberMock.mockReturnValue(null);
    getPhoneRegistrationDataFromRedisMock.mockReturnValue({
      identifier: 'id-redis',
    });
    const personIdentifiers = await getPersonIdentifiers(
      mockPhoneNumber,
      mockDatabase
    );
    expect(personIdentifiers).toEqual(['id-redis']);

    expect(getPhoneRegistrationDataFromRedisMock).toHaveBeenCalledTimes(1);
    expect(getPhoneRegistrationDataFromRedisMock).toHaveBeenCalledWith(
      mockPhoneNumber
    );
  });
  it('Should return undefiend if person does not exists in DB or redis', async () => {
    searchPersonByPhoneNumberMock.mockReturnValue(null);
    getPhoneRegistrationDataFromRedisMock.mockReturnValue(undefined);
    const personIdentifiers = await getPersonIdentifiers(
      mockPhoneNumber,
      mockDatabase
    );
    expect(personIdentifiers).toEqual(undefined);

    expect(getPhoneRegistrationDataFromRedisMock).toHaveBeenCalledTimes(1);
    expect(getPhoneRegistrationDataFromRedisMock).toHaveBeenCalledWith(
      mockPhoneNumber
    );
  });
});
