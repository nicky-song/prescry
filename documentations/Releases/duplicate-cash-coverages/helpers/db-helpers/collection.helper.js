// Copyright 2023 Prescryptive Health, Inc.

import dotenv from 'dotenv';
import { ServiceBusClient } from '@azure/service-bus';
import { MongoClient } from 'mongodb';
import { logProgress } from '../log.helper.js';

dotenv.config();

const databaseName = process.env.DATABASE_NAME;
const benefitDatabaseName = 'Benefit';

const serviceBusConnectionString = process.env.SERVICE_BUS_CONNECTION_STRING;
const databaseConnectionString = process.env.DATABASE_CONNECTION_STRING;

const dbConnection = new MongoClient(databaseConnectionString);
const serviceBusClient = new ServiceBusClient(serviceBusConnectionString);

export const initializeDb = async () => {
  await dbConnection.connect();
};

export const closeConnections = async () => {
  await dbConnection.close();
  await serviceBusClient.close();
};

export const searchCollection = (collection, query, skip, limit) =>
  searchDatabaseCollection(databaseName, collection, query, skip, limit);

export const searchBenefitCollection = (collection, query, skip, limit) =>
  searchDatabaseCollection(benefitDatabaseName, collection, query, skip, limit);

const searchDatabaseCollection = async (
  databaseName,
  collection,
  query,
  skip,
  limit
) => {
  return new Promise((resolve, reject) => {
    dbConnection
      .db(databaseName)
      .collection(collection)
      .find(query)
      .skip(skip ?? 0)
      .limit(limit ?? 10000)
      .toArray((err, users) => {
        if (err) {
          reject(err);
        }
        resolve(users);
      });
  }).catch((ex) => {
    logProgress(ex);
    throw ex;
  });
};
