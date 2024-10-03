// Copyright 2022 Prescryptive Health, Inc.

import fs from 'fs';
import { createLoggerFile, closeLoggerFile } from '../utils/logger-file.js';
import { getAllUsersByActivationPhoneNumberOrPhoneNumber } from './person-collection.helper.js';
import { sleep } from '../utils/sleep-interval.js';
import { getPatientByMasterId } from './identity/get-patient-by-masterId.helper.js';
import { matchFirstName } from './fhir.helper.js';

export const validateUsers = async (
  uniqueRecords,
  dbConn,
  databaseName,
  batchSize,
  sleepInterval
) => {
  const exceptionLogger = await createLoggerFile('Exceptions');
  const phoneNumbers = [];

  for (const record of uniqueRecords) {
    const processedPhoneNumber =
      record.phoneNumber.length === 10
        ? `+1${record.phoneNumber}`
        : record.phoneNumber;
    phoneNumbers.push(processedPhoneNumber);
    record.phoneNumber = processedPhoneNumber;
  }

  let skip = 0;
  while (true) {
    const pbmPersonRecords =
      await getAllUsersByActivationPhoneNumberOrPhoneNumber(
        dbConn,
        databaseName,
        phoneNumbers,
        skip,
        batchSize
      );
    const newRecordsLength = pbmPersonRecords.length;
    if (newRecordsLength === 0) {
      console.log(
        'finished pulling activation Phone number records from database'
      );
      await closeLoggerFile(exceptionLogger);
      break;
    }
    const pbmPersonsKeyValueFormat = {};
    for (const person of pbmPersonRecords) {
      const phoneNumberKey = person.activationPhoneNumber ?? person.phoneNumber;
      pbmPersonsKeyValueFormat[phoneNumberKey] = person;
    }

    skip = skip + newRecordsLength;
    for (const record of uniqueRecords) {
      const filteredDBRecord = pbmPersonsKeyValueFormat[record.phoneNumber];
      const patientRecord = await getPatientByMasterId(
        exceptionLogger,
        record.masterId
      );
      if (patientRecord && filteredDBRecord) {
        const matchedFirstNameObject = matchFirstName(
          filteredDBRecord.firstName,
          patientRecord.name
        );
        const lastNameMatch =
          filteredDBRecord.lastName.toUpperCase() ==
          matchedFirstNameObject?.family.toUpperCase();
        const dateMatch =
          filteredDBRecord.dateOfBirth === patientRecord.birthDate;
        const isDataValid =
          dateMatch && !!matchedFirstNameObject && lastNameMatch;
        if (isDataValid) {
          record.isValid = true;
          record.identifier = filteredDBRecord.identifier;
          record.firstName = filteredDBRecord.firstName;
          record.lastName = filteredDBRecord.lastName;
        } else {
          const DBPerson = {
            firstName: filteredDBRecord.firstName,
            lastName: filteredDBRecord.lastName,
            DOB: filteredDBRecord.dateOfBirth,
          };
          const myRxPatient = {
            firstName: matchedFirstNameObject,
            lastName: matchedFirstNameObject?.family.toUpperCase(),
            DOB: patientRecord.birthDate,
          };
          fs.appendFileSync(
            exceptionLogger,
            `Unable to include this record for publishing: phoneNumber -> ${
              record.phoneNumber
            } , patientRecord -> ${JSON.stringify(
              myRxPatient
            )}, filteredDBRecord -> ${JSON.stringify(DBPerson)}\n`
          );
        }
      } else {
        fs.appendFileSync(
          exceptionLogger,
          `Unable to find one of the records for further processing:phoneNumber -> ${
            record.phoneNumber
          } , patientRecord -> ${JSON.stringify(
            patientRecord
          )}, filteredDBRecord -> ${JSON.stringify(filteredDBRecord)}\n`
        );
      }
    }

    console.log(`Beginning the delay of ${sleepInterval} milliseconds...`);
    await sleep(sleepInterval);
    console.log(`Finished the delay of ${sleepInterval} milliseconds.`);
  }
  dbConn.close();
  return uniqueRecords;
};
