// Copyright 2022 Prescryptive Health, Inc.

import fs from 'fs';
import { parse } from 'csv-parse';
import { ServiceBusClient } from '@azure/service-bus';
import { publishUniqueRecords } from './publish-records.helper.js';

const serviceBusConnectionString = process.argv[2];
const isTestMode =
  typeof process.argv[3] === 'string'
    ? process.argv[3] === 'true'
    : process.argv[3];
const isPublishMessage =
  typeof process.argv[3] === 'string'
    ? process.argv[4] === 'true'
    : process.argv[4];
const batchSize = parseInt(process.argv[5]);
const serviceBusClient = new ServiceBusClient(serviceBusConnectionString);

try {
  const senderForUpdatePerson = serviceBusClient.createSender(
    'topic-person-update'
  );
  const logger = fs.openSync(
    `FinishPhoneNumberVerification_${new Date().getTime()}.log`,
    'a'
  );

  const removeDuplicates = (array, key) =>
    array.filter(
      (v, i, a) => a.findIndex((t) => [key].every((k) => t[k] === v[k])) === i
    );

  const resultArray = [];

  const parser = parse({ columns: false }, function (err, records) {
    records.map((record) => {
      resultArray.push({
        identifier: record[1],
        phoneNumber: record[2],
      });
    });
    fs.appendFileSync(
      logger,
      `Total records in csv: ${resultArray.length} \n `
    );
    const uniqueRecords = removeDuplicates(resultArray, 'phoneNumber');
    publishUniqueRecords(
      uniqueRecords,
      logger,
      senderForUpdatePerson,
      isTestMode,
      isPublishMessage,
      batchSize,
      serviceBusClient
    );
  });

  fs.createReadStream('phone_numbers_to_complete_verfication.csv').pipe(parser);
} catch (error) {
  console.log(error);
  await serviceBusClient.close();
}
