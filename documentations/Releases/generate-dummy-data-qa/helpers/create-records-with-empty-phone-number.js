// Copyright 2022 Prescryptive Health, Inc.

import { writeToDB } from '../db-helpers/write-to-db.helper.js';

import { generateCashPrimaryPersonRecord } from '../generators/generate-cash-person-record.js';
import { generateCashDependentPersonRecord } from '../generators/generate-cash-dependent-record.js';
import { generateAddress } from '../generators/generate-address.js';

import { sleep } from '../utils/sleep-interval.js';
import { writeToLogAndConsole } from '../utils/logger-file.js';

export const createRecordsWithEmptyPhoneNumber = async (
  totalRecords,
  batchSize,
  sleepInterval,
  dbConnection,
  startPhone,
  databaseName,
  progressLogger,
  effectiveDate
) => {
  await writeToLogAndConsole(
    progressLogger,
    'Starting createRecordsWithEmptyPhoneNumber '
  );
  var phoneNum = startPhone;
  var accounts = [];
  var cashPersons = [];
  var cashDependents = [];

  for (var i = 1; i <= totalRecords; i++) {
    // Common Fields
    var firstName = `FIRST-C-${i}`;
    var lastName = `LAST-C-${i}`;
    var email = `${firstName}${lastName}@prescryptive.com`;

    var { address1, state, zip, city, county } = generateAddress(i, 'C-');

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

    // Accounts
    accounts.push({ phoneNumber, isDummy: true });

    //Cash Profile
    var cashPerson = generateCashPrimaryPersonRecord(
      i,
      '',
      firstName,
      lastName,
      dateOfBirth,
      email,
      effectiveDate,
      'DUEM'
    );
    cashPersons.push(cashPerson);
    if (i % 2 === 0) {
      // Add address to CASH Profile
      cashPerson.address1 = address1;
      cashPerson.city = city;
      cashPerson.state = state;
      cashPerson.zip = zip;
      cashPerson.county = county;
    }

    // Cash Dependents
    if (i % 4 === 0) {
      // create dependents
      cashDependents.push(
        generateCashDependentPersonRecord(
          cashPerson.primaryMemberFamilyId,
          '03',
          firstName,
          lastName,
          day,
          month,
          year,
          address1,
          city,
          state,
          zip,
          county,
          effectiveDate
        )
      );
    }

    if (i !== 0 && Number.isInteger(i / batchSize)) {
      await writeToDB(
        dbConnection,
        databaseName,
        undefined,
        progressLogger,
        accounts,
        cashPersons,
        cashDependents,
        undefined,
        undefined,
        'Empty Phone Number Users'
      );
      await sleep(sleepInterval);
      accounts = [];
      cashPersons = [];
      cashDependents = [];
    }
  }

  await writeToDB(
    dbConnection,
    databaseName,
    undefined,
    progressLogger,
    accounts,
    cashPersons,
    cashDependents,
    undefined,
    undefined,
    'Empty Phone Number Users'
  );
  await writeToLogAndConsole(
    progressLogger,
    'Ending createRecordsWithEmptyPhoneNumber '
  );
  return phoneNum;
};
