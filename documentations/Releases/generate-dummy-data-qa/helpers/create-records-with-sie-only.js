// Copyright 2022 Prescryptive Health, Inc.

import { writeToDB } from '../db-helpers/write-to-db.helper.js';

import { generateSieAndBenefitPersonRecord } from '../generators/generate-sie-and-benefit-person-record.js';
import { generateAddress } from '../generators/generate-address.js';

import { sleep } from '../utils/sleep-interval.js';
import { writeToLogAndConsole } from '../utils/logger-file.js';

export const createRecordsWithSieOnlyProfileNoAccount = async (
  totalRecords,
  batchSize,
  sleepInterval,
  dbConnection,
  startPhone,
  databaseName,
  benefitDatabaseName,
  progressLogger,
  effectiveDate,
  createdDate
) => {
  await writeToLogAndConsole(
    progressLogger,
    'Starting createRecordsWithSieOnlyProfileNoAccount '
  );
  var phoneNum = startPhone;
  var siePersons = [];
  var benefitPersons = [];

  for (var i = 1; i <= totalRecords; i++) {
    // Common Fields
    var firstName = `FIRST-${i}`;
    var lastName = `LAST-${i}`;
    var middleInitial = `M${i}`;

    var { address1, address2, state, zip, city } = generateAddress(i, 'S-');

    phoneNum = phoneNum + 1;
    var phoneNumber = `+1${phoneNum}`;

    var month = i % 12;
    if (month === 0 || month > 12) {
      month = 12;
    }
    var year = 1954 + (i % 49);
    if (year === 0 || year > 2003) {
      year = 2003;
    }

    var day = i % 28;
    if (day === 0 || day > 28) {
      day = 28;
    }
    var dateOfBirth = `${year.toString()}-${month
      .toString()
      .padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

    var isSecondary = i % 10 === 0;
    var { siePerson, benefitPerson, siePrimaryPerson, benefitPrimaryPerson } =
      generateSieAndBenefitPersonRecord(
        i,
        phoneNumber,
        firstName,
        middleInitial,
        lastName,
        dateOfBirth,
        address1,
        address2,
        city,
        state,
        zip,
        effectiveDate,
        createdDate,
        false,
        isSecondary,
        'DUSO'
      );
    siePersons.push(siePerson);
    benefitPersons.push(benefitPerson);
    if (siePrimaryPerson) {
      siePersons.push(siePrimaryPerson);
    }
    if (benefitPrimaryPerson) {
      benefitPersons.push(benefitPrimaryPerson);
    }

    if (Number.isInteger(i / batchSize)) {
      await writeToDB(
        dbConnection,
        databaseName,
        benefitDatabaseName,
        progressLogger,
        undefined,
        undefined,
        undefined,
        siePersons,
        benefitPersons,
        'Registered SIE only Users'
      );
      await sleep(sleepInterval);

      siePersons = [];
      benefitPersons = [];
    }
  }
  await writeToDB(
    dbConnection,
    databaseName,
    benefitDatabaseName,
    progressLogger,
    undefined,
    undefined,
    undefined,
    siePersons,
    benefitPersons,
    'Registered SIE only Users'
  );
  await writeToLogAndConsole(
    progressLogger,
    'Ending createRecordsWithSieOnlyProfileNoAccount '
  );
  return phoneNum;
};
