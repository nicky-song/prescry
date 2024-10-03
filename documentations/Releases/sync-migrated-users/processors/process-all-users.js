// Copyright 2023 Prescryptive Health, Inc.

import {
  getAllPatientAccounts,
} from '../helpers/db-patient-helpers/patient-collection.helper.js';

import { batchStep } from '../helpers/process.helper.js';
import { hydrateAllPatients } from '../helpers/profile.helper.js';
import { updatePatient } from '../helpers/identity/update-patient.js';
import {
  logLimited,
  logListToFile,
  logProgress,
  logToFile,
  logVerbose,
  runFolder,
} from '../helpers/log.helper.js';

const batchSize = process.env.BATCH_SIZE
  ? parseInt(process.env.BATCH_SIZE)
  : 50;

const scope = 'UpdateCommunicationLanguage';

export const processAllUsers = async (isPublishMode) => {
  logProgress(`Beginning ${scope} processor`);
  let totalFailures = 0;
  const {
    successfulUsers: usersToBePublished,
    exceptionUsers: failedToIdentify,
  } = await batchStep(scope, 'Identify', identifyAndBuildPatientAndAccount);
  totalFailures += failedToIdentify.length;

  if (failedToIdentify.length) {
    logToFile(scope, 'Failures', 'Failed users:');
    logListToFile(
      failedToIdentify,
      scope,
      'Failures',
      (account) =>
        `${getContext(scope, account)}: ${JSON.stringify(account)}`
    );
  }

  logProgress('\nBeginning Publish step');
  if (isPublishMode) {
    if (!usersToBePublished.length) {
      logProgress('No users to publish, skipping publish step');
    } else {
      const {
        successfulUsers: completedUsers,
        exceptionUsers: failedToPublish,
      } = await batchStep(
        scope,
        'PublishPatient',
        (batchNumber, logScope) => {
          logVerbose(
            `${scope}: Publishing batch ${batchNumber} of ${Math.floor(
              usersToBePublished.length / batchSize
            )}`
          );
          return publishPatientUpdates(
            getBatch(usersToBePublished, batchNumber),
            logScope
          );
        },
        true
      );
      totalFailures += failedToPublish.length;

      const logPath = `logs/${runFolder}/${scope}/`;
      logProgress(
        `${scope} total - successful: ${completedUsers.length}, failures: ${totalFailures} - see ${logPath} logs for details`
      );
    }
  } else {
    logProgress(`Publish mode is FALSE - Skipping publish\n`);
    const logPath = `logs/${runFolder}/${scope}/Completed.log`;
    logProgress(
      `${scope} complete total - identified: ${usersToBePublished.length}, failures: ${failedToIdentify.length} - see ${logPath} logs for details`
    );

    logListToFile(
      usersToBePublished,
      scope,
      'Identify',
      ({account, patient}) => `${getContext(scope, account)}: Updated Patient ${JSON.stringify(patient)} UserPreferences ${JSON.stringify(account?.UserPreferences)}`
    );
  }
};

const identifyAndBuildPatientAndAccount = async (batchNumber, logScope) => {
  const batchStart = batchNumber * batchSize;
  logLimited(
    `${logScope}: Getting batch of all patient accounts`,
    logScope
  );

  const allPatientAccounts = await getAllPatientAccounts(batchStart, batchSize);

  logLimited(
    `${logScope}: Getting associated profiles for ${
      allPatientAccounts.length
    } all patient accounts`,
    logScope
  );

  const { successfulUsers, exceptionUsers } = await hydrateAllPatients(
    allPatientAccounts,
    logScope
  );
  return {
    successfulUsers: successfulUsers,
    exceptionUsers: exceptionUsers,
  };
};

const publishPatientUpdates = async (
  updatedUsersToPublish,
  logScope
) => {
  const successfulUsers = [];
  const exceptionUsers = [];
  for (const patientAccount of updatedUsersToPublish) {
    const { account, patient } = patientAccount;


    const { isSuccess, error, record } = await updatePatient(patient, logScope);
    if (!isSuccess) {
      logToFile(
        logScope,
        'Exceptions',
        `${getContext(
          logScope,
          patient
        )}: Patient update failed, errors listed below: ${
          error
            ? '\naccount:' + JSON.stringify(error)
            : ''
        }`
      );
      exceptionUsers.push({
        patient,
        error,
      });
      continue;
    }
    successfulUsers.push({ account, patient: record });
  }
  return { successfulUsers, exceptionUsers };
};

const areDeeplyEqual = (a, b) => {
  for (const key in a) {
    const a_value = a[key];
    const b_value = b[key];
    if (a_value == null && b_value == null) {
      continue;
    }
    if (
      (a_value instanceof Object && !areDeeplyEqual(a_value, b_value)) ||
      (!(a_value instanceof Object) && a_value !== b_value)
    ) {
      return false;
    }
  }
  return true;
};

const getContext = (logScope, account) =>
`${logScope} ${
  account.PatientId
    ? account.PatientId + ' - Patient Account'
    : ''
}`;

const getBatch = (array, batchNumber) => {
  const batchStart = batchNumber * batchSize;
  const batchEnd = batchStart + batchSize;
  return array.slice(batchStart, batchEnd);
};
