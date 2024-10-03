// Copyright 2022 Prescryptive Health, Inc.

import { createPatientAccount } from '../helpers/patient-account/create-patient-account.js';
import {
  getAllUnpublishedCashUsers,
  searchAllDependents,
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
import { hydrateProfilesFromCashUsers } from '../helpers/profile.helper.js';
import { buildCashCoverage } from '../helpers/cash-coverage/cash-coverage.helper.js';
import { toLookup } from '../utils/to-lookup.js';
import { buildPatientAccount } from '../helpers/patient-account/patient-account.helper.js';
import {
  updateAccount,
  updatePerson,
} from '../helpers/db-helpers/collection.helper.js';
import { getPatientAccountByReference } from '../helpers/patient-account/get-patient-account-by-reference.js';
import { createCashCoverage } from '../helpers/cash-coverage/create-coverage-record.js';
import { formatDuration, now } from '../utils/time-formatter.js';
import { generateSHA512Hash } from '../helpers/crypto.helper.js';
import { getCashCoverage } from '../helpers/cash-coverage/get-coverage-record.js';

const batchSize = process.env.BATCH_SIZE
  ? parseInt(process.env.BATCH_SIZE)
  : 50;

const scope = 'CashUsers';

export const processAddedUsers = async (isPublishMode) => {
  logProgress(`\nBeginning ${scope} processor`);
  const allFailedUsers = [];
  const allCompletedUsers = [];
  const startTime = now();
  const {
    successfulUsers: usersToBePublished,
    exceptionUsers: failedToIdentify,
  } = await batchStep(scope, 'Identify', identifyAndBuildCashPatients);
  allFailedUsers.push(...failedToIdentify);

  if (failedToIdentify.length) {
    logToFile(scope, 'Failures', 'Failed users:');
    logListToFile(
      failedToIdentify,
      scope,
      'Failures',
      (user) =>
        `${getContext(scope, user)}: ${JSON.stringify(user.profile.exceptions)}`
    );
  }

  if (isPublishMode) {
    const primaryUsersToBePublished = usersToBePublished.filter(
      (x) => !x.isDependent
    );
    const dependentsToBePublished = usersToBePublished.filter(
      (x) => x.isDependent
    );
    if (!usersToBePublished.length) {
      logProgress('No users to publish, skipping publish step');
    } else {
      logToFile(scope, 'Completed', `${scope} Successful Users:`);

      logProgress('Publishing primary users');
      const {
        successfulUsers: successfulPrimaryUsers,
        exceptionUsers: exceptionPrimaryUsers,
      } = await publishSetOfUsers(primaryUsersToBePublished, null, scope);

      allFailedUsers.push(...exceptionPrimaryUsers);
      allCompletedUsers.push(...successfulPrimaryUsers);

      const primaryMasterIdByFamilyId = toLookup(
        successfulPrimaryUsers,
        (x) => x.profile.cashProfile.primaryMemberFamilyId,
        (x) => x.patientId
      );

      logProgress('Publishing dependents');
      const {
        successfulUsers: successfulDependents,
        exceptionUsers: exceptionDependents,
      } = await publishSetOfUsers(
        dependentsToBePublished,
        primaryMasterIdByFamilyId,
        scope
      );

      allFailedUsers.push(...exceptionDependents);
      allCompletedUsers.push(...successfulDependents);

      const logPath = `logs/${runFolder}/${scope}/`;
      logProgress(
        `${scope} complete total - successful: ${allCompletedUsers.length}, failures: ${allFailedUsers.length} - see ${logPath} logs for details`
      );
      const totalTime = now() - startTime;
      const averageDuration =
        totalTime / (allCompletedUsers.length + allFailedUsers.length);
      logProgress(
        `${scope} total time ${formatDuration(
          totalTime
        )} average time ${Math.trunc(totalTime / 1000)}s/${
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
      'Identify',
      (user) => `${getContext(scope, user)}: ${JSON.stringify(user)}`
    );
  }
};

const publishSetOfUsers = async (
  usersToBePublished,
  primaryMasterIdByFamilyId,
  logScope
) => {
  const successfulUsers = [];
  const exceptionUsers = [];
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
    const { successfulUsers: publishedUsers, exceptionUsers: failedToPublish } =
      await batchStep(
        logScope,
        `PublishPatient`,
        (innerBatchNumber, logScope) => {
          return publishCashPatients(
            batchNumber,
            getBatch(
              usersToPublish,
              innerBatchNumber,
              process.env.PATIENT_BATCH_SIZE
                ? parseInt(process.env.PATIENT_BATCH_SIZE)
                : null
            ),
            logScope
          );
        },
        true
      );
    batchFailures.push(...failedToPublish);

    const defaultPrimaryMasterIdByFamilyId = toLookup(
      publishedUsers.filter((x) => !x.isDependent),
      (x) => x.profile.cashProfile.primaryMemberFamilyId,
      (x) => x.patientId
    );

    const {
      successfulUsers: publishedCoverages,
      exceptionUsers: failedToPublishCoverages,
    } = await batchStep(
      logScope,
      `BuildAndPublishCoverage`,
      (innerBatchNumber, logScope) => {
        return buildAndPublishCashCoverages(
          batchNumber,
          getBatch(
            publishedUsers,
            innerBatchNumber,
            process.env.COVERAGE_BATCH_SIZE
              ? parseInt(process.env.COVERAGE_BATCH_SIZE)
              : null
          ),
          primaryMasterIdByFamilyId ?? defaultPrimaryMasterIdByFamilyId,
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
      logScope,
      `PublishAccountIds`,
      (innerBatchNumber, logScope) => {
        return publishAccountIds(
          batchNumber,
          getBatch(
            publishedCoverages,
            innerBatchNumber,
            process.env.ACCOUNT_BATCH_SIZE
              ? parseInt(process.env.ACCOUNT_BATCH_SIZE)
              : null
          ),
          logScope
        );
      },
      true
    );

    logListToFile(
      batchCompleted,
      logScope,
      'Completed',
      (user) => `${getContext(logScope, user)}: ${JSON.stringify(user)}`
    );

    if (batchFailures.length) {
      logListToFile(
        batchFailures,
        logScope,
        'Failures',
        (user) =>
          `${getContext(logScope, user)}: ${JSON.stringify(
            user.profile.exceptions
          )}`
      );
    }

    batchFailures.push(...failedToPublishIds);
    exceptionUsers.push(...batchFailures);
    successfulUsers.push(...batchCompleted);

    const logPath = `logs/${runFolder}/${logScope}/`;
    logProgress(
      `\n${logScope} batch total - successful: ${batchCompleted.length}, failures: ${batchFailures.length} - see ${logPath} logs for details`
    );

    const batchAverageDuration =
      (now() - batchStartTime) / (batchCompleted.length + batchFailures.length);
    logProgress(
      `${logScope} batch average time ${Math.trunc(
        (now() - batchStartTime) / 1000
      )}s/${
        batchCompleted.length + batchFailures.length
      } users - ${formatDuration(batchAverageDuration)} per user`
    );
  }

  return { successfulUsers, exceptionUsers };
};

const identifyAndBuildCashPatients = async (batchNumber, logScope) => {
  const batchStart = batchNumber * batchSize;
  const users = [];
  logLimited(`${logScope}: Getting batch of unpublished cash users`, logScope);
  const unpublishedCashUsers = await getAllUnpublishedCashUsers(
    batchStart,
    batchSize
  );

  logLimited(
    `${logScope}: Getting associated profiles for ${unpublishedCashUsers.length} users`,
    logScope
  );
  const { successfulUsers: hydratedUsers, exceptionUsers } =
    await hydrateProfilesFromCashUsers(unpublishedCashUsers, logScope);
  users.push(...hydratedUsers);
  const primaryPhoneNumberByFamilyId = toLookup(
    hydratedUsers.filter((x) => !x.isDependent),
    (x) => x.cashProfile.primaryMemberFamilyId,
    (x) => x.phoneNumber
  );
  const uniqueFamilyIds = hydratedUsers.map(
    (x) => x.cashProfile.primaryMemberFamilyId
  );

  logVerbose(`${logScope} batch ${batchNumber}: Fetching dependent profiles`);
  const dependents = await searchAllDependents(uniqueFamilyIds);
  users.push(...dependents.map((x) => ({ cashProfile: x, exceptions: [] })));
  logProgress(
    `${logScope} batch ${batchNumber}: ${dependents.length} dependents found`
  );

  const processedUsers = users.map((profile) => ({
    profile,
    newPatientAccount: buildPatientAccount(
      profile,
      primaryPhoneNumberByFamilyId[profile.cashProfile.primaryMemberFamilyId]
    ),
    phoneNumber:
      primaryPhoneNumberByFamilyId[profile.cashProfile.primaryMemberFamilyId],
    isDependent: profile.cashProfile.primaryMemberPersonCode !== '01',
  }));
  return {
    successfulUsers: processedUsers,
    exceptionUsers: exceptionUsers.map((x) => ({
      profile: x,
      phoneNumber: x.phoneNumber,
    })),
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
          user.isDependent
            ? user.profile.cashProfile.primaryMemberRxId
            : generateSHA512Hash(user.phoneNumber),
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
          user.hasExistingAccount = true;
        } else {
          isSuccess = false;
          error = {
            error:
              'Patient reference had a conflict, but patient could not be found for this reference:' +
              user.isDependent
                ? user.profile.cashProfile.primaryMemberRxId
                : user.phoneNumber,
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
  primaryMasterIdByFamilyId,
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
    async (user) => {
      if (user.hasExistingAccount) {
        logVerbose(
          `${getContext(
            logScope,
            user,
            batchNumber
          )}: Since patient account was pre-existing, checking for pre-existing cash coverage`,
          logScope
        );
        const { isSuccess, record, error } = await getCashCoverage(
          user.profile.cashProfile.primaryMemberRxId,
          logScope
        );
        if (isSuccess && record?.entry?.[0]) {
          logVerbose(
            `${getContext(
              logScope,
              user,
              batchNumber
            )}: Existing cash coverage found, continuing with found record`,
            logScope
          );
          return { isSuccess, record: record.entry[0] };
        } else if (error) {
          logVerbose(
            `${getContext(
              logScope,
              user,
              batchNumber
            )}: Existing cash coverage NOT found`,
            logScope
          );
        }
      }
      const primaryMasterId =
        primaryMasterIdByFamilyId[
          user.profile.cashProfile.primaryMemberFamilyId
        ];
      if (!primaryMasterId) {
        return {
          isSuccess: false,
          error: `${getContext(
            logScope,
            user
          )}: Primary member master id not found, Skipping. Primary member likely failed`,
        };
      }
      const cashCoverage = buildCashCoverage(
        user.profile,
        primaryMasterId,
        user.patientId
      );
      logVerbose(
        `${getContext(logScope, user, batchNumber)}: Creating cash coverage`,
        logScope
      );
      return createCashCoverage(cashCoverage, logScope);
    },
    (user, { isSuccess, record, error }) => {
      if (!isSuccess) {
        const errorMessage = `${getContext(logScope, user, batchNumber)}: ${
          error ? JSON.stringify(error) : ''
        } ${!record ? 'Record not returned from create coverage' : ''}`;
        logLimited(errorMessage, logScope);
        user.profile.exceptions.push(errorMessage);
        exceptionUsers.push(user);
        return;
      } else {
        logVerbose(
          `${getContext(logScope, user, batchNumber)}: ${
            !record
              ? 'Record not returned from create coverage'
              : `Final cash coverage with id: ${record.id}`
          }`,
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
  await asyncBatch(
    batchOfUsers,
    async (user) => {
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

      let accountUpdateError;
      if (!user.isDependent) {
        ({ error: accountUpdateError } = await updateAccount(user.phoneNumber, {
          accountId: user.accountId,
          masterId: user.patientId,
        }));
      }

      let pbmUpdateError = null;
      // Only set masterId here if pbm patient was linked to cash patient
      // If skipped, this step will be completed in the process-pbm-users step
      if (user.profile.pbmProfile) {
        ({ error: pbmUpdateError } = await updatePerson(
          user.profile.pbmProfile.identifier,
          {
            accountId: user.accountId,
            masterId: user.profile.benefitPerson.masterId
              ? user.patientId
              : null,
          }
        ));
      }

      return { cashUpdateError, accountUpdateError, pbmUpdateError };
    },
    (user, { cashUpdateError, accountUpdateError, pbmUpdateError }) => {
      if (cashUpdateError || accountUpdateError || pbmUpdateError) {
        const errorMessage = `${getContext(
          logScope,
          user,
          batchNumber
        )}: ${JSON.stringify(cashUpdateError)}\n${JSON.stringify(
          accountResponse
        )}\n${JSON.stringify(pbmUpdateError)}`;
        logLimited(errorMessage, logScope);
        user.profile.exceptions.push(errorMessage);
        exceptionUsers.push(user);
        return;
      }

      logLimited(
        `${getContext(logScope, user, batchNumber)}: updated accountId:${
          user.accountId
        } and masterId:${user.patientId} for person${
          user.isDependent ? '' : ' and account'
        }${
          user.profile.pbmProfile
            ? user.profile.benefitPerson.masterId
              ? ' and pbm person'
              : ' and just accountId for pbmPerson'
            : ''
        }`,
        logScope
      );
      successfulUsers.push(user);
    }
  );
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
      ? user.profile.cashProfile.primaryMemberRxId
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
