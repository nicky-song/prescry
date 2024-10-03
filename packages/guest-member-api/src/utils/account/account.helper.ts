// Copyright 2021 Prescryptive Health, Inc.

import { addAccountCreationKeyInRedis } from '../../databases/redis/redis-query-helper';
import { IAccountCreationKeyValues } from '../redis/redis.helper';
import {
  IAccountUpdate,
  publishAccountUpdateMessage,
} from '../service-bus/account-update-helper';

export const publishAccountUpdateMessageAndAddToRedis = async (
  data: IAccountUpdate,
  redisPhoneNumberRegistrationKeyExpiryTime: number
) => {
  if (data.dateOfBirth) {
    const accountCreateKeyInfo: IAccountCreationKeyValues = {
      firstName: data.firstName ?? '',
      lastName: data.lastName ?? '',
      dateOfBirth: data.dateOfBirth,
      phoneNumber: data.phoneNumber,
    };
    await addAccountCreationKeyInRedis(
      data.phoneNumber,
      accountCreateKeyInfo,
      redisPhoneNumberRegistrationKeyExpiryTime
    );
  }
  await publishAccountUpdateMessage(data);
};
