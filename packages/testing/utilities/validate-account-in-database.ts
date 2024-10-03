// Copyright 2022 Prescryptive Health, Inc.

import DatabaseConnection from './database/database-connection';

export type Account = {
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
};

function validateEntry(entry, person: Account) {
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
  if (entry.recoveryEmail !== person.email) {
    throw new Error(
      `Recovery email not matching ${entry.recoveryEmail} and ${person.email}`
    );
  }
}

export async function validateAccountInDatabase(
  account: Account,
  isComplete: boolean
) {
  const connection = await DatabaseConnection.connect();
  try {
    const rxAssistantDatabase = connection.getRxAssistant();
    const phoneNumber = `${account.countryCode}${account.phoneNumber}`;
    const accountEntries =
      rxAssistantDatabase.findAccountByPhoneNumber(phoneNumber);
    const existsAccount = await accountEntries.hasNext();
    if (existsAccount) {
      const entry = await accountEntries.next();
      if (entry) {
        if (isComplete) {
          if (!entry.termsAndConditionsAcceptances || !entry.recoveryEmail) {
            return false;
          }
          validateEntry(entry, account);
        }
      } else {
        return false;
      }
    }
    // eslint-disable-next-line no-console
    console.log(`Account ${existsAccount}`);
    return existsAccount;
  } catch (error) {
    throw new Error(`Account verification failed with error ${error}`);
  } finally {
    await connection.close();
  }
}
