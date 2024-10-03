// Copyright 2022 Prescryptive Health, Inc.

import { getAllUnlinkedPbmUsers } from '../helpers/db-helpers/rx-collection.helper.js';
import {
  logLimited,
  logListToFile,
  logProgress,
  logToFile,
  logVerbose,
  runFolder,
} from '../helpers/log.helper.js';
import { asyncBatch, batchStep } from '../helpers/process.helper.js';
import { updatePatient } from '../helpers/identity/update-patient.js';
import { hydrateProfilesFromPbmUsers } from '../helpers/profile.helper.js';
import { updatePerson } from '../helpers/db-helpers/collection.helper.js';
import { updatePatientAccount } from '../helpers/patient-account/update-patient-account.js';
import { buildPbmPatientLink } from '../helpers/patient-account/build-pbm-patient-link.js';

const batchSize = process.env.BATCH_SIZE
  ? parseInt(process.env.BATCH_SIZE)
  : 50;

const scope = 'PbmUsers';

export const processPbmUsers = async (isPublishMode) => {
  logProgress(`\nBeginning ${scope} processor`);
  const allFailedUsers = [];
  const allCompletedUsers = [];
  const {
    successfulUsers: usersToBePublished,
    exceptionUsers: failedToIdentify,
  } = await batchStep(scope, 'Identify', identifyAndBuildPbmPatients);
  allFailedUsers.push(...failedToIdentify);

  if (isPublishMode) {
    if (!usersToBePublished.length) {
      logProgress(`No users found - Skipping publish\n`);
    }
    const { successfulUsers, exceptionUsers } = await batchStep(
      scope,
      'Publish',
      (batchNumber, logScope) => {
        const batchStart = batchNumber * batchSize;
        const batchEnd = batchStart + batchSize;
        const batchOfUsers = usersToBePublished.slice(batchStart, batchEnd);
        return publishUpdatedPbmPatients(batchNumber, batchOfUsers, logScope);
      },
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
    allCompletedUsers.push(...usersToBePublished);
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
      (user, index) =>
        `${getContext(index, user)}:\n ${JSON.stringify(
          user.profile.exceptions
        )}`
    );
  }
};

const identifyAndBuildPbmPatients = async (batchNumber, logScope) => {
  const batchStart = batchNumber * batchSize;
  logLimited(`\n${logScope}: Getting batch of migrated pbm users`, logScope);
  const unlinkedPbmUsers = await getAllUnlinkedPbmUsers(batchStart, batchSize);

  logLimited(
    `${logScope}: Getting associated profiles for ${unlinkedPbmUsers.length} users`,
    logScope
  );

  const { successfulUsers: hydratedUsers, exceptionUsers } =
    await hydrateProfilesFromPbmUsers(unlinkedPbmUsers, logScope);

  const verifiedUsers = hydratedUsers.filter(
    (x) =>
      x.benefitPerson?.masterId &&
      x.patientAccount?.patient &&
      !x.patientAccount.patient.link?.find(
        (y) => y.other.reference === `patient/${x.benefitPerson.masterId}`
      )
  );
  const skippedUsers = hydratedUsers.filter(
    (x) =>
      !x.benefitPerson?.masterId ||
      !x.patientAccount?.patient ||
      x.patientAccount.patient.link?.find(
        (y) => y.other.reference === `patient/${x.benefitPerson.masterId}`
      )
  );
  skippedUsers.forEach((x) => {
    const context = `${logScope} ${x.phoneNumber}:`;
    if (!x.benefitPerson) {
      logProgress(`${context} has no benefit person`);
    } else if (!x.benefitPerson.masterId) {
      logProgress(`${context} benefit person has no masterId`);
    }

    if (!x.patientAccount?.patient) {
      logProgress(`${context} has no patient`);
    }

    if (
      x.patientAccount.patient.link?.find(
        (y) => y.other.reference === `patient/${x.benefitPerson.masterId}`
      )
    ) {
      logProgress(`${context} has a link already`);
    }
  });
  logToFile(scope, 'Skipped', skippedUsers.map((x) => x.phoneNumber).join(','));
  exceptionUsers.push(
    ...hydratedUsers
      .filter((x) => !x.benefitPerson)
      .map((x) => ({
        ...x,
        exceptions: [...x.exceptions, { error: 'Benefit person not found' }],
      }))
  );
  const processedUsers = verifiedUsers.map((profile) => ({
    profile,
    updatedPatient: {
      ...profile.patientAccount.patient,
      link: buildPbmPatientLink(profile.benefitPerson.masterId),
    },
    phoneNumber: profile.phoneNumber,
  }));
  return {
    successfulUsers: processedUsers,
    exceptionUsers: exceptionUsers.map((x) => ({
      profile: x,
      phoneNumber: x.phoneNumber,
    })),
    skippedUsers,
  };
};

const publishUpdatedPbmPatients = async (
  batchNumber,
  batchOfUsers,
  logScope
) => {
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
        `${getContext(logScope, user, batchNumber)}: Updating patient`
      );

      const updatedPatientAccount = {
        ...user.profile.patientAccount,
        reference: [
          ...user.profile.patientAccount.reference,
          user.profile.pbmProfile.primaryMemberRxId,
        ],
      };

      const { isSuccess, error } = await updatePatientAccount(
        updatedPatientAccount,
        logScope
      );

      if (!isSuccess) {
        return { isSuccess, error };
      }
      return await updatePatient(user.updatedPatient, logScope);
    },
    async (user, { isSuccess, error }) => {
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

      const patientId = getPatientIdFromAccount(user.profile.patientAccount);

      const { error: pbmUpdateError } = await updatePerson(
        user.profile.pbmProfile.identifier,
        {
          masterId: patientId,
        }
      );

      if (pbmUpdateError) {
        const errorMessage = `${getContext(
          logScope,
          user,
          batchNumber
        )}: ${JSON.stringify(pbmUpdateError)}`;
        logLimited(errorMessage, logScope);
        user.profile.exceptions.push(errorMessage);
        exceptionUsers.push(user);
      } else {
        logLimited(
          `${getContext(logScope, user, batchNumber)}: updated accountId:${
            user.profile.patientAccount.accountId
          } and masterId:${patientId} for sie person`,
          logScope
        );
      }

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

const getContext = (logScope, user, batchNumber) =>
  `${logScope}${batchNumber ? '.' + batchNumber : ''} ${user.phoneNumber}`;
