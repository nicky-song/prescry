// Copyright 2021 Prescryptive Health, Inc.

import { IPerson } from '@phx/common/src/models/person';
import { IMemberAddress } from '@phx/common/src/models/api-request-body/create-booking.request-body';
import { IConfiguration } from '../../configuration';
import { IDatabase } from '../../databases/mongo-database/v1/setup/setup-database';
import {
  addPersonCreationKeyInRedis,
  getPersonCreationDataFromRedis,
} from '../../databases/redis/redis-query-helper';
import { publishPersonCreateMessage } from '../service-bus/person-update-helper';
import {
  createPersonHelper,
  generatePrimaryMemberFamilyId,
} from './person-creation.helper';

export const createCashProfileAndAddToRedis = async (
  database: IDatabase,
  configuration: IConfiguration,
  firstName: string,
  lastName: string,
  dateOfBirth: string,
  phoneNumber: string,
  recoveryEmail?: string,
  memberAddress?: IMemberAddress,
  masterId?: string,
  patientAccountId?: string,
  familyId?: string
): Promise<IPerson> => {
  const primaryMemberFamilyId =
    familyId ?? (await generatePrimaryMemberFamilyId(database, configuration));

  const person = createPersonHelper(
    primaryMemberFamilyId,
    firstName,
    lastName,
    dateOfBirth,
    phoneNumber,
    recoveryEmail,
    memberAddress,
    masterId,
    patientAccountId
  );
  await publishPersonCreateMessage(person);
  const existingCreatePersonInRedis: IPerson[] | undefined =
    await getPersonCreationDataFromRedis(phoneNumber);
  if (existingCreatePersonInRedis) {
    existingCreatePersonInRedis.push(person);
    await addPersonCreationKeyInRedis(
      phoneNumber,
      existingCreatePersonInRedis,
      configuration.redisPersonCreateKeyExpiryTime
    );
  } else {
    await addPersonCreationKeyInRedis(
      phoneNumber,
      [person],
      configuration.redisPersonCreateKeyExpiryTime
    );
  }
  return person;
};
