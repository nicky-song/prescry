// Copyright 2020 Prescryptive Health, Inc.

import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import { searchAccountByPhoneNumber } from '../../../databases/mongo-database/v1/query-helper/account-collection-helper';

import { pinDetailsCreator } from './pin-creator.helper';

const databaseMock = {} as IDatabase;
const mockPhoneNumber = 'fake-phone';

jest.mock(
  '../../../databases/mongo-database/v1/query-helper/account-collection-helper'
);

const searchAccountByPhoneNumberMock = searchAccountByPhoneNumber as jest.Mock;
const accountMock = {
  accountKey: 'key',
  pinHash: 'pin-hash',
  firstName: 'first-name',
  lastName: 'last-name',
  dateOfBirth: 'dob',
  _id: 'id',
};
beforeEach(() => {
  searchAccountByPhoneNumberMock.mockReset();
});

describe('pinDetailsCreator', () => {
  it('Should return values from account collection if pin is set', async () => {
    searchAccountByPhoneNumberMock.mockReturnValue(accountMock);

    const result = await pinDetailsCreator(databaseMock, mockPhoneNumber);

    expect(searchAccountByPhoneNumber).toHaveBeenCalledTimes(1);
    expect(searchAccountByPhoneNumber).toBeCalledWith(
      databaseMock,
      mockPhoneNumber
    );
    expect(result).toEqual(accountMock);
  });
  it('Should return undefined if account record exists but pin is not set', async () => {
    searchAccountByPhoneNumberMock.mockReturnValue({
      firstName: 'first-name',
      lastName: 'last-name',
    });

    const result = await pinDetailsCreator(databaseMock, mockPhoneNumber);

    expect(searchAccountByPhoneNumber).toHaveBeenCalledTimes(1);
    expect(searchAccountByPhoneNumber).toBeCalledWith(
      databaseMock,
      mockPhoneNumber
    );
    expect(result).toBe(undefined);
  });
  it('Should return undefined if account record does not exists', async () => {
    searchAccountByPhoneNumberMock.mockReturnValue(undefined);

    const result = await pinDetailsCreator(databaseMock, mockPhoneNumber);

    expect(searchAccountByPhoneNumber).toHaveBeenCalledTimes(1);
    expect(searchAccountByPhoneNumber).toBeCalledWith(
      databaseMock,
      mockPhoneNumber
    );
    expect(result).toBe(undefined);
  });
});
