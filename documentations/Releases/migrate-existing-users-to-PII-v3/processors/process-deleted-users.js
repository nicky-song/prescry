// Copyright 2022 Prescryptive Health, Inc.

import { updatePerson } from '../helpers/db-helpers/collection.helper.js';
import {
  searchAllDependents,
  searchAllUsersToDelete,
} from '../helpers/db-helpers/rx-collection.helper.js';
import {
  logLimited,
  logListToFile,
  logProgress,
  logToFile,
  logVerbose,
  runFolder,
} from '../helpers/log.helper.js';
import { batchStep } from '../helpers/process.helper.js';

const batchSize = process.env.BATCH_SIZE
  ? parseInt(process.env.BATCH_SIZE)
  : 50;

const scope = 'DeletedUsers';

export const processDeletedUsers = async (isPublishMode) => {
  logProgress(`\nBeginning ${scope} processor`);
  const allCompletedUsers = [];
  const allFailedUsers = [];
  const {
    successfulUsers: usersToBeDeleted,
    exceptionUsers: failedToIdentify,
  } = await batchStep(scope, 'Identify', identifyDeletedUsers);
  allFailedUsers.push(...failedToIdentify);

  if (isPublishMode) {
    if (!usersToBeDeleted.length) {
      logProgress(`No users found - Skipping publish\n`);
    }
    const { successfulUsers, exceptionUsers } = await batchStep(
      scope,
      'Publish',
      (batchNumber, logScope) =>
        publishDeletedUsers(getBatch(usersToBeDeleted, batchNumber), logScope),
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
    allCompletedUsers.push(...usersToBeDeleted);
  }

  logToFile(scope, 'Completed', `${scope} Successful Users:`);
  logListToFile(
    allCompletedUsers,
    scope,
    'Completed',
    (user, index) => `${getContext(index, user)}: ${JSON.stringify(user)}`
  );
  if (allFailedUsers.length) {
    logToFile(scope, 'Failures', 'Failed users:');
    logListToFile(
      allFailedUsers,
      scope,
      'Failures',
      (user, index) => `${getContext(index, user)}:\n ${JSON.stringify(user)}`
    );
  }
};

const identifyDeletedUsers = async (batchNumber) => {
  const context = `${scope}.Identify:${batchNumber}`;
  const batchStart = batchNumber * batchSize;
  logVerbose(`${context} - Finding empty cash users`);
  const successfulUsers = await searchAllUsersToDelete(batchStart, batchSize);
  logProgress(
    `${context} - Found ${successfulUsers.length} users to delete (empty cash, deleted cash, deleted pbm)`
  );
  const uniqueFamilyIds = [
    ...new Set(successfulUsers.map((x) => x.primaryMemberFamilyId)),
  ];
  logVerbose(`${context} - Finding dependents for current batch`);
  const dependents = await searchAllDependents(uniqueFamilyIds);
  logProgress(`${context} - Found ${dependents.length} dependents`);
  successfulUsers.push(...dependents);

  const processedUsers = successfulUsers.map((user) => ({
    user,
    phoneNumber: user.phoneNumber,
  }));
  return { successfulUsers: processedUsers, exceptionUsers: [] };
};

const publishDeletedUsers = async (batchOfUsers, logScope) => {
  const successfulUsers = [];
  const exceptionUsers = [];
  for (const { user } of batchOfUsers) {
    const { error } = await updatePerson(user.identifier, { deleted: true });
    if (error) {
      const errorMessage = `${logScope}: ${JSON.stringify(error)}`;
      logLimited(errorMessage);
      user.exceptions = [...(user.exceptions ?? []), errorMessage];
      exceptionUsers.push(user);
    } else {
      successfulUsers.push(user);
    }
  }
  return { successfulUsers, exceptionUsers };
};

const getContext = (logScope, user, batchNumber = null) =>
  `${logScope}${batchNumber ? '.' + batchNumber : ''} ${
    user.primaryMemberPersonCode && user.primaryMemberPersonCode !== '01'
      ? 'dependentId ' + user.primaryMemberRxId
      : user.phoneNumber
  }`;

const getBatch = (array, batchNumber) => {
  const batchStart = batchNumber * batchSize;
  const batchEnd = batchStart + batchSize;
  return array.slice(batchStart, batchEnd);
};
