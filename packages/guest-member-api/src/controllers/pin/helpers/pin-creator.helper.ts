// Copyright 2020 Prescryptive Health, Inc.

import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import { IPinKeyValues } from '../../../utils/redis/redis.helper';
import { searchAccountByPhoneNumber } from '../../../databases/mongo-database/v1/query-helper/account-collection-helper';

export const pinDetailsCreator = async (
  database: IDatabase,
  phoneNumber: string
): Promise<IPinKeyValues | undefined> => {
  const accountDetails = await searchAccountByPhoneNumber(
    database,
    phoneNumber
  );
  if (accountDetails && accountDetails.accountKey && accountDetails.pinHash) {
    return {
      accountKey: accountDetails.accountKey,
      pinHash: accountDetails.pinHash,
      firstName: accountDetails.firstName,
      lastName: accountDetails.lastName,
      dateOfBirth: accountDetails.dateOfBirth,
      _id: accountDetails._id,
    };
  }
  return undefined;
};
