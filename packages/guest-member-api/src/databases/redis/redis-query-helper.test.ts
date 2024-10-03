// Copyright 2018 Prescryptive Health, Inc.

import {
  addKeyInRedis,
  getValueFromRedis,
  IAccountCreationKeyValues,
  IPhoneRegistrationKeyValues,
  RedisKeys,
} from '../../utils/redis/redis.helper';
import {
  addAccountCreationKeyInRedis,
  addDeviceKeyInRedis,
  addPhoneRegistrationKeyInRedis,
  addPinKeyInRedis,
  addPinVerificationKeyInRedis,
  getAccountCreationDataFromRedis,
  getDeviceDataFromRedis,
  getPhoneRegistrationDataFromRedis,
  getPinDataFromRedis,
  getPinVerificationDataFromRedis,
} from './redis-query-helper';

jest.mock('../../utils/redis/redis.helper', () => ({
  RedisKeys: {
    DEVICE_KEY: 'device',
    PHONE_NUMBER_REGISTRATION_KEY: 'phone-number:registration',
    PIN_KEY: 'pin',
    PIN_VERIFICATION_KEY: 'pin-verification',
  },
  addKeyInRedis: jest.fn(),
  getValueFromRedis: jest.fn(),
}));

const addKeyInRedisMock = addKeyInRedis as jest.Mock;
const getValueFromRedisMock = getValueFromRedis as jest.Mock;

const mockPhoneNumber = 'phone-number';
const mockPhoneRegistrationData: IPhoneRegistrationKeyValues = {
  dateOfBirth: 'dateOfBirth',
  firstName: 'firstName',
  identifier: 'identifier',
  lastName: 'lastName',
};
const mockExpiryTime = 1800;

beforeEach(() => {
  addKeyInRedisMock.mockReset();
  getValueFromRedisMock.mockReset();
});

describe('getPhoneRegistrationDataFromRedis', () => {
  it('should call getValueFromRedis with phone number and PHONE_NUMBER_REGISTRATION_KEY as key type', async () => {
    await getPhoneRegistrationDataFromRedis(mockPhoneNumber);
    expect(getValueFromRedisMock).toHaveBeenNthCalledWith(
      1,
      mockPhoneNumber,
      RedisKeys.PHONE_NUMBER_REGISTRATION_KEY
    );
  });
});

describe('addPhoneRegistrationKeyInRedis', () => {
  it('should call addKeyInRedis with phone number, data, expiryTime and PHONE_NUMBER_REGISTRATION_KEY as key type', async () => {
    await addPhoneRegistrationKeyInRedis(
      mockPhoneNumber,
      mockPhoneRegistrationData,
      mockExpiryTime
    );
    expect(addKeyInRedisMock).toHaveBeenNthCalledWith(
      1,
      mockPhoneNumber,
      mockPhoneRegistrationData,
      mockExpiryTime,
      RedisKeys.PHONE_NUMBER_REGISTRATION_KEY
    );
  });
});

describe('getPinDataFromRedis', () => {
  it('should call getValueFromRedis with phone number and PIN_KEY as key type', async () => {
    await getPinDataFromRedis(mockPhoneNumber);
    expect(getValueFromRedisMock).toHaveBeenNthCalledWith(
      1,
      mockPhoneNumber,
      RedisKeys.PIN_KEY,
      undefined,
      undefined,
      undefined
    );
  });

  it('should pass create and id if defined', async () => {
    const mockId = 'id';
    const mockCreator = jest.fn();

    await getPinDataFromRedis(
      mockPhoneNumber,
      mockId,
      mockCreator,
      mockExpiryTime
    );
    expect(getValueFromRedisMock).toHaveBeenNthCalledWith(
      1,
      mockPhoneNumber,
      RedisKeys.PIN_KEY,
      mockId,
      mockCreator,
      mockExpiryTime
    );
  });
});

describe('addDeviceKeyInRedis', () => {
  it('should call addKeyInRedis with phone number, data, expiryTime and PHONE_NUMBER_REGISTRATION_KEY as key type', async () => {
    const token = 'mock-token';
    const deviceTokenKeyExpiryIn = 1800;
    const deviceIdentifier = 'deviceIdentifier';

    await addDeviceKeyInRedis(
      mockPhoneNumber,
      token,
      deviceTokenKeyExpiryIn,
      deviceIdentifier
    );
    expect(addKeyInRedisMock).toHaveBeenNthCalledWith(
      1,
      mockPhoneNumber,
      { deviceToken: 'mock-token' },
      deviceTokenKeyExpiryIn,
      RedisKeys.DEVICE_KEY,
      deviceIdentifier
    );
  });
});

describe('addPinKeyInRedis', () => {
  it('should call addKeyInRedis with phone number, accountKey, pinHash, pinKeyExpiryIn and PIN_KEY as key type', async () => {
    const accountKey = 'mock-accountKey';
    const pinHash = 'mock-pinHash';
    const pinKeyExpiryIn = 1800;

    await addPinKeyInRedis(
      mockPhoneNumber,
      { accountKey, pinHash },
      pinKeyExpiryIn
    );
    expect(addKeyInRedisMock).toHaveBeenNthCalledWith(
      1,
      mockPhoneNumber,
      { accountKey: 'mock-accountKey', pinHash: 'mock-pinHash' },
      pinKeyExpiryIn,
      RedisKeys.PIN_KEY
    );
  });
});

describe('getDeviceDataFromRedis', () => {
  it('should call getValueFromRedis with phone number and deviceIdentifier and DEVICE_KEY as key type', async () => {
    const deviceIdentifier = 'mock-id';
    await getDeviceDataFromRedis(mockPhoneNumber, deviceIdentifier);
    expect(getValueFromRedisMock).toHaveBeenNthCalledWith(
      1,
      mockPhoneNumber,
      RedisKeys.DEVICE_KEY,
      deviceIdentifier
    );
  });
});

describe('getPinVerificationDataFromRedis', () => {
  it('should call getValueFromRedis with phone number and deviceIdentifier and PIN_VERIFICATION_KEY as key type', async () => {
    const deviceIdentifier = 'mock-id';
    await getPinVerificationDataFromRedis(mockPhoneNumber, deviceIdentifier);
    expect(getValueFromRedisMock).toHaveBeenNthCalledWith(
      1,
      mockPhoneNumber,
      RedisKeys.PIN_VERIFICATION_KEY,
      deviceIdentifier
    );
  });
});

describe('addPinVerificationKeyInRedis', () => {
  it('should call addKeyInRedis with phone number, deviceIdentifier, pinVerificationAttempt = 0 and PIN_VERIFICATION_KEY as key type', async () => {
    const pinVerificationKeyExpiryIn = 1800;
    const deviceIdentifier = 'mock-id';

    await addPinVerificationKeyInRedis(
      mockPhoneNumber,
      pinVerificationKeyExpiryIn,
      deviceIdentifier
    );
    expect(addKeyInRedisMock).toHaveBeenNthCalledWith(
      1,
      mockPhoneNumber,
      {
        pinVerificationAttempt: 0,
      },
      pinVerificationKeyExpiryIn,
      RedisKeys.PIN_VERIFICATION_KEY,
      deviceIdentifier
    );
  });

  it('should set pinVerificationAttempt if provided', async () => {
    const pinVerificationKeyExpiryIn = 1800;
    const deviceIdentifier = 'mock-id';
    const pinVerificationAttempt = 4;

    await addPinVerificationKeyInRedis(
      mockPhoneNumber,
      pinVerificationKeyExpiryIn,
      deviceIdentifier,
      pinVerificationAttempt
    );
    expect(addKeyInRedisMock).toHaveBeenNthCalledWith(
      1,
      mockPhoneNumber,
      {
        pinVerificationAttempt: 4,
      },
      pinVerificationKeyExpiryIn,
      RedisKeys.PIN_VERIFICATION_KEY,
      deviceIdentifier
    );
  });
});

describe('getAccountCreationDataFromRedis', () => {
  it('should call getValueFromRedis with phone number and PHONE_NUMBER_REGISTRATION_KEY as key type', async () => {
    await getAccountCreationDataFromRedis(mockPhoneNumber);
    expect(getValueFromRedisMock).toHaveBeenCalledWith(
      mockPhoneNumber,
      RedisKeys.ACCOUNT_CREATE_KEY
    );
  });
});

describe('addAccountCreationKeyInRedis', () => {
  const mockAccountCreateData: IAccountCreationKeyValues = {
    dateOfBirth: 'dateOfBirth',
    firstName: 'firstName',
    phoneNumber: mockPhoneNumber,
    lastName: 'lastName',
  };
  it('should call addKeyInRedis with phone number, data, expiryTime and PHONE_NUMBER_REGISTRATION_KEY as key type', async () => {
    await addAccountCreationKeyInRedis(
      mockPhoneNumber,
      mockAccountCreateData,
      mockExpiryTime
    );
    expect(addKeyInRedisMock).toHaveBeenCalledWith(
      mockPhoneNumber,
      mockAccountCreateData,
      mockExpiryTime,
      RedisKeys.ACCOUNT_CREATE_KEY
    );
  });
});
