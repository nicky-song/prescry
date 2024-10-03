// Copyright 2018 Prescryptive Health, Inc.

import { IAccount } from '@phx/common/src/models/account';
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
import { generateJsonWebToken } from '../utils/jwt-device-helper';
import {
  deviceTokenKeyExpiryIn,
  IAccountCreationKeyValues,
  IPinKeyValues,
  pinVerificationKeyExpiryIn,
} from '../utils/redis/redis.helper';
import { createRandomString } from '../utils/string-helper';

export interface IGenerateDeviceTokenResponse {
  account: IAccount | IAccountCreationKeyValues | undefined;
  accountKey: string | undefined;
  token: string;
  recoveryEmailExists: boolean;
}

export const generateDeviceToken = async (
  phoneNumber: string,
  configuration: IConfiguration,
  database: IDatabase
): Promise<IGenerateDeviceTokenResponse> => {
  const { jwtTokenSecretKey, deviceTokenExpiryTime } = configuration;

  const account: IAccount | null = await searchAccountByPhoneNumber(
    database,
    phoneNumber
  );

  let dataInRedis: IAccountCreationKeyValues | undefined;

  if (!account) {
    dataInRedis = await getAccountCreationDataFromRedis(phoneNumber);
  }

  let accountKey = account && account.accountKey;

  if (!accountKey) {
    const redisPinDetails: IPinKeyValues | undefined =
      await getPinDataFromRedis(phoneNumber);

    accountKey = redisPinDetails && redisPinDetails.accountKey;
  }

  const deviceIdentifier = createRandomString();
  const deviceKey = accountKey || (await generateSalt());

  const tokenPayload = {
    device: phoneNumber,
    deviceIdentifier,
    deviceKey,
    deviceType: 'phone',
  };
  const token = generateJsonWebToken(
    tokenPayload,
    jwtTokenSecretKey,
    deviceTokenExpiryTime
  );

  await addDeviceKeyInRedis(
    phoneNumber,
    token,
    deviceTokenKeyExpiryIn,
    deviceIdentifier
  );

  await addPinVerificationKeyInRedis(
    phoneNumber,
    pinVerificationKeyExpiryIn,
    deviceIdentifier
  );

  const recoveryEmailExists =
    account && account.recoveryEmail && account.recoveryEmail.length > 0
      ? true
      : false;

  return {
    account: account || dataInRedis,
    accountKey,
    token,
    recoveryEmailExists,
  };
};

export const createDeviceToken = async (
  phoneNumber: string,
  configuration: IConfiguration
): Promise<string> => {
  const { jwtTokenSecretKey, deviceTokenExpiryTime } = configuration;
  const deviceIdentifier = createRandomString();
  const deviceKey = await generateSalt();

  const tokenPayload = {
    device: phoneNumber,
    deviceIdentifier,
    deviceKey,
    deviceType: 'phone',
  };
  const token = generateJsonWebToken(
    tokenPayload,
    jwtTokenSecretKey,
    deviceTokenExpiryTime
  );

  await addDeviceKeyInRedis(
    phoneNumber,
    token,
    deviceTokenKeyExpiryIn,
    deviceIdentifier
  );

  await addPinVerificationKeyInRedis(
    phoneNumber,
    pinVerificationKeyExpiryIn,
    deviceIdentifier
  );
  return token;
};
