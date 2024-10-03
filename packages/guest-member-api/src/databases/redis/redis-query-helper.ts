// Copyright 2018 Prescryptive Health, Inc.

import { IPerson } from '@phx/common/src/models/person';
import {
  addKeyInRedis,
  getValueFromRedis,
  IAccountCreationKeyValues,
  IDeviceKeyValues,
  IIdentityVerificationKeyValues,
  IPhoneRegistrationKeyValues,
  IPinKeyValues,
  IPinVerificationKeyValues,
  RedisKeys,
} from '../../utils/redis/redis.helper';

export const getPhoneRegistrationDataFromRedis = (
  phoneNumber: string
): Promise<IPhoneRegistrationKeyValues | undefined> =>
  getValueFromRedis<IPhoneRegistrationKeyValues>(
    phoneNumber.trim(),
    RedisKeys.PHONE_NUMBER_REGISTRATION_KEY
  );

export const addPhoneRegistrationKeyInRedis = (
  phoneNumber: string,
  data: IPhoneRegistrationKeyValues,
  expiryTime: number
) =>
  addKeyInRedis<IPhoneRegistrationKeyValues>(
    phoneNumber.trim(),
    {
      dateOfBirth: data.dateOfBirth,
      firstName: data.firstName,
      identifier: data.identifier,
      lastName: data.lastName,
    },
    expiryTime,
    RedisKeys.PHONE_NUMBER_REGISTRATION_KEY
  );

export const getAccountCreationDataFromRedis = (
  phoneNumber: string
): Promise<IAccountCreationKeyValues | undefined> =>
  getValueFromRedis<IAccountCreationKeyValues>(
    phoneNumber.trim(),
    RedisKeys.ACCOUNT_CREATE_KEY
  );

export const addAccountCreationKeyInRedis = (
  phoneNumber: string,
  data: IAccountCreationKeyValues,
  expiryTime: number
) =>
  addKeyInRedis<IAccountCreationKeyValues>(
    phoneNumber.trim(),
    {
      dateOfBirth: data.dateOfBirth,
      firstName: data.firstName,
      phoneNumber: data.phoneNumber,
      lastName: data.lastName,
    },
    expiryTime,
    RedisKeys.ACCOUNT_CREATE_KEY
  );

export const getPersonCreationDataFromRedis = (
  phoneNumber: string
): Promise<IPerson[] | undefined> =>
  getValueFromRedis<IPerson[] | undefined>(
    phoneNumber.trim(),
    RedisKeys.PERSON_CREATE_KEY
  );

export const addPersonCreationKeyInRedis = (
  phoneNumber: string,
  data: IPerson[],
  expiryTime: number
) =>
  addKeyInRedis<IPerson[]>(
    phoneNumber.trim(),
    data,
    expiryTime,
    RedisKeys.PERSON_CREATE_KEY
  );
export const getPinDataFromRedis = (
  phoneNumber: string,
  id?: string,
  creator?: () => Promise<IPinKeyValues | undefined>,
  expiresIn?: number
): Promise<IPinKeyValues | undefined> =>
  getValueFromRedis<IPinKeyValues>(
    phoneNumber.trim(),
    RedisKeys.PIN_KEY,
    id,
    creator,
    expiresIn
  );

export const addPinKeyInRedis = (
  phoneNumber: string,
  pinKeyValues: IPinKeyValues,
  pinKeyExpiryIn: number
) =>
  addKeyInRedis<IPinKeyValues>(
    phoneNumber.trim(),
    pinKeyValues,
    pinKeyExpiryIn,
    RedisKeys.PIN_KEY
  );

export const getDeviceDataFromRedis = (
  phoneNumber: string,
  deviceIdentifier: string
): Promise<IDeviceKeyValues | undefined> =>
  getValueFromRedis<IDeviceKeyValues>(
    phoneNumber.trim(),
    RedisKeys.DEVICE_KEY,
    deviceIdentifier
  );

export const addDeviceKeyInRedis = (
  phoneNumber: string,
  token: string,
  deviceTokenKeyExpiryIn: number,
  deviceIdentifier: string
) =>
  addKeyInRedis<IDeviceKeyValues>(
    phoneNumber.trim(),
    {
      deviceToken: token,
    },
    deviceTokenKeyExpiryIn,
    RedisKeys.DEVICE_KEY,
    deviceIdentifier
  );

export const getPinVerificationDataFromRedis = (
  phoneNumber: string,
  deviceIdentifier: string
): Promise<IPinVerificationKeyValues | undefined> =>
  getValueFromRedis<IPinVerificationKeyValues>(
    phoneNumber.trim(),
    RedisKeys.PIN_VERIFICATION_KEY,
    deviceIdentifier
  );

export const addPinVerificationKeyInRedis = (
  phoneNumber: string,
  pinVerificationKeyExpiryIn: number,
  deviceIdentifier: string,
  pinVerificationAttempt = 0
) =>
  addKeyInRedis<IPinVerificationKeyValues>(
    phoneNumber.trim(),
    {
      pinVerificationAttempt,
    },
    pinVerificationKeyExpiryIn,
    RedisKeys.PIN_VERIFICATION_KEY,
    deviceIdentifier
  );

export const getIdentityVerificationAttemptsDataFromRedis = (
  phoneNumber: string
): Promise<IIdentityVerificationKeyValues | undefined> =>
  getValueFromRedis<IIdentityVerificationKeyValues>(
    phoneNumber.trim(),
    RedisKeys.IDENTITY_VERIFICATION_ATTEMPTS_KEY
  );

export const addIdentityVerificationAttemptsKeyInRedis = (
  phoneNumber: string,
  identityVerificationKeyExpiryIn: number,
  identityVerificationAttempt = 0
) =>
  addKeyInRedis<IIdentityVerificationKeyValues>(
    phoneNumber.trim(),
    {
      identityVerificationAttempt,
    },
    identityVerificationKeyExpiryIn,
    RedisKeys.IDENTITY_VERIFICATION_ATTEMPTS_KEY
  );
