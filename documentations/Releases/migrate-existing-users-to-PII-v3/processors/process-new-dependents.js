// Copyright 2022 Prescryptive Health, Inc.

import { createPatientAccount } from '../helpers/patient-account/create-patient-account.js';
import {
  getAllExistingCashDependents,
  searchAllPrimaryUsers,
} from '../helpers/db-helpers/rx-collection.helper.js';
import {
  logLimited,
  logListToFile,
  logProgress,
  logToFile,
  logVerbose,
  runFolder,
} from '../helpers/log.helper.js';
import { asyncBatch, batchStep } from '../helpers/process.helper.js';
import { buildCashCoverage } from '../helpers/cash-coverage/cash-coverage.helper.js';
import { toLookup } from '../utils/to-lookup.js';
import { buildPatientAccount } from '../helpers/patient-account/patient-account.helper.js';
import { updatePerson } from '../helpers/db-helpers/collection.helper.js';
import { getPatientAccountByReference } from '../helpers/patient-account/get-patient-account-by-reference.js';
import { createCashCoverage } from '../helpers/cash-coverage/create-coverage-record.js';
import { formatDuration, now } from '../utils/time-formatter.js';

const batchSize = process.env.BATCH_SIZE
  ? parseInt(process.env.BATCH_SIZE)
  : 50;

const scope = 'NewDependents';

export const processNewDependents = async (isPublishMode) => {
  logProgress(`\nBeginning ${scope} processor`);
  const allFailedUsers = [];
  const allCompletedUsers = [];
  const startTime = now();
  const {
    successfulUsers: usersToBePublished,
    exceptionUsers: failedToIdentify,
  } = await batchStep(scope, 'Identify', identifyAndBuildNewDependents);
  allFailedUsers.push(...failedToIdentify);

  logToFile(scope, 'Failures', 'Failed users:');
  if (failedToIdentify.length) {
    logListToFile(
      failedToIdentify,
      scope,
      'Failures',
      (user) =>
        `${getContext(scope, user)}: ${JSON.stringify(
          user.profile.exceptions
        )}\n ${JSON.stringify(user)}`
    );
  }

  if (isPublishMode) {
    if (!usersToBePublished.length) {
      logProgress('No users to publish, skipping publish step');
    } else {
      logToFile(scope, 'Completed', `${scope} Successful Users:`);
      for (
        let batchNumber = 0, batchStart = 0;
        batchStart < usersToBePublished.length;
        batchStart += batchSize, batchNumber++
      ) {
        const batchFailures = [];
        const batchStartTime = now();
        logProgress(
          `\nStarting publish batch ${batchNumber + 1} of ${
            Math.floor(usersToBePublished.length / batchSize) + 1
          }`
        );
        const usersToPublish = usersToBePublished.slice(
          batchStart,
          batchStart + batchSize
        );
        const {
          successfulUsers: publishedUsers,
          exceptionUsers: failedToPublish,
        } = await batchStep(
          scope,
          `PublishPatient`,
          (innerBatchNumber, logScope) => {
            return publishCashPatients(
              batchNumber,
              getBatch(usersToPublish, innerBatchNumber),
              logScope
            );
          },
          true
        );
        batchFailures.push(...failedToPublish);

        const {
          successfulUsers: publishedCoverages,
          exceptionUsers: failedToPublishCoverages,
        } = await batchStep(
          scope,
          `BuildAndPublishCoverage`,
          (innerBatchNumber, logScope) => {
            return buildAndPublishCashCoverages(
              batchNumber,
              getBatch(publishedUsers, innerBatchNumber),
              logScope
            );
          },
          true
        );
        batchFailures.push(...failedToPublishCoverages);

        const {
          successfulUsers: batchCompleted,
          exceptionUsers: failedToPublishIds,
        } = await batchStep(
          scope,
          `PublishAccountIds`,
          (innerBatchNumber, logScope) => {
            return publishAccountIds(
              batchNumber,
              getBatch(publishedCoverages, innerBatchNumber),
              logScope
            );
          },
          true
        );

        logListToFile(
          batchCompleted,
          scope,
          'Completed',
          (user) => `${getContext(scope, user)}`
        );

        if (batchFailures.length) {
          logListToFile(
            batchFailures,
            scope,
            'Failures',
            (user) =>
              `${getContext(scope, user)}: ${JSON.stringify(
                user.profile.exceptions
              )}`
          );
        }

        batchFailures.push(...failedToPublishIds);
        allFailedUsers.push(...batchFailures);
        allCompletedUsers.push(...batchCompleted);

        const logPath = `logs/${runFolder}/${scope}/`;
        logProgress(
          `\n${scope} batch total - successful: ${batchCompleted.length}, failures: ${batchFailures.length} - see ${logPath} logs for details`
        );

        const batchAverageDuration =
          (now() - batchStartTime) /
          (batchCompleted.length + batchFailures.length);
        logProgress(
          `${scope} batch average time ${Math.trunc(
            (now() - batchStartTime) / 1000
          )}s/${
            batchCompleted.length + batchFailures.length
          } users - ${formatDuration(batchAverageDuration)} per user`
        );
      }

      const logPath = `logs/${runFolder}/${scope}/`;
      logProgress(
        `${scope} complete total - successful: ${allCompletedUsers.length}, failures: ${allFailedUsers.length} - see ${logPath} logs for details`
      );
      const averageDuration =
        (now() - startTime) /
        (allCompletedUsers.length + allFailedUsers.length);
      logProgress(
        `${scope} average time ${Math.trunc((now() - startTime) / 1000)}s/${
          allCompletedUsers.length + allFailedUsers.length
        } users - ${formatDuration(averageDuration)} per user`
      );
      const totalEstimatedTime = averageDuration * 250000;
      const nightlyEstimatedTime = averageDuration * 50000;
      logProgress(
        `At this rate, total estimated time for 250k users is ${formatDuration(
          totalEstimatedTime
        )}`
      );
      logProgress(
        `At this rate, total estimated time for 50k users is ${formatDuration(
          nightlyEstimatedTime
        )}`
      );
    }
  } else {
    logProgress(`Publish mode is FALSE - Skipping publish\n`);
    const logPath = `logs/${runFolder}/${scope}/Completed.log`;
    logProgress(
      `${scope} complete total - identified: ${usersToBePublished.length}, failures: ${allFailedUsers.length} - see ${logPath} logs for details`
    );
    logListToFile(
      usersToBePublished,
      scope,
      'Identified',
      (user) => `${getContext(scope, user)}`
    );
  }
};

const identifyAndBuildNewDependents = async (batchNumber, logScope) => {
  const batchStart = batchNumber * batchSize;
  const exceptionUsers = [];
  logLimited(
    `${logScope}: Getting batch of unpublished cash dependents`,
    logScope
  );
  const unpublishedDependents = await getAllExistingCashDependents(
    batchStart,
    batchSize
  );

  logLimited(
    `${logScope}: Getting associated profiles for ${unpublishedDependents.length} users`,
    logScope
  );
  const hydratedDependents = unpublishedDependents.map((x) => ({
    cashProfile: x,
    exceptions: [],
  }));

  const uniqueFamilyIds = unpublishedDependents.map(
    (x) => x.primaryMemberFamilyId
  );
  const primaryUsers = await searchAllPrimaryUsers(uniqueFamilyIds);
  const primaryPhoneNumberByCashFamilyId = toLookup(
    primaryUsers,
    (x) => x.primaryMemberFamilyId,
    (x) => x.phoneNumber
  );
  const primaryMasterIdByCashFamilyId = toLookup(
    primaryUsers,
    (x) => x.primaryMemberFamilyId,
    (x) => x.masterId
  );

  const getPrimaryPhone = (x) =>
    primaryPhoneNumberByCashFamilyId[x.cashProfile.primaryMemberFamilyId];
  const getMasterId = (x) =>
    primaryMasterIdByCashFamilyId[x.cashProfile.primaryMemberFamilyId];
  const processedUsers = hydratedDependents.map((profile) => ({
    profile,
    newPatientAccount: buildPatientAccount(profile, getPrimaryPhone(profile)),
    phoneNumber: getPrimaryPhone(profile),
    primaryMasterId: getMasterId(profile),
    isDependent: true,
  }));
  return {
    successfulUsers: processedUsers,
    exceptionUsers,
  };
};

const publishCashPatients = async (batchNumber, batchOfUsers, logScope) => {
  const successfulUsers = [];
  const exceptionUsers = [];
  if (!batchOfUsers.length) {
    return { successfulUsers: [], exceptionUsers: [] };
  }
  logProgress(
    `${logScope}.${batchNumber}: Publishing batch of ${batchOfUsers.length} patients`,
    logScope
  );
  await asyncBatch(
    batchOfUsers,
    async (user) => {
      logVerbose(
        `${getContext(logScope, user, batchNumber)}: Creating patient`
      );
      return await createPatientAccount(user.newPatientAccount, logScope);
    },
    async (user, { isSuccess, record, error }) => {
      if (error?.error?.includes('Reference values not unqiue: Reference:')) {
        logLimited(
          `${getContext(
            logScope,
            user,
            batchNumber
          )}: patient account already exists, fetching existing account`,
          logScope
        );

        ({ isSuccess, record, error } = await getPatientAccountByReference(
          user.profile.cashProfile.primaryMemberRxId,
          logScope
        ));
        if (record) {
          logLimited(
            `${getContext(
              logScope,
              user,
              batchNumber
            )}: patientAccount found with accountId: ${record.accountId}`,
            logScope
          );
        } else {
          isSuccess = false;
          error = {
            error:
              'Patient reference had a conflict, but patient could not be found for this reference:' +
              user.profile.cashProfile.primaryMemberRxId,
          };
        }
      }

      if (!isSuccess) {
        const errorMessage = `${getContext(
          logScope,
          user,
          batchNumber
        )}: ${JSON.stringify(error)}`;
        logLimited(errorMessage, logScope);
        exceptionUsers.push(user);
        user.profile.exceptions.push(errorMessage);
        return;
      }

      user.newPatientAccount = record;
      user.patientId = getPatientIdFromAccount(record);
      user.accountId = record.accountId;

      successfulUsers.push(user);
    }
  );

  return { successfulUsers, exceptionUsers };
};

const buildAndPublishCashCoverages = async (
  batchNumber,
  batchOfUsers,
  logScope
) => {
  const successfulUsers = [];
  const exceptionUsers = [];
  if (!batchOfUsers.length) {
    return { successfulUsers: [], exceptionUsers: [] };
  }
  logLimited(
    `${logScope}.${batchNumber}: Publishing batch of ${batchOfUsers.length} cash coverages`,
    logScope
  );

  await asyncBatch(
    batchOfUsers,
    (user) => {
      const cashCoverage = buildCashCoverage(
        user.profile,
        user.primaryMasterId,
        user.patientId
      );
      logVerbose(
        `${getContext(logScope, user, batchNumber)}: Creating cash coverage`,
        logScope
      );
      return createCashCoverage(cashCoverage, logScope);
    },
    (user, { isSuccess, record, error }) => {
      if (!isSuccess || !record) {
        const errorMessage = `${getContext(
          logScope,
          user,
          batchNumber
        )}: ${JSON.stringify(error)} ${
          !record ? 'Record not returned from create coverage' : ''
        }`;
        logLimited(errorMessage, logScope);
        user.profile.exceptions.push(errorMessage);
        exceptionUsers.push(user);
        return;
      } else if (record) {
        logVerbose(
          `${getContext(
            logScope,
            user,
            batchNumber
          )}: created cash coverage with id: ${record.id}`,
          logScope
        );
      }

      user.cashCoverage = record;

      successfulUsers.push(user);
    }
  );
  return { successfulUsers, exceptionUsers };
};

const publishAccountIds = async (batchNumber, batchOfUsers, logScope) => {
  const successfulUsers = [];
  const exceptionUsers = [];
  if (!batchOfUsers.length) {
    return { successfulUsers: [], exceptionUsers: [] };
  }
  for (const user of batchOfUsers) {
    logLimited(
      `${getContext(
        logScope,
        user,
        batchNumber
      )}: Updating profiles with accountId and masterId`,
      logScope
    );

    const { error: cashUpdateError } = await updatePerson(
      user.profile.cashProfile.identifier,
      {
        accountId: user.accountId,
        masterId: user.patientId,
      }
    );

    if (cashUpdateError) {
      const errorMessage = `${getContext(
        logScope,
        user,
        batchNumber
      )}: ${JSON.stringify(cashUpdateError)}`;
      logLimited(errorMessage, logScope);
      user.profile.exceptions.push(errorMessage);
      exceptionUsers.push(user);
    } else {
      logLimited(
        `${getContext(logScope, user, batchNumber)}: updated accountId:${
          user.accountId
        } and masterId:${user.patientId} for account and person`,
        logScope
      );
      successfulUsers.push(user);
    }
  }
  return { successfulUsers, exceptionUsers };
};

const getPatientIdFromAccount = (patientAccount) => {
  // Matches the end of a url
  // i.e. https://gears.test.prescryptive.io/identity/patient/{masterId} would match just {masterId}
  const regex = /\/([^/]+)$/;

  const patientId = patientAccount.patientProfile
    ? regex.exec(patientAccount.patientProfile)?.[1]
    : undefined;
  return patientId;
};

const getContext = (logScope, user, batchNumber = null) =>
  `${logScope}${batchNumber !== null ? '.' + batchNumber : ''} ${
    user.isDependent
      ? 'dependentId ' + user.profile.cashProfile.primaryMemberRxId
      : user.phoneNumber
  }`;

const maxAsyncBatch = process.argv.includes('--no-batch')
  ? 1
  : process.env.MAX_THREADS
  ? parseInt(process.env.MAX_THREADS)
  : 50;
const getBatch = (array, batchNumber, batchSizeOverride = null) => {
  const batchSizeToUse = Math.min(
    batchSizeOverride ?? batchSize,
    maxAsyncBatch
  );
  const batchStart = batchNumber * batchSizeToUse;
  const batchEnd = batchStart + batchSizeToUse;
  return array.slice(batchStart, batchEnd);
};
