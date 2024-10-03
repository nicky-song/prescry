// Copyright 2022 Prescryptive Health, Inc.

import { MongoClient } from 'mongodb';
import { createAllRecords } from './helpers/create-all-records.js';
import {
  createLoggerFile,
  closeLoggerFile,
  writeToLogAndConsole,
} from './utils/logger-file.js';

import dotenv from 'dotenv';

dotenv.config();
const databaseConnectionString = process.env.DATABASE_CONNECTION_STRING;
const databaseName = process.env.DATABASE_NAME;
const benefitDatabaseName = process.env.BENEFIT_DATABASE_NAME;
const batchSize = Number(process.env.BATCH_SIZE);
const totalRecords = Number(process.env.TOTAL_RECORDS);
const sleepTime = Number(process.env.SLEEP_INTERVAL);
const startPhone = Number(process.env.START_PHONE);
const totalActivationRecords = Number(process.env.ACTIVATION_TOTAL_RECORDS);
const edgeCaseCashRecords = Number(process.env.EDGE_CASE_RECORDS_CASH);
const edgeCaseSieRecords = Number(process.env.EDGE_CASE_RECORDS_SIE);

const dbClient = new MongoClient(databaseConnectionString);
const progressLogger = await createLoggerFile('Progress');
try {
  await dbClient.connect();
  await writeToLogAndConsole(progressLogger, 'Connected successfully to DB');

  await createAllRecords(
    totalRecords,
    batchSize,
    sleepTime,
    dbClient,
    startPhone,
    databaseName,
    benefitDatabaseName,
    progressLogger,
    totalActivationRecords,
    edgeCaseCashRecords,
    edgeCaseSieRecords
  );
  await writeToLogAndConsole(progressLogger, 'Done processing!');
} catch (e) {
  await writeToLogAndConsole(progressLogger, e);
} finally {
  await dbClient.close();
  closeLoggerFile(progressLogger);
}
