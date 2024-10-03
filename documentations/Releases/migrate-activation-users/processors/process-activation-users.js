// Copyright 2022 Prescryptive Health, Inc.

import { getActivationUsers } from '../helpers/db-helpers/rx-collection.helper.js';
import { batchStep } from '../helpers/process.helper.js';
import { updatePatient } from '../helpers/identity/update-patient.js';
import {
  logLimited,
  logListToFile,
  logProgress,
  logToFile,
  logVerbose,
  runFolder,
} from '../helpers/log.helper.js';
import { getBenefitPersonsForMemberIds } from '../helpers/db-helpers/benefit.helper.js';
import { toLookup } from '../utils/to-lookup.js';
import { getPatientById } from '../helpers/identity/get-patient-by-id.js';
import { updatePerson } from '../helpers/db-helpers/collection.helper.js';

const batchSize = process.env.BATCH_SIZE
  ? parseInt(process.env.BATCH_SIZE)
  : 50;

const scope = 'ActivationUsers';

export const processActivationUsers = async (isPublishMode) => {
  logProgress(`Beginning ${scope} processor`);
  let totalFailures = 0;
  const {
    successfulUsers: usersToBePublished,
    exceptionUsers: failedToIdentify,
    skipUsers,
  } = await batchStep(scope, 'Identify', identifyActivationUsers);
  totalFailures += failedToIdentify.length;

  logToFile(scope, 'Failures', 'Failed users:');
  if (failedToIdentify.length) {
    logListToFile(
      failedToIdentify,
      scope,
      'Failures',
      (user) => `${getContext(scope, user)}: ${JSON.stringify(user.error)}`
    );
  }

  logProgress('\nBeginning Publish step');
  if (isPublishMode) {
    if (!usersToBePublished.length) {
      logProgress('No users to publish, skipping publish step');
    } else {
      logToFile(scope, 'Completed', `${scope} Successful Users:`);
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

      logListToFile(
        completedUsers,
        scope,
        'Completed',
        (user) => `${getContext(scope, user)}`
      );

      if (failedToPublish.length) {
        logListToFile(
          failedToPublish,
          scope,
          'Failures',
          (user) => `${getContext(scope, user)}: ${JSON.stringify(user.error)}`
        );
      }

      const logPath = `logs/${runFolder}/${scope}/`;
      logProgress(
        `${scope} total - successful: ${completedUsers.length}, failures: ${totalFailures} - see ${logPath} logs for details`
      );
    }
  } else {
    logProgress(`Publish mode is FALSE - Skipping publish\n`);
    const logPath = `logs/${runFolder}/${scope}/`;
    logProgress(
      `${scope} total - successful: ${usersToBePublished.length}, failures: ${failedToIdentify.length}, skipped users: ${skipUsers.length} - see ${logPath} logs for details`
    );
    logListToFile(
      usersToBePublished,
      scope,
      'Identified',
      (user) => `${getContext(scope, user)}`
    );
  }
};

const identifyActivationUsers = async (batchNumber, logScope) => {
  const batchStart = batchNumber * batchSize;
  logLimited(
    `${logScope}: Getting batch of activation phone number users`,
    logScope
  );
  const activationUsers = await getActivationUsers(batchStart, batchSize);
  logLimited(
    `${logScope}: Getting associated profiles for ${activationUsers.length} users`,
    logScope
  );
  const memberIds = activationUsers.map((x) => x.primaryMemberRxId);
  const benefitPersons = await getBenefitPersonsForMemberIds(memberIds);
  const benefitPersonsByUniqueId = toLookup(benefitPersons, (x) => x.uniqueId);

  const usersWithMasterId = activationUsers.filter(
    (x) => benefitPersonsByUniqueId[x.primaryMemberRxId]?.masterId
  );
  const usersWithoutMasterId = activationUsers.filter(
    (x) => !benefitPersonsByUniqueId[x.primaryMemberRxId]?.masterId
  );
  const skipUsers = usersWithoutMasterId.map((x) => ({
    pbmProfile: x,
    error: `${logScope}.${x.primaryMemberRxId} ${x.activationPhoneNumber}: MasterId not found`,
  }));
  skipUsers.forEach((x) => logProgress(x.error));
  const exceptionUsers = [];
  const successfulUsers = [];
  for (const pbmProfile of usersWithMasterId) {
    const benefitPerson =
      benefitPersonsByUniqueId[pbmProfile.primaryMemberRxId];
    const { isSuccess, record, error } = await getPatientById(
      benefitPerson.masterId
    );
    if (isSuccess) {
      const byPrimaryPhone = (x) => x.system === 'phone' && x.use === 'mobile';

      const primaryPhone = record.telecom?.find(byPrimaryPhone);
      if (primaryPhone?.rank === 1) {
        skipUsers.push({ pbmProfile, patient: record });
        if (!primaryPhone) {
          logProgress(
            `${logScope} ${pbmProfile.phoneNumber}: patient ${record.id} has no phone number`
          );
        } else {
          logProgress(
            `${logScope} ${pbmProfile.phoneNumber}: patient ${record.id} phoneNumber already has rank 1`
          );
        }
      } else {
        const updatedPhone = primaryPhone
          ? {
              ...primaryPhone,
              rank: 1,
            }
          : {
              system: 'phone',
              value: pbmProfile.activationPhoneNumber,
              use: 'mobile',
              rank: 1,
            };
        logProgress(
          `${logScope} ${pbmProfile.activationPhoneNumber}: ${record.id} ${
            primaryPhone ? 'Updated with ' : 'Creating '
          }${JSON.stringify(updatedPhone)}`
        );
        const updatedPatient = {
          ...record,
          telecom: replaceBy(
            record.telecom ?? [],
            byPrimaryPhone,
            updatedPhone
          ),
        };
        successfulUsers.push({ pbmProfile, patient: updatedPatient });
      }
    } else {
      exceptionUsers.push({ pbmProfile, error });
    }
  }

  return {
    successfulUsers,
    exceptionUsers,
    skipUsers,
  };
};

const publishPatientUpdates = async (updatedUsersToPublish, logScope) => {
  const successfulUsers = [];
  const exceptionUsers = [];
  for (const user of updatedUsersToPublish) {
    const { pbmProfile, patient } = user;

    const { isSuccess, error, record } = await updatePatient(patient, logScope);
    if (!isSuccess) {
      exceptionUsers.push({ pbmProfile, patient, error });
      continue;
    }

    const { error: pbmError } = await updatePerson(pbmProfile.identifier, {
      activationUpdated: true,
    });
    if (pbmError) {
      exceptionUsers.push({ pbmProfile, patient, pbmError });
      continue;
    }

    successfulUsers.push({ pbmProfile, patient: record });
  }
  return { successfulUsers, exceptionUsers };
};

const replaceBy = (array, searcher, replacement) => {
  const without = array.filter((x) => !searcher(x));
  without.push(replacement);
  return without;
};

const getBatch = (array, batchNumber) => {
  const batchStart = batchNumber * batchSize;
  const batchEnd = batchStart + batchSize;
  return array.slice(batchStart, batchEnd);
};

const getContext = (logScope, user) =>
  `${logScope} ${user.pbmProfile.primaryMemberRxId} ${user.patient?.id ?? ''}`;
