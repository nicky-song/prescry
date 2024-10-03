// Copyright 2021 Prescryptive Health, Inc.

import { IDatabase } from '../setup/setup-database';
import {
  getValidWaitlistForPhoneAndServiceType,
  getRecentWaitlistForPhone,
  getWaitListByIdentifier,
} from './wait-list.query-helper';

const findMock = jest.fn();

const sortMock = jest.fn();
const findOneMock = jest.fn().mockImplementation(() => {
  return {
    sort: sortMock,
  };
});

const databaseMock = {
  Models: {
    WaitListModel: {
      findOne: findOneMock,
      find: findMock,
    },
  },
} as unknown as IDatabase;

describe('getWaitListByIdentifier', () => {
  const identifier = '1234';
  it('should call findOne() with required params', () => {
    getWaitListByIdentifier(databaseMock, identifier);
    expect(findOneMock).toHaveBeenCalledWith(
      { identifier: '1234' },
      'identifier phoneNumber location serviceType status invitation'
    );
  });
});

describe('getValidWaitlistForPhoneAndServiceType', () => {
  const phoneNumber = 'phone';
  const serviceType = 'test-service-type';

  it('should call find() with required params', () => {
    getValidWaitlistForPhoneAndServiceType(
      databaseMock,
      phoneNumber,
      serviceType
    );
    expect(findMock).toHaveBeenCalledWith(
      {
        phoneNumber: 'phone',
        serviceType: 'test-service-type',
        status: { $in: ['invited', '', undefined] },
      },
      'identifier phoneNumber location serviceType status invitation firstName lastName dateOfBirth'
    );
  });
});

describe('getRecentWaitlistForPhone', () => {
  const phoneNumber = 'phone';

  it('should call findOne() with required params', () => {
    getRecentWaitlistForPhone(databaseMock, phoneNumber);
    expect(findOneMock).toHaveBeenCalledWith(
      {
        phoneNumber: 'phone',
        status: { $nin: ['cancelled', 'canceled'] },
      },
      'identifier phoneNumber location serviceType status invitation firstName lastName dateOfBirth'
    );
  });
});
