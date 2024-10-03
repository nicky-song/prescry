// Copyright 2022 Prescryptive Health, Inc.

import { closeLoggers, logProgress } from './log.helper.js';
import {
  closeConnections,
  initializeDb,
} from './db-helpers/collection.helper.js';
import { getAuth0Token } from './request/auth0.helper.js';

export async function initialize(doWork) {
  try {
    global.startTime = new Date().getTime();
    logProgress('Connecting to DB');
    await initializeDb();

    logProgress('Connected successfully to DB');

    global.auth0Token = await getAuth0Token();

    await doWork();
  } catch (e) {
    await logProgress(e);
  } finally {
    await closeConnections();
    await closeLoggers();
  }
}
