// Copyright 2021 Prescryptive Health, Inc.
import { searchCashPersonForPhoneNumber } from './person.helper.js';
import { buildPersonRecord } from './build-person-record.js';

export const processAccountRecords = async (
  dbConn,
  databaseName,
  sender,
  orderNumberInit,
  accountToProcess,
  batchSize,
  logger
) => {
  let i = 0;
  let totalCashPersonAdded = 0;
  for (const account of accountToProcess) {
    const personCreated = await processAccount(
      dbConn,
      databaseName,
      sender,
      account,
      orderNumberInit + totalCashPersonAdded,
      logger
    );
    i++;
    if (personCreated) {
      totalCashPersonAdded++;
    }
    if (Number.isInteger(i / batchSize)) {
      console.log(`Total number of account records processed ${i}`);
      const timeout = i < 50000 ? 10000 : 5000;
      await new Promise((r) => setTimeout(r, timeout));
    }
  }
  console.log(
    `Total number of person records published ${totalCashPersonAdded}`
  );
};

const processAccount = async (
  dbConn,
  databaseName,
  sender,
  account,
  orderNumber,
  logger
) => {
  const cashPerson = await searchCashPersonForPhoneNumber(
    dbConn,
    databaseName,
    account.phoneNumber
  );
  if (
    cashPerson.length === 0 &&
    account.firstName &&
    account.lastName &&
    account.dateOfBirth
  ) {
    await buildPersonRecord(
      sender,
      account.firstName,
      account.lastName,
      account.dateOfBirth,
      account.phoneNumber,
      account.recoveryEmail?.trim() ?? '',
      orderNumber,
      logger
    );
    return true;
  }
  return false;
};
