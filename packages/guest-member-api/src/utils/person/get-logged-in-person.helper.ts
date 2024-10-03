// Copyright 2020 Prescryptive Health, Inc.

import { IDatabase } from '../../databases/mongo-database/v1/setup/setup-database';
import { IPerson } from '@phx/common/src/models/person';
import {
  searchPersonByPhoneNumber,
  searchPersonByIdentifier,
} from '../../databases/mongo-database/v1/query-helper/person-collection-helper';
import { getFirstOrDefault, sortMemberByPersonCode } from './person-helper';
import { IPhoneRegistrationKeyValues } from '../redis/redis.helper';
import {
  getPersonCreationDataFromRedis,
  getPhoneRegistrationDataFromRedis,
} from '../../databases/redis/redis-query-helper';

export const getLoggedInPerson = async (
  database: IDatabase,
  phoneNumber: string
): Promise<IPerson | undefined | null> => {
  const personList: IPerson[] | null = await searchPersonByPhoneNumber(
    database,
    phoneNumber
  );
  if (personList && personList.length > 0) {
    return getFirstOrDefault(personList, sortMemberByPersonCode);
  }

  const dataInRedis: IPhoneRegistrationKeyValues | undefined =
    await getPhoneRegistrationDataFromRedis(phoneNumber);

  if (!dataInRedis) {
    return undefined;
  }
  return await searchPersonByIdentifier(database, dataInRedis.identifier);
};

export const getAllRecordsForLoggedInPerson = async (
  database: IDatabase,
  phoneNumber: string
): Promise<IPerson[]> => {
  const personList: IPerson[] | null = await searchPersonByPhoneNumber(
    database,
    phoneNumber
  );

  if (personList?.length > 0) {
    return personList;
  }

  const phoneRegistrationDataInRedis: IPhoneRegistrationKeyValues | undefined =
    await getPhoneRegistrationDataFromRedis(phoneNumber);

  if (phoneRegistrationDataInRedis) {
    const person: IPerson | null = await searchPersonByIdentifier(
      database,
      phoneRegistrationDataInRedis.identifier
    );
    if (person) {
      return [person];
    }
  }

  const personCreateDataInRedis: IPerson[] | undefined =
    await getPersonCreationDataFromRedis(phoneNumber);

  if (personCreateDataInRedis) {
    const primaryPerson = personCreateDataInRedis.find(
      (person) => person.isPrimary
    );
    if (primaryPerson) {
      return [primaryPerson];
    }
  }
  return [];
};
