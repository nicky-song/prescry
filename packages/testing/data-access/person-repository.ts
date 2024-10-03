// Copyright 2023 Prescryptive Health, Inc.

import DatabaseConnection from '../utilities/database/database-connection';

export abstract class PersonRepository {
  public static async get(phoneNumberWithCountryCode: string) {
    const connection = await DatabaseConnection.connect();
    try {
      const rxAssistant = connection.getRxAssistant();
      const persons = rxAssistant.findPersonByPhoneNumber(
        phoneNumberWithCountryCode
      );
      if (await persons.hasNext()) {
        const person = await persons.next();
        return person;
      }
      const activationPersons = rxAssistant.findPersonByActivationPhoneNumber(
        phoneNumberWithCountryCode
      );
      if (await activationPersons.hasNext()) {
        const person = await activationPersons.next();
        return person;
      }
      return null;
    } catch (error) {
      throw new Error(`Get person from repository failed with error ${error}`);
    } finally {
      await connection.close();
    }
  }
}
