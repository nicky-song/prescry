// Copyright 2022 Prescryptive Health, Inc.

import DatabaseConnection from '../database/database-connection';
import RxAssistantDatabase from '../database/rx-assistant-database';

async function deleteAccount(
  database: RxAssistantDatabase,
  phoneNumber: string
) {
  const exists = await database.findAccountByPhoneNumber(phoneNumber).hasNext();
  if (exists) {
    await database.deleteAccountByPhoneNumber(phoneNumber);
  } else {
    // eslint-disable-next-line no-console
    console.log(`Phone number ${phoneNumber} does not exist in account`);
  }
}

async function deletePerson(
  database: RxAssistantDatabase,
  phoneNumber: string
) {
  const persons = database.findPersonByPhoneNumber(phoneNumber);
  if (await persons.hasNext()) {
    await database.deletePersonByPhoneNumber(phoneNumber);
  } else {
    // eslint-disable-next-line no-console
    console.log(`Phone number ${phoneNumber} does not exist in person`);
  }
  await database.deletePersonByActivationPhoneNumber(phoneNumber);
}

export default async function resetAccountInDatabase(phoneNumber: string) {
  const connection = await DatabaseConnection.connect();
  const database = connection.getRxAssistant();
  try {
    await deletePerson(database, phoneNumber);
    await deleteAccount(database, phoneNumber);
  } catch (error) {
    throw new Error(`Reset account failed with error ${error}`);
  } finally {
    await connection.close();
  }
}
