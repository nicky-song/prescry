// Copyright 2018 Prescryptive Health, Inc.

import { IConfiguration } from '../configuration';
import { searchAccountByPhoneNumber } from '../databases/mongo-database/v1/query-helper/account-collection-helper';
import { IDatabase } from '../databases/mongo-database/v1/setup/setup-database';
import {
  addDeviceKeyInRedis,
  addPinVerificationKeyInRedis,
  getAccountCreationDataFromRedis,
  getPinDataFromRedis,
} from '../databases/redis/redis-query-helper';
import { generateSalt } from '../utils/bcryptjs-helper';
import { generateJsonWebToken } from './jwt-device-helper';
import { createRandomString } from './string-helper';
import { generateDeviceToken, createDeviceToken } from './verify-device-helper';

jest.mock(
  '../databases/mongo-database/v1/query-helper/account-collection-helper',
  () => ({
    searchAccountByPhoneNumber: jest.fn(),
  })
);

jest.mock('../utils/redis/redis.helper', () => ({
  RedisKeys: { PHONE_KEY: 'PHONE_KEY', PIN_KEY: 'PIN_KEY' },
  deviceTokenKeyExpiryIn: 2592000,
  getValueFromRedis: jest.fn(),
  pinVerificationKeyExpiryIn: 30,
}));

jest.mock('../utils/jwt-device-helper', () => ({
  generateJsonWebToken: jest.fn(),
}));

jest.mock('../utils/string-helper', () => ({
  createRandomString: jest.fn().mockReturnValue('random-string'),
}));

jest.mock('../utils/bcryptjs-helper', () => ({
  generateSalt: jest.fn().mockImplementation(() => 'new-encrypted-salt'),
}));

jest.mock('../databases/redis/redis-query-helper');

const phoneNumberMock = '+11111111111';

const configurationMock = {
  deviceTokenExpiryTime: 10,
  jwtTokenSecretKey: 'mock-secretKey',
  twilioVerificationServiceId: 'mock-serviceId',
} as IConfiguration;

const databaseMock = {} as IDatabase;
const searchAccountByPhoneNumberMock = searchAccountByPhoneNumber as jest.Mock;
const generateJsonWebTokenMock = generateJsonWebToken as jest.Mock;
const createRandomStringMock = createRandomString as jest.Mock;
const addDeviceKeyInRedisMock = addDeviceKeyInRedis as jest.Mock;
const getAccountCreationDataFromRedisMock =
  getAccountCreationDataFromRedis as jest.Mock;
const getPinDataFromRedisMock = getPinDataFromRedis as jest.Mock;
const addPinVerificationKeyInRedisMock =
  addPinVerificationKeyInRedis as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('generateDeviceToken()', () => {
  it('should return account, accountKey,token and recoveryEmail(if exists) on success', async () => {
    searchAccountByPhoneNumberMock.mockReturnValueOnce({
      accountKey: 'account-Key',
      phoneNumber: phoneNumberMock,
      recoveryEmail: 'abc@test.com',
    });
    generateJsonWebTokenMock.mockReturnValue('device-token');

    const response = await generateDeviceToken(
      phoneNumberMock,
      configurationMock,
      databaseMock
    );

    expect(createRandomStringMock).toHaveBeenCalled();
    expect(generateJsonWebTokenMock).toHaveBeenCalledWith(
      {
        device: '+11111111111',
        deviceIdentifier: 'random-string',
        deviceKey: 'account-Key',
        deviceType: 'phone',
      },
      configurationMock.jwtTokenSecretKey,
      configurationMock.deviceTokenExpiryTime
    );

    expect(addDeviceKeyInRedisMock).toHaveBeenNthCalledWith(
      1,
      phoneNumberMock,
      'device-token',
      2592000,
      'random-string'
    );

    expect(addPinVerificationKeyInRedisMock).toHaveBeenNthCalledWith(
      1,
      phoneNumberMock,
      30,
      'random-string'
    );

    expect(response).toEqual({
      account: {
        accountKey: 'account-Key',
        phoneNumber: '+11111111111',
        recoveryEmail: 'abc@test.com',
      },
      accountKey: 'account-Key',
      token: 'device-token',
      recoveryEmailExists: true,
    });
  });

  it('should return account, accountKey and token on success when recoveryEmail doesnt exist in account ', async () => {
    searchAccountByPhoneNumberMock.mockReturnValueOnce({
      accountKey: 'account-Key',
      phoneNumber: phoneNumberMock,
    });
    generateJsonWebTokenMock.mockReturnValue('device-token');

    const response = await generateDeviceToken(
      phoneNumberMock,
      configurationMock,
      databaseMock
    );

    expect(createRandomStringMock).toHaveBeenCalled();
    expect(generateJsonWebTokenMock).toHaveBeenCalledWith(
      {
        device: '+11111111111',
        deviceIdentifier: 'random-string',
        deviceKey: 'account-Key',
        deviceType: 'phone',
      },
      configurationMock.jwtTokenSecretKey,
      configurationMock.deviceTokenExpiryTime
    );

    expect(addDeviceKeyInRedisMock).toHaveBeenNthCalledWith(
      1,
      phoneNumberMock,
      'device-token',
      2592000,
      'random-string'
    );

    expect(addPinVerificationKeyInRedisMock).toHaveBeenNthCalledWith(
      1,
      phoneNumberMock,
      30,
      'random-string'
    );

    expect(response).toEqual({
      account: { accountKey: 'account-Key', phoneNumber: '+11111111111' },
      accountKey: 'account-Key',
      token: 'device-token',
      recoveryEmailExists: false,
    });
  });

  it("should call getPinDataFromRedis if account doesn't have accountKey", async () => {
    searchAccountByPhoneNumberMock.mockReturnValueOnce({
      phoneNumber: phoneNumberMock,
    });

    getPinDataFromRedisMock.mockReturnValueOnce({
      accountKey: 'account-Key-in-redis',
    });
    generateJsonWebTokenMock.mockReturnValue('device-token');

    const response = await generateDeviceToken(
      phoneNumberMock,
      configurationMock,
      databaseMock
    );

    expect(getPinDataFromRedisMock).toHaveBeenNthCalledWith(1, phoneNumberMock);

    expect(generateSalt).not.toBeCalled();
    expect(createRandomStringMock).toHaveBeenCalled();
    expect(generateJsonWebTokenMock).toHaveBeenCalledWith(
      {
        device: '+11111111111',
        deviceIdentifier: 'random-string',
        deviceKey: 'account-Key-in-redis',
        deviceType: 'phone',
      },
      configurationMock.jwtTokenSecretKey,
      configurationMock.deviceTokenExpiryTime
    );

    expect(addDeviceKeyInRedisMock).toHaveBeenNthCalledWith(
      1,
      phoneNumberMock,
      'device-token',
      2592000,
      'random-string'
    );

    expect(response).toEqual({
      account: { phoneNumber: '+11111111111' },
      accountKey: 'account-Key-in-redis',
      token: 'device-token',
      recoveryEmailExists: false,
    });
  });

  it("should call getPhoneRegistrationDataFromRedis if account doesn't exists in DB", async () => {
    searchAccountByPhoneNumberMock.mockReturnValueOnce(null);
    getAccountCreationDataFromRedisMock.mockReturnValueOnce({
      firstName: 'name',
      lastName: 'last',
    });
    getPinDataFromRedisMock.mockReturnValueOnce({
      accountKey: 'account-Key-in-redis',
    });
    generateJsonWebTokenMock.mockReturnValue('device-token');

    const response = await generateDeviceToken(
      phoneNumberMock,
      configurationMock,
      databaseMock
    );

    expect(getAccountCreationDataFromRedisMock).toHaveBeenNthCalledWith(
      1,
      phoneNumberMock
    );

    expect(response).toEqual({
      account: { firstName: 'name', lastName: 'last' },
      accountKey: 'account-Key-in-redis',
      token: 'device-token',
      recoveryEmailExists: false,
    });
  });
});

describe('createDeviceToken()', () => {
  it('should return deviceToken', async () => {
    generateJsonWebTokenMock.mockReturnValue('device-token');

    const response = await createDeviceToken(
      phoneNumberMock,
      configurationMock
    );

    expect(createRandomStringMock).toHaveBeenCalled();
    expect(generateSalt).toBeCalled();
    expect(generateJsonWebTokenMock).toHaveBeenCalledWith(
      {
        device: '+11111111111',
        deviceIdentifier: 'random-string',
        deviceKey: 'new-encrypted-salt',
        deviceType: 'phone',
      },
      configurationMock.jwtTokenSecretKey,
      configurationMock.deviceTokenExpiryTime
    );

    expect(addDeviceKeyInRedisMock).toHaveBeenNthCalledWith(
      1,
      phoneNumberMock,
      'device-token',
      2592000,
      'random-string'
    );

    expect(addPinVerificationKeyInRedisMock).toHaveBeenNthCalledWith(
      1,
      phoneNumberMock,
      30,
      'random-string'
    );

    expect(response).toEqual('device-token');
  });
});
