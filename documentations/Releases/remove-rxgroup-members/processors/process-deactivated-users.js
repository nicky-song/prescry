// Copyright 2022 Prescryptive Health, Inc.

import dateformat from 'dateformat';
import { updatePerson } from '../helpers/db-helpers/collection.helper.js';
import { getPersonsForRx } from '../helpers/db-helpers/rx-collection.helper.js';
import {
  logLimited,
  logListToFile,
  logProgress,
  logToFile,
  logVerbose,
  runFolder,
} from '../helpers/log.helper.js';
import { batchStep } from '../helpers/process.helper.js';

const loadedRxGroup = process.env.RX_GROUP;
const loadedRxSubGroup = process.env.RX_SUB_GROUP;

const batchSize = process.env.BATCH_SIZE
  ? parseInt(process.env.BATCH_SIZE)
  : 50;

const scope = 'DeactivatedUsers';

export const processDeactivatedUsers = async (isPublishMode) => {
  logProgress(`\nBeginning ${scope} processor`);
  const allCompletedUsers = [];
  const allFailedUsers = [];
  const {
    successfulUsers: usersToBeDeactivated,
    exceptionUsers: failedToIdentify,
  } = await batchStep(scope, 'Identify', identifyDeactivatedUsers);
  allFailedUsers.push(...failedToIdentify);

  if (isPublishMode) {
    if (!usersToBeDeactivated.length) {
      logProgress(`No users found - Skipping publish\n`);
    }
    const { successfulUsers, exceptionUsers } = await batchStep(
      scope,
      'Publish',
      (batchNumber, logScope) =>
        publishDeactivatedUsers(
          getBatch(usersToBeDeactivated, batchNumber),
          logScope
        ),
      true
    );

    allCompletedUsers.push(...successfulUsers);
    allFailedUsers.push(...exceptionUsers);

    const logPath = `logs/${runFolder}/${scope}/`;
    logProgress(
      `${scope} total - successful: ${allCompletedUsers.length}, failures: ${allFailedUsers.length} - see ${logPath} logs for details`
    );
  } else {
    logProgress(`Publish mode is FALSE - Skipping publish\n`);
    allCompletedUsers.push(...usersToBeDeactivated);
  }

  logToFile(scope, 'Completed', `${scope} Successful Users:`);
  logListToFile(
    allCompletedUsers,
    scope,
    isPublishMode ? 'Completed' : 'Identified',
    (user) => `${getContext(scope, user)}: ${JSON.stringify(user)}`
  );
  if (allFailedUsers.length) {
    logToFile(scope, 'Failures', 'Failed users:');
    logListToFile(
      allFailedUsers,
      scope,
      'Failures',
      (user) => `${getContext(scope, user)}:\n ${JSON.stringify(user)}`
    );
  }
};

const identifyDeactivatedUsers = async (batchNumber, logScope) => {
  const context = `${scope}.Identify:${batchNumber}`;
  const batchStart = batchNumber * batchSize;
  const successfulUsers = await getPersonsForRx(
    { rxGroup: loadedRxGroup, rxSubGroup: loadedRxSubGroup },
    batchStart,
    batchSize
  );
  logProgress(
    `${context} - Found ${
      successfulUsers.length
    } users to deactivate (from rxGroup ${loadedRxGroup}${
      loadedRxSubGroup ? ` and rxSubGroup ${loadedRxSubGroup}` : ''
    })`
  );

  successfulUsers.forEach((x) =>
    logVerbose(`${getContext(logScope, x)}: found`)
  );

  return { successfulUsers, exceptionUsers: [] };
};

const publishDeactivatedUsers = async (batchOfUsers, logScope) => {
  const successfulUsers = [];
  const exceptionUsers = [];
  for (const user of batchOfUsers) {
    const updatedFields = {
      phoneNumber: `X${user.phoneNumber}`,
      isPhoneNumberVerified: false,
    };
    const { error } = await updatePerson(user.identifier, updatedFields);
    if (error) {
      const errorMessage = `${logScope}: ${JSON.stringify(error)}`;
      logLimited(errorMessage);
      user.exceptions = [errorMessage];
      exceptionUsers.push(user);
    } else {
      logProgress(
        `${getContext(logScope, user)}: updated ${
          user.identifier
        } with ${JSON.stringify(updatedFields)}`
      );
      successfulUsers.push(user);
    }
  }
  return { successfulUsers, exceptionUsers };
};

const getContext = (logScope, user) =>
  `${logScope} ${
    user.primaryMemberPersonCode && user.primaryMemberPersonCode !== '01'
      ? user.primaryMemberRxId
      : user.phoneNumber
  }`;

const getBatch = (array, batchNumber) => {
  const batchStart = batchNumber * batchSize;
  const batchEnd = batchStart + batchSize;
  return array.slice(batchStart, batchEnd);
};
