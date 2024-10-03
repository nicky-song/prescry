// Copyright 2022 Prescryptive Health, Inc.

import fs from 'fs';
import { parse } from 'csv-parse';
import { ServiceBusClient } from '@azure/service-bus';
// import { publishUniqueRecords } from './publish-records.helper.js';
import dotenv from 'dotenv';
import { validateUsers } from './helpers/validate-users.js';
import { MongoClient } from 'mongodb';
import { generateIdentityBearerToken } from './helpers/identity/generate-auth-token.helper.js';
import { publishRecordsToInsertMasterIdField } from './helpers/publish-records.js';
import { createLoggerFile } from './utils/logger-file.js';

dotenv.config();
const serviceBusConnectionString = process.env.SERVICE_BUS_CONNECTION_STRING;
const databaseConnectionString = process.env.DATABASE_CONNECTION_STRING;
const databaseName = process.env.DATABASE_NAME;
const limit = Number(process.env.LIMIT);
const interval = Number(process.env.SLEEP_INTERVAL);
const isPublishMessage = process.env.IS_PUBLISH_MESSAGE === 'true';

const dbClient = new MongoClient(databaseConnectionString);
const serviceBusClient = new ServiceBusClient(serviceBusConnectionString);

try {
  await dbClient.connect();
  console.log('Connected successfully to DB');
  const progessLogger = await createLoggerFile('RedirectUsers_ProgressLogger');
  const removeDuplicates = (array, key) =>
    array.filter(
      (v, i, a) => a.findIndex((t) => [key].every((k) => t[k] === v[k])) === i
    );

  const resultArray = [];

  const parser = parse({ columns: false }, async function (err, records) {
    records.map((record, i) => {
      const isHeaderRow = i === 0;
      if (isHeaderRow) return;
      resultArray.push({
        phoneNumber: record[0],
        memberId: record[1],
        masterId: record[2],
        isValid: false,
      });
    });
    fs.appendFileSync(
      progessLogger,
      `Total records in csv: ${resultArray.length}\n`
    );
    const uniqueRecords = removeDuplicates(resultArray, 'phoneNumber');
    global.identityToken = await generateIdentityBearerToken(
      process.env.IDENTITY_API_CLIENT_ID,
      process.env.IDENTITY_API_CLIENT_SECRET,
      process.env.IDENTITY_API_AUDIENCE
    );
    fs.appendFileSync(
      progessLogger,
      `Total records to process after removing duplicates: ${uniqueRecords.length}\n`
    );

    const validatedUsers = await validateUsers(
      uniqueRecords,
      dbClient,
      databaseName,
      limit,
      interval
    );

    fs.appendFileSync(
      progessLogger,
      `Total records to publish after validating users: ${validatedUsers.length}\n`
    );
    publishRecordsToInsertMasterIdField(
      serviceBusClient,
      validatedUsers,
      limit,
      interval,
      isPublishMessage,
      progessLogger
    );
  });
  fs.createReadStream('redirect_user_data.csv').pipe(parser);
} catch (error) {
  console.log(error);
  await serviceBusClient.close();
  dbClient.close();
}
