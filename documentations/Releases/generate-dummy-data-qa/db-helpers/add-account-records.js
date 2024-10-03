// Copyright 2022 Prescryptive Health, Inc.

import { writeToLogAndConsole } from '../utils/logger-file.js';

export const addAccountRecords = async (
  dbConn,
  databaseName,
  accounts,
  progressLogger
) => {
  return new Promise((resolve, reject) => {
    dbConn
      .db(databaseName)
      .collection('Account')
      .insertMany(accounts,
      (err, acc) => {
        if (err) {
          reject(err);
        }
        resolve(acc);
      });
  }).catch((ex) => {
    writeToLogAndConsole(progressLogger, ex);
    throw ex;
  });
};
