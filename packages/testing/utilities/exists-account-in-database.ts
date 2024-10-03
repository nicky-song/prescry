// Copyright 2022 Prescryptive Health, Inc.

import DatabaseConnection from './database/database-connection';

export async function existsAccountInDatabase(
  account: { countryCode: string; phoneNumber: string },
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
          if (
            !entry.termsAndConditionsAcceptances ||
            !entry.recoveryEmail ||
            !entry.pinHash
          ) {
            return false;
          }
        }
      } else {
        return false;
      }
    }
    return existsAccount;
  } catch (error) {
    throw new Error(`Account exists failed with error ${error}`);
  } finally {
    await connection.close();
  }
}
