// Copyright 2020 Prescryptive Health, Inc.

import { IPerson } from '@phx/common/src/models/person';
import {
  searchPersonByPrimaryMemberFamilyId,
  searchPersonByPrimaryMemberRxId,
} from '../../databases/mongo-database/v1/query-helper/person-collection-helper';
import { IDatabase } from '../../databases/mongo-database/v1/setup/setup-database';
import { trackUserLoginMechanism } from '../custom-event-helper';

export const findPersonByPrimaryMemberRxId = async (
  database: IDatabase,
  primaryMemberRxId: string
): Promise<IPerson | null> => {
  const modelFound: IPerson | null = await searchPersonByPrimaryMemberRxId(
    database,
    primaryMemberRxId
  );

  if (modelFound) {
    trackUserLoginMechanism('PrimaryMemberRxId', primaryMemberRxId);
  }
  return modelFound;
};

export const findPersonByFamilyId = async (
  database: IDatabase,
  firstName: string,
  dateOfBirth: string,
  primaryMemberRxId: string
): Promise<IPerson | null> => {
  const listOfPersons: IPerson[] = await searchPersonByPrimaryMemberFamilyId(
    database,
    primaryMemberRxId,
    dateOfBirth
  );

  if (listOfPersons && listOfPersons.length !== 0) {
    const loggedInPerson = listOfPersons.find(
      (person) =>
        person.firstName.toLowerCase().trim() === firstName.toLowerCase().trim()
    );

    if (loggedInPerson) {
      trackUserLoginMechanism('FamilyId', loggedInPerson.primaryMemberRxId);
      return loggedInPerson;
    }
  }
  return null;
};
