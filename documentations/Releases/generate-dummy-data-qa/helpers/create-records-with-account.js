// Copyright 2022 Prescryptive Health, Inc.

import { generateAccountRecord } from '../generators/generate-account-record.js';
import { generateCashPrimaryPersonRecord } from '../generators/generate-cash-person-record.js';
import { generateCashDependentPersonRecord } from '../generators/generate-cash-dependent-record.js';
import { generateSieAndBenefitPersonRecord } from '../generators/generate-sie-and-benefit-person-record.js';

import { sleep } from '../utils/sleep-interval.js';
import { writeToLogAndConsole } from '../utils/logger-file.js';
import { generateAddress } from '../generators/generate-address.js';
import { writeToDB } from '../db-helpers/write-to-db.helper.js';

export const createRecordsWithAccount = async (
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
    'Starting createRecordsWithAccount '
  );
  var phoneNum = startPhone;
  var accounts = [];
  var cashPersons = [];
  var cashDependents = [];
  var siePersons = [];
  var benefitPersons = [];

  for (var i = 1; i <= totalRecords; i++) {
    // Common Fields
    var firstName = `FIRST-${i}`;
    var lastName = `LAST-${i}`;
    var middleInitial = `M${i}`;
    var email = `${firstName}${lastName}@prescryptive.com`;

    var { address1, address2, state, zip, city, county } = generateAddress(i);

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
    accounts.push(
      generateAccountRecord(
        i,
        phoneNumber,
        firstName,
        lastName,
        dateOfBirth,
        email,
        createdDate
      )
    );

    //Cash Profile
    var cashPerson = generateCashPrimaryPersonRecord(
      i,
      phoneNumber,
      firstName,
      lastName,
      dateOfBirth,
      email,
      effectiveDate,
      'DUCA'
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
      cashDependents.push(
        generateCashDependentPersonRecord(
          cashPerson.primaryMemberFamilyId,
          '04',
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

    // SIE Users
    if (i % 5 === 0) {
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
          'DUSI'
        );
      siePersons.push(siePerson);
      benefitPersons.push(benefitPerson);
      if (siePrimaryPerson) {
        siePersons.push(siePrimaryPerson);
      }
      if (benefitPrimaryPerson) {
        benefitPersons.push(benefitPrimaryPerson);
      }
    }

    if (Number.isInteger(i / batchSize)) {
      await writeToDB(
        dbConnection,
        databaseName,
        benefitDatabaseName,
        progressLogger,
        accounts,
        cashPersons,
        cashDependents,
        siePersons,
        benefitPersons,
        'Registered Users'
      );

      await sleep(sleepInterval);
      accounts = [];
      cashPersons = [];
      cashDependents = [];
      siePersons = [];
      benefitPersons = [];
    }
  }
  //Write last batch
  await writeToDB(
    dbConnection,
    databaseName,
    benefitDatabaseName,
    progressLogger,
    accounts,
    cashPersons,
    cashDependents,
    siePersons,
    benefitPersons,
    'Registered Users'
  );
  writeToLogAndConsole(progressLogger, 'Ending createRecordsWithAccount ');
  return phoneNum;
};
