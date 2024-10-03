// Copyright 2022 Prescryptive Health, Inc.

import { addAccountRecords } from './add-account-records.js';
import { addPersonRecords } from './add-person-records.js';

import { writeToLogAndConsole } from '../utils/logger-file.js';

export const writeToDB = async (
  dbConnection,
  databaseName,
  benefitDatabaseName,
  progressLogger,
  accounts,
  cashPersons,
  cashDependents,
  siePersons,
  benefitPersons,
  logType
) => {
  try {
    if (accounts && accounts.length > 0) {
      await writeToLogAndConsole(
        progressLogger,
        `Creating ${accounts.length} ${logType} account records in DB`
      );
      await addAccountRecords(
        dbConnection,
        databaseName,
        accounts,
        progressLogger
      );
    }
    if (cashPersons && cashPersons.length > 0) {
      await writeToLogAndConsole(
        progressLogger,
        `Creating ${cashPersons.length} ${logType} Primary Cash Person records in DB`
      );
      await addPersonRecords(
        dbConnection,
        databaseName,
        cashPersons,
        progressLogger
      );
    }
    if (cashDependents && cashDependents.length > 0) {
      await writeToLogAndConsole(
        progressLogger,
        `Creating ${cashDependents.length} ${logType} Dependents Cash Person records in DB`
      );
      await addPersonRecords(
        dbConnection,
        databaseName,
        cashDependents,
        progressLogger
      );
    }

    if (siePersons && siePersons.length > 0) {
      await writeToLogAndConsole(
        progressLogger,
        `Creating ${siePersons.length} ${logType} Primary Sie Person records in DB`
      );
      await addPersonRecords(dbConnection, databaseName, siePersons);
    }
    if (benefitPersons && benefitPersons.length > 0) {
      await writeToLogAndConsole(
        progressLogger,
        `Creating ${benefitPersons.length} ${logType} Primary Benefit Person records in DB`
      );
      await addPersonRecords(dbConnection, benefitDatabaseName, benefitPersons);
    }
  } catch (ex) {
    await writeToLogAndConsole(
      progressLogger,
      `Error occured in writing to DB in createRecordsWithAccount ${ex.message}`
    );
    throw ex;
  }
};
