// Copyright 2022 Prescryptive Health, Inc.

import { writeToLogAndConsole } from '../utils/logger-file.js';

export const addPersonRecords = async (
    dbConn,
    databaseName,
    persons, 
    progressLogger
  ) => {
    return new Promise((resolve, reject) => {
      dbConn
        .db(databaseName)
        .collection('Person')
        .insertMany(persons,
        (err, per) => {
          if (err) {
            reject(err);
          }
          resolve(per);
        });
    }).catch((ex) => {
      writeToLogAndConsole(progressLogger, ex);
      throw ex;
    });
  };
  