// Copyright 2022 Prescryptive Health, Inc.

import { createRecordsWithAccount } from './create-records-with-account.js';
import { createRecordsWithActivationPhone } from './create-records-with-activation-phone.js';

import { createRecordsWithCancelledAccount } from './create-records-with-cancelled-account.js';
import { createRecordsWithEmptyPhoneNumber } from './create-records-with-empty-phone-number.js';
import { createRecordsWithSieOnlyProfileNoAccount } from './create-records-with-sie-only.js';
import { createRecordsWithDifferentInfo } from './create-record-with-different-info.js';

import { getEffectiveDate } from '../utils/date-formatter.js';
import { writeToLogAndConsole } from '../utils/logger-file.js';

export const createAllRecords = async (
  totalRecords,
  batchSize,
  sleepInterval,
  dbConnection,
  startPhone,
  databaseName,
  benefitDatabaseName,
  progressLogger,
  totalActivationRecords,
  edgeCaseCashRecords,
  edgeCaseSieRecords
) => {
  var effectiveDate = getEffectiveDate();
  var createdDate = new Date();
  var phoneNum = startPhone;
  
  phoneNum = await createRecordsWithAccount(
    totalRecords,
    batchSize,
    sleepInterval,
    dbConnection,
    phoneNum,
    databaseName,
    benefitDatabaseName,
    progressLogger,
    effectiveDate,
    createdDate
  );
  phoneNum = await createRecordsWithActivationPhone(
    totalActivationRecords,
    batchSize,
    sleepInterval,
    dbConnection,
    phoneNum,
    databaseName,
    benefitDatabaseName,
    progressLogger,
    effectiveDate,
    createdDate
  );

  phoneNum = await createRecordsWithCancelledAccount(
    edgeCaseCashRecords,
    batchSize,
    sleepInterval,
    dbConnection,
    phoneNum,
    databaseName,
    progressLogger,
    effectiveDate
  );
  phoneNum = await createRecordsWithEmptyPhoneNumber(
    edgeCaseCashRecords,
    batchSize,
    sleepInterval,
    dbConnection,
    phoneNum,
    databaseName,
    progressLogger,
    effectiveDate
  );

  phoneNum = await createRecordsWithSieOnlyProfileNoAccount(
    edgeCaseSieRecords,
    batchSize,
    sleepInterval,
    dbConnection,
    phoneNum,
    databaseName,
    benefitDatabaseName,
    progressLogger,
    effectiveDate,
    createdDate
  );

  phoneNum = await createRecordsWithDifferentInfo(
    edgeCaseSieRecords,
    batchSize,
    sleepInterval,
    dbConnection,
    phoneNum,
    databaseName,
    benefitDatabaseName,
    progressLogger,
    effectiveDate,
    createdDate
  );

  await writeToLogAndConsole(
    progressLogger,
    `Finished the script. Final value of phoneNum is ${phoneNum}`
  );
};
