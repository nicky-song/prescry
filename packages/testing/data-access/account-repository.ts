// Copyright 2023 Prescryptive Health, Inc.

import { BenefitPerson, PhoneData } from '../types';
import { PhoneService } from '../services';
import { accountTemplate } from '../test-data';
import DatabaseConnection from '../utilities/database/database-connection';

export abstract class AccountRepository {
  public static async createAccount(pbmUser: PhoneData, person: BenefitPerson) {
    const connection = await DatabaseConnection.connect();
    try {
      const accountId = connection.createObjectId();
      const dateOfBirth = new Date(`${person.birthDate}T00:00:00Z`);
      const account = {
        ...accountTemplate,
        _id: accountId,
        phoneNumber: PhoneService.phoneNumberWithCountryCode(pbmUser),
        dateOfBirth,
        firstName: person.firstName,
        lastName: person.lastName,
        recoveryEmail: person.email,
        masterId: accountId,
        accountId,
      };
      const rxAssistant = connection.getRxAssistant();
      await rxAssistant.createAccount(account);
    } catch (error) {
      throw new Error(`Create account failed with error ${error}`);
    } finally {
      await connection.close();
    }
  }
}
