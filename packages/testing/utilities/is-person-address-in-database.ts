// Copyright 2022 Prescryptive Health, Inc.

import DatabaseConnection from './database/database-connection';

export async function isPersonAddressInDatabase(
  phoneNumber: string,
  rxGroupType: string
) {
  const connection = await DatabaseConnection.connect();
  try {
    const rxAssistantDatabase = connection.getRxAssistant();
    const person =
      await rxAssistantDatabase.findPersonByPhoneNumberAndRxGroupType(
        phoneNumber,
        rxGroupType
      );

    if (person === null) return null;

    return person.address1 !== undefined;
  } catch (error) {
    throw new Error(
      `Failed to get Person document in database with error ${error}`
    );
  } finally {
    await connection.close();
  }
}
