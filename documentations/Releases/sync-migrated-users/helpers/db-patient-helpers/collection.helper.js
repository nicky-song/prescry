// Copyright 2023 Prescryptive Health, Inc.

import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import { logProgress } from '../log.helper.js';

dotenv.config();

const patientDatabaseName = process.env.PATIENT_DATABASE_NAME;

const patientDatabaseConnectionString = process.env.PATIENT_DATABASE_CONNECTION_STRING;

const dbConnection = new MongoClient(patientDatabaseConnectionString);

export const initializeDb = async () => {
  await dbConnection.connect();
};

export const closeConnections = async () => {
  await dbConnection.close();
};

export const searchCollection = (collection, query, skip, limit) =>
  searchDatabaseCollection(patientDatabaseName, collection, query, skip, limit);

const searchDatabaseCollection = async (
  patientDatabaseName,
  collection,
  query,
  skip,
  limit
) => {
  return new Promise((resolve, reject) => {
    dbConnection
      .db(patientDatabaseName)
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
