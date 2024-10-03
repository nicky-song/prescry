// Copyright 2021 Prescryptive Health, Inc.

import fs from 'fs';
import { MongoClient } from 'mongodb';
import { ServiceBusClient } from '@azure/service-bus';
import { processAccountRecords } from './helpers/process-records.helper.js';
import { searchAccountWithDateOfBirth } from './helpers/account.helper.js';

const orderNumberInit = parseInt(process.argv[2], 10);
const databaseName = process.argv[3];
const batchSize = process.argv[4];
const serviceBusConnectionString = process.argv[5];
const databaseConnectionString = process.argv[6];

const dbClient = new MongoClient(databaseConnectionString);
const serviceBusClient = new ServiceBusClient(serviceBusConnectionString);
try {
  const senderForUpdatePerson = serviceBusClient.createSender(
    'topic-person-update'
  );
  await dbClient.connect();
  console.log('Connected successfully to DB');
  const logger = fs.openSync(`CashMessages_${new Date().getTime()}.json`, 'a');
  fs.appendFileSync(logger, '[');
  let skip = 0;
  let limit = 10000;
  const allAccounts = [];
  while (true) {
    const accountToProcess = await searchAccountWithDateOfBirth(
      dbClient,
      databaseName,
      skip,
      limit
    );
    const newRecordLength = accountToProcess.length;

    skip = skip + newRecordLength;
    console.log(`found records ${newRecordLength} new skip is ${skip}`);
    if (newRecordLength === 0) {
      console.log(`No Accounts matching criteria`);
      break;
    }
    accountToProcess.map((x) => allAccounts.push(x));
    console.log(`Total accounts so far  ${allAccounts.length}`);
  }
  console.log(`Total accounts found ${allAccounts.length} account records`);

  await processAccountRecords(
    dbClient,
    databaseName,
    senderForUpdatePerson,
    orderNumberInit,
    allAccounts,
    batchSize,
    logger
  );
  fs.appendFileSync(logger, ']');
  fs.closeSync(logger);
  console.log(`Done processed total ${allAccounts.length} account records`);
} catch (error) {
  console.log(error);
} finally {
  await dbClient.close();
  await serviceBusClient.close();
}
