// Copyright 2018 Prescryptive Health, Inc.

import { IConfiguration } from '../configuration';
import {
  addDeviceKeyInRedis,
  addPinVerificationKeyInRedis,
  getPinDataFromRedis,
} from '../databases/redis/redis-query-helper';
import {
  patientAccountPrimaryWithPatientMock,
  patientAccountPrimaryWithOutAuthMock,
} from '../mock-data/patient-account.mock';
import { generateSalt } from './bcryptjs-helper';
import { generateJsonWebToken, IDeviceTokenPayload } from './jwt-device-helper';
import { createRandomString } from './string-helper';
import { generateDeviceTokenV2 } from './verify-device-helper-v2';
import { getPreferredEmailFromPatient } from './fhir-patient/get-contact-info-from-patient';
import { getPinDetails } from './patient-account/get-pin-details';

jest.mock('../utils/redis/redis.helper', () => ({
  RedisKeys: { PHONE_KEY: 'PHONE_KEY', PIN_KEY: 'PIN_KEY' },
  deviceTokenKeyExpiryIn: 2592000,
  getValueFromRedis: jest.fn(),
  pinVerificationKeyExpiryIn: 30,
}));

jest.mock('../utils/jwt-device-helper');
const generateJsonWebTokenMock = generateJsonWebToken as jest.Mock;

jest.mock('../utils/string-helper', () => ({
  createRandomString: jest.fn().mockReturnValue('random-string'),
}));
const createRandomStringMock = createRandomString as jest.Mock;

jest.mock('../utils/bcryptjs-helper', () => ({
  generateSalt: jest.fn().mockReturnValue('new-encrypted-salt'),
}));

jest.mock('../databases/redis/redis-query-helper');
const addDeviceKeyInRedisMock = addDeviceKeyInRedis as jest.Mock;
const getPinDataFromRedisMock = getPinDataFromRedis as jest.Mock;
const addPinVerificationKeyInRedisMock =
  addPinVerificationKeyInRedis as jest.Mock;

jest.mock('./fhir-patient/get-contact-info-from-patient');
const getPreferredEmailFromPatientMock =
  getPreferredEmailFromPatient as jest.Mock;

jest.mock('./patient-account/get-pin-details');
const getPinDetailsMock = getPinDetails as jest.Mock;

describe('generateDeviceTokenV2', () => {
  const phoneNumberMock = '+11111111111';
  const patientAccountIdMock = 'account-id1';
  const configurationMock = {
    deviceTokenExpiryTime: 10,
    jwtTokenSecretKey: 'mock-secretKey',
    twilioVerificationServiceId: 'mock-serviceId',
  } as IConfiguration;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return account, accountKey,token and recoveryEmail(if exists) on success', async () => {
    generateJsonWebTokenMock.mockReturnValue('device-token');
    getPreferredEmailFromPatientMock.mockReturnValueOnce(
      'email@prescryptive.com'
    );
    getPinDetailsMock.mockReturnValueOnce({
      accountKey: 'account-key',
      pinHash: 'pin-hash',
    });
    const response = await generateDeviceTokenV2(
      phoneNumberMock,
      configurationMock,
      patientAccountPrimaryWithPatientMock
    );

    expect(createRandomStringMock).toHaveBeenCalled();

    const expectedDeviceTokenPayload: IDeviceTokenPayload = {
      device: '+11111111111',
      deviceIdentifier: 'random-string',
      deviceKey: 'account-key',
      deviceType: 'phone',
      patientAccountId: patientAccountIdMock,
    };
    expect(generateJsonWebTokenMock).toHaveBeenCalledWith(
      expectedDeviceTokenPayload,
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
      account: patientAccountPrimaryWithPatientMock,
      accountKey: 'account-key',
      token: 'device-token',
      recoveryEmailExists: true,
    });
  });

  it('should return account, accountKey and token on success when recoveryEmail doesnt exist in patient ', async () => {
    generateJsonWebTokenMock.mockReturnValue('device-token');
    getPreferredEmailFromPatientMock.mockReturnValue(undefined);
    getPinDetailsMock.mockReturnValueOnce({
      accountKey: 'account-key',
      pinHash: 'pin-hash',
    });
    const response = await generateDeviceTokenV2(
      phoneNumberMock,
      configurationMock,
      patientAccountPrimaryWithPatientMock
    );

    expect(createRandomStringMock).toHaveBeenCalled();

    const expectedDeviceTokenPayload: IDeviceTokenPayload = {
      device: '+11111111111',
      deviceIdentifier: 'random-string',
      deviceKey: 'account-key',
      deviceType: 'phone',
      patientAccountId: 'account-id1',
    };
    expect(generateJsonWebTokenMock).toHaveBeenCalledWith(
      expectedDeviceTokenPayload,
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
      account: patientAccountPrimaryWithPatientMock,
      accountKey: 'account-key',
      token: 'device-token',
      recoveryEmailExists: false,
    });
  });

  it("should call getPinDataFromRedis if patient account doesn't have auth object", async () => {
    getPreferredEmailFromPatientMock.mockReturnValue(undefined);
    getPinDetailsMock.mockReturnValueOnce(undefined);
    getPinDataFromRedisMock.mockReturnValueOnce({
      accountKey: 'account-key-in-redis',
    });
    generateJsonWebTokenMock.mockReturnValue('device-token');

    const response = await generateDeviceTokenV2(
      phoneNumberMock,
      configurationMock,
      patientAccountPrimaryWithOutAuthMock
    );
    expect(getPinDataFromRedisMock).toHaveBeenNthCalledWith(1, phoneNumberMock);

    expect(generateSalt).not.toBeCalled();
    expect(createRandomStringMock).toHaveBeenCalled();

    const expectedDeviceTokenPayload: IDeviceTokenPayload = {
      device: '+11111111111',
      deviceIdentifier: 'random-string',
      deviceKey: 'account-key-in-redis',
      deviceType: 'phone',
      patientAccountId: 'account-id1',
    };
    expect(generateJsonWebTokenMock).toHaveBeenCalledWith(
      expectedDeviceTokenPayload,
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
      account: patientAccountPrimaryWithOutAuthMock,
      accountKey: 'account-key-in-redis',
      token: 'device-token',
      recoveryEmailExists: false,
    });
  });

  it('should return accountKey,token and recoveryEmail(if exists) on success when patientAccount is not passed', async () => {
    generateJsonWebTokenMock.mockReturnValue('device-token');
    getPinDetailsMock.mockResolvedValue(undefined);
    const response = await generateDeviceTokenV2(
      phoneNumberMock,
      configurationMock
    );

    expect(createRandomStringMock).toHaveBeenCalled();

    const expectedDeviceTokenPayload: IDeviceTokenPayload = {
      device: '+11111111111',
      deviceIdentifier: 'random-string',
      deviceKey: 'new-encrypted-salt',
      deviceType: 'phone',
    };
    expect(generateJsonWebTokenMock).toHaveBeenCalledWith(
      expectedDeviceTokenPayload,
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
      account: undefined,
      accountKey: undefined,
      token: 'device-token',
      recoveryEmailExists: false,
    });
  });
});
