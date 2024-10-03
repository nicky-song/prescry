// Copyright 2020 Prescryptive Health, Inc.

import { IPerson } from '@phx/common/src/models/person';
import { searchPersonByPhoneNumber } from '../../../databases/mongo-database/v1/query-helper/person-collection-helper';
import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import { getPhoneRegistrationDataFromRedis } from '../../../databases/redis/redis-query-helper';
import { trackPhoneNumberAssignedToMultipleMembers } from '../../../utils/custom-event-helper';
import { IPhoneRegistrationKeyValues } from '../../../utils/redis/redis.helper';

export const getPersonIdentifiers = async (
  phoneNumber: string,
  database: IDatabase
): Promise<string[] | undefined> => {
  const members: IPerson[] | null = await searchPersonByPhoneNumber(
    database,
    phoneNumber
  );
  if (members && members.length > 1) {
    trackPhoneNumberAssignedToMultipleMembers(
      phoneNumber,
      members.map((person) => person.identifier)
    );
  }
  if (members) {
    return members.map((member) => member.identifier);
  }

  const dataInRedis: IPhoneRegistrationKeyValues | undefined =
    await getPhoneRegistrationDataFromRedis(phoneNumber);

  if (!dataInRedis) {
    return undefined;
  }

  return [dataInRedis.identifier];
};
