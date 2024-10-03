// Copyright 2022 Prescryptive Health, Inc.

import { FindCursor } from 'mongodb';
import { PersonDocument } from '../types';
import { Person } from '../types/person';
import DatabaseConnection from './database/database-connection';

function validateEntry(entry: PersonDocument, person: Person) {
  if (entry.firstName.toUpperCase() !== person.firstName.toUpperCase()) {
    throw new Error(
      `First name not matching ${entry.firstName} and ${person.firstName}`
    );
  }
  if (entry.lastName.toUpperCase() !== person.lastName.toUpperCase()) {
    throw new Error(
      `Last name not matching ${entry.lastName} and ${person.lastName}`
    );
  }
}

async function validatePerson(
  persons: FindCursor<PersonDocument>,
  person: Person
) {
  while (await persons.hasNext()) {
    const entry = await persons.next();
    if (entry) {
      // eslint-disable-next-line no-console
      console.log(`Validating person id ${entry._id}`);
      try {
        validateEntry(entry, person);
      } catch (error) {
        throw new Error(
          `Validate person with id ${entry._id} failed: ${error}`
        );
      }
    }
  }
}

export async function validatePersonInDatabase(person: Person) {
  const connection = await DatabaseConnection.connect();
  try {
    const rxAssistantDatabase = connection.getRxAssistant();
    const phoneNumber = `${person.countryCode}${person.phoneNumber}`;
    const persons = rxAssistantDatabase.findPersonByPhoneNumber(phoneNumber);
    const existsPerson = await persons.hasNext();
    if (existsPerson) {
      await validatePerson(persons, person);
    }
    // eslint-disable-next-line no-console
    console.log(`Person ${existsPerson}`);
    return existsPerson;
  } catch (error) {
    throw new Error(`Person verification failed with error ${error}`);
  } finally {
    await connection.close();
  }
}
