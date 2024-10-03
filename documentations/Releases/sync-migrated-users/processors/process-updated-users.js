// Copyright 2022 Prescryptive Health, Inc.

import dateformat from 'dateformat';
import {
  getAccountsForPhoneNumbers,
  getAllRecentlyUpdatedAccounts,
  getAllRecentlyUpdatedUsers,
} from '../helpers/db-helpers/rx-collection.helper.js';
import {
  buildPatientAddress,
  buildPatientNames,
  identifierTypeSystemUrl,
  buildPatientCommunication
} from '../helpers/patient-account/patient.helper.js';
import { batchStep } from '../helpers/process.helper.js';
import { hydrateAllProfiles } from '../helpers/profile.helper.js';
import { PatientIdentifierCodeableConceptCode } from '../helpers/patient-account/patient.helper.js';
import { generateSHA512Hash } from '../helpers/crypto.helper.js';
import {
  updateAccount,
  updatePerson,
} from '../helpers/db-helpers/collection.helper.js';
import { updatePatientAccount } from '../helpers/patient-account/update-patient-account.js';
import { updatePatient } from '../helpers/identity/update-patient.js';
import {
  logLimited,
  logListToFile,
  logProgress,
  logToFile,
  logVerbose,
  runFolder,
} from '../helpers/log.helper.js';
import { getCashUsersForPhoneNumbers } from '../helpers/db-helpers/rx-collection.helper.js';
import { buildPatientAccountMetadata } from '../helpers/patient-account/patient-account.helper.js';
import { toLookup } from '../utils/to-lookup.js';
import { buildPbmPatientLink } from '../helpers/patient-account/build-pbm-patient-link.js';

const batchSize = process.env.BATCH_SIZE
  ? parseInt(process.env.BATCH_SIZE)
  : 50;

const scope = 'UpdatePatients';

export const processUpdatedUsers = async (isPublishMode) => {
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
      (user) =>
        `${getContext(scope, user)}: ${JSON.stringify(user.profile.exceptions)}`
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
          return publishPatientAccountUpdates(
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
      (user) => `${getContext(scope, user)}: ${JSON.stringify(user)}`
    );
  }
};

const identifyAndBuildPatientAndAccount = async (batchNumber, logScope) => {
  const batchStart = batchNumber * batchSize;
  logLimited(
    `${logScope}: Getting batch of recently updated cash users`,
    logScope
  );
  const updatedUsers = await getAllRecentlyUpdatedUsers(batchStart, batchSize);
  const updatedAccounts = await getAllRecentlyUpdatedAccounts(
    batchStart,
    batchSize
  );
  const existingAccounts = toLookup(updatedAccounts, (x) => x.phoneNumber);
  logLimited(
    `${logScope}: Getting associated profiles for ${
      updatedUsers.length + updatedAccounts.length
    } users`,
    logScope
  );
  const cashUsers = updatedUsers.filter((x) => x.rxGroupType === 'CASH');
  const existingCashUsers = toLookup(cashUsers, (x) => x.phoneNumber);
  const sieUsers = updatedUsers.filter((x) => x.rxGroupType === 'SIE');
  const missingCashUsers = await getCashUsersForPhoneNumbers(
    sieUsers
      .concat(updatedAccounts)
      .map((x) => x.phoneNumber)
      .filter((x) => !existingCashUsers[x])
  );

  cashUsers.push(...missingCashUsers);
  const missingAccounts = await getAccountsForPhoneNumbers(
    sieUsers
      .concat(cashUsers)
      .map((x) => x.phoneNumber)
      .filter((x) => !existingAccounts[x])
  );
  updatedAccounts.push(...missingAccounts);
  const { successfulUsers, exceptionUsers } = await hydrateAllProfiles(
    cashUsers,
    sieUsers,
    updatedAccounts,
    cashUsers.map((x) => x.phoneNumber),
    true,
    logScope
  );
  const usersWithPatients = buildUpdatedPatientAndAccountData(
    successfulUsers,
    logScope
  );
  return {
    successfulUsers: usersWithPatients,
    exceptionUsers: exceptionUsers.map((profile) => ({ profile })),
  };
};
const buildUpdatedPatientAndAccountData = (users, logScope) => {
  const updates = [];
  for (const profile of users) {
    const logUser = {
      profile,
      isDependent: profile.cashProfile.primaryMemberPersonCode !== '01',
      phoneNumber: profile.cashProfile.phoneNumber,
    };
    const {
      cashProfile,
      account,
      pbmProfile,
      benefitPerson,
      patientAccount,
      patient,
    } = profile;
    let isPatientModified = false;
    let isAccountModified = false;

    // Step 1 Update address from cash -> patient
    if (cashProfile.updatedFields?.includes('address1') && patient) {
      const updatedAddress = buildPatientAddress(cashProfile)[0];
      logVerbose(
        `${getContext(logScope, logUser)}: ${
          cashProfile.phoneNumber
        } modified by address, ${clamp(
          JSON.stringify(patient.address ?? [])
        )} to ${clamp(JSON.stringify(updatedAddress))}`
      );
      patient.address = replaceBy(
        patient.address ?? [],
        (x) => x.use === 'home' && x.type === 'physical',
        updatedAddress
      );
      isPatientModified = true;
    }

    // Step 2 Update name from cash -> patient
    if (
      cashProfile?.updatedFields?.includes('firstName') ||
      cashProfile?.updatedFields?.includes('lastName')
    ) {
      const builtNames = buildPatientNames(cashProfile);
      logVerbose(
        `${getContext(logScope, logUser)}: ${
          cashProfile.phoneNumber
        } modified by name, ${clamp(JSON.stringify(patient.name))} to ${clamp(
          JSON.stringify(builtNames)
        )}`
      );
      patient.name = builtNames;
      isPatientModified = true;
    }

    // Step 3 Update dob from cash -> patient
    if (cashProfile.updatedFields?.includes('dateOfBirth')) {
      const updatedDOB = dateformat(
        cashProfile.dateOfBirth,
        'yyyy-mm-dd',
        true
      );
      logVerbose(
        `${getContext(logScope, logUser)}: ${
          cashProfile.phoneNumber
        } modified by dateOfBirth, ${patient.birthDate} to ${updatedDOB}`
      );
      patient.birthDate = updatedDOB;
      isPatientModified = true;
    }

    // Step 4 Update phoneNumber from cash -> patient account + patient
    const byPrimaryPhone = (x) => x.system === 'phone' && x.use === 'mobile';
    const updatedPhoneNumber = cashProfile?.phoneNumber;
    if (cashProfile.updatedFields?.includes('phoneNumber')) {
      const primaryPhoneNumber = patient.telecom.find(byPrimaryPhone)?.value;
      logVerbose(
        `${getContext(logScope, logUser)}: ${
          cashProfile.phoneNumber
        } modified by phoneNumber, ${primaryPhoneNumber} to ${updatedPhoneNumber}`
      );

      // Update phone number in telecom
      patient.telecom = replaceBy(patient.telecom ?? [], byPrimaryPhone, {
        system: 'phone',
        value: updatedPhoneNumber,
        use: 'mobile',
      });

      // Update phone number in identifiers
      patient.identifier = replaceBy(
        patient.identifier,
        (identifier) =>
          identifier.type.coding.find(
            (x) => x.code === PatientIdentifierCodeableConceptCode.PHONE_NUMBER
          ),
        {
          type: {
            coding: [
              {
                code: PatientIdentifierCodeableConceptCode.PHONE_NUMBER,
                display: "Patient's MyRx Phone Number",
                system: identifierTypeSystemUrl,
              },
            ],
          },
          value: updatedPhoneNumber,
        }
      );

      // Update phone number hash in reference
      const oldPhoneHash = generateSHA512Hash(primaryPhoneNumber);
      const newPhoneHash = generateSHA512Hash(updatedPhoneNumber);
      patientAccount.reference = replaceBy(
        patientAccount.reference,
        (reference) => reference === oldPhoneHash,
        newPhoneHash
      );

      isPatientModified = true;
      isAccountModified = true;
    }

    // Step 4 Update email from account -> patient
    if (cashProfile.updatedFields?.includes('email') && patient) {
      logVerbose(
        `${getContext(logScope, logUser)}: ${
          cashProfile.phoneNumber
        } modified by email, ${clamp(
          JSON.stringify(
            patient.telecom.find(
              (x) => x.system === 'email' && x.use === 'home'
            )?.value
          )
        )} to ${clamp(JSON.stringify(cashProfile.email))}`
      );
      patient.telecom = replaceBy(
        patient.telecom ?? [],
        (x) => x.system === 'email' && x.use === 'home',
        {
          system: 'email',
          value: cashProfile.email,
          use: 'home',
        }
      );
      isPatientModified = true;
    }

    // Step 5 Update pbm link
    if (pbmProfile?.recentlyUpdated && benefitPerson?.masterId) {
      logVerbose(
        `${getContext(logScope, logUser)}: ${
          pbmProfile.phoneNumber
        } added pbm profile, ${pbmProfile.primaryMemberRxId}`
      );
      patient.link = buildPbmPatientLink(benefitPerson);

      patientAccount.reference = [
        ...patientAccount.reference,
        pbmProfile.primaryMemberRxId,
      ];

      isAccountModified = true;
      isPatientModified = true;
    }

    // Step 6 Update account pin
    if (
      account?.recentlyUpdated &&
      account?.updatedFields?.includes('pinHash')
    ) {
      logVerbose(
        `${getContext(logScope, logUser)}: ${account.phoneNumber} updated pin`
      );
      patientAccount.authentication = {
        ...patientAccount.authentication,
        metadata: buildPatientAccountMetadata(account),
      };
      isAccountModified = true;
    }

    // Step 7 Update account favorites
    if (
      account?.recentlyUpdated &&
      account?.updatedFields?.includes('favoritedPharmacies')
    ) {
      logVerbose(
        `${getContext(logScope, logUser)}: ${
          account.phoneNumber
        } updated favoritedPharmacies`
      );
      const userPreferences = patientAccount.userPreferences ?? {};
      patientAccount.userPreferences = {
        ...userPreferences,
        favorites: replaceBy(
          userPreferences.favorites ?? [],
          (x) => x.type == 'pharmacies',
          {
            type: 'pharmacies',
            value: account.favoritedPharmacies,
          }
        ),
      };
      isAccountModified = true;
    }

    // Step 8 Update account language code
    if (
      account?.recentlyUpdated &&
      account?.updatedFields?.includes('languageCode')
    ) {
      logVerbose(
        `${getContext(logScope, logUser)}: ${
          account.phoneNumber
        } updated languageCode`
      );
      const userPreferences = patientAccount.userPreferences ?? {};
      patientAccount.userPreferences = {
        ...userPreferences,
        favorites: replaceBy(
          userPreferences.favorites ?? [],
          (x) => x.type == 'languageCode',
          {
            type: 'languageCode',
            value: [account.languageCode],
          }
        ),
      };
      isAccountModified = true;
    }
    
    // Step 9 Update communication language
    if (
      account?.recentlyUpdated && patientAccount && patient
    ) {
      logVerbose(
        `${getContext(logScope, logUser)}: ${
          account.phoneNumber
        } updated communication language`
      );

      let communicationUpdated = [];
      if (patientAccount.userPreferences && patientAccount.userPreferences.language) {
        communicationUpdated = buildPatientCommunication(patientAccount.userPreferences.language);
      }
      patient.communication = communicationUpdated;
      isPatientModified = true;
    }

    updates.push({ profile, isPatientModified, isAccountModified });
  }

  return updates;
};

const publishPatientAccountUpdates = async (
  updatedUsersToPublish,
  logScope
) => {
  const successfulUsers = [];
  const exceptionUsers = [];
  for (const user of updatedUsersToPublish) {
    const { profile, isPatientModified, isAccountModified } = user;
    let cashUpdateError = null;
    let pbmUpdateError = null;
    let accountUpdateError = null;
    let isPatientAccountSuccess = true;
    let isPatientSuccess = true;
    let patientAccountError = null;
    let patientError = null;

    let promises = [];
    if (profile.cashProfile.recentlyUpdated) {
      promises.push(
        updatePerson(profile.cashProfile.identifier, {
          recentlyUpdated: false,
          updatedFields: [],
        })
      );
    }
    if (profile.account?.recentlyUpdated) {
      promises.push(
        updateAccount(profile.account.phoneNumber, {
          recentlyUpdated: false,
          updatedFields: [],
        })
      );
    }
    if (profile.pbmProfile?.recentlyUpdated) {
      promises.push(
        updatePerson(profile.pbmProfile.identifier, {
          recentlyUpdated: false,
          updatedFields: [],
          masterId: profile.cashProfile.masterId,
          accountId: profile.cashProfile.accountId,
        })
      );
    }
    if (isPatientModified) {
      promises.push(updatePatient(profile.patient, logScope));
    }
    if (isAccountModified) {
      promises.push(updatePatientAccount(profile.patientAccount, logScope));
    }

    const results = await Promise.all(promises);
    let promiseIndex = 0;
    if (profile.cashProfile.recentlyUpdated) {
      cashUpdateError = results[promiseIndex++];
    }
    if (profile.account?.recentlyUpdated) {
      accountUpdateError = results[promiseIndex++];
    }
    if (profile.pbmProfile?.recentlyUpdated) {
      pbmUpdateError = results[promiseIndex++];
    }
    if (isPatientModified) {
      ({ isSuccess: isPatientSuccess, error: patientError } =
        results[promiseIndex++]);
    }
    if (isAccountModified) {
      ({ isSuccess: isPatientAccountSuccess, error: patientAccountError } =
        results[promiseIndex++]);
    }

    if (
      isPatientAccountSuccess &&
      isPatientSuccess &&
      !cashUpdateError?.error &&
      !pbmUpdateError?.error &&
      !accountUpdateError?.error
    ) {
      successfulUsers.push({ isSuccess: true, profile });
    } else {
      logToFile(
        logScope,
        'Exceptions',
        `${getContext(
          logScope,
          profile
        )}: Patient update failed, errors listed below: ${
          patientAccountError
            ? '\naccount:' + JSON.stringify(patientAccountError)
            : ''
        }${patientError ? '\npatient:' + JSON.stringify(patientError) : ''}${
          cashUpdateError
            ? '\ncash person:' + JSON.stringify(cashUpdateError)
            : ''
        }${
          pbmUpdateError ? '\npbm person:' + JSON.stringify(pbmUpdateError) : ''
        }${
          accountUpdateError
            ? '\naccount:' + JSON.stringify(accountUpdateError)
            : ''
        }`
      );
      exceptionUsers.push({
        profile,
        patientAccountError,
        patientError,
        cashUpdateError,
        pbmUpdateError,
      });
    }
  }
  return { successfulUsers, exceptionUsers };
};

const replaceBy = (array, searcher, replacement) => {
  const without = array.filter((x) => !searcher(x));
  without.push(replacement);
  return without;
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

const getContext = (logScope, user, index) =>
  `${logScope} ${
    user.isDependent
      ? user.profile.cashProfile.primaryMemberRxId + ' - dependent'
      : user.phoneNumber ?? user.profile.phoneNumber
  }`;

const getBatch = (array, batchNumber) => {
  const batchStart = batchNumber * batchSize;
  const batchEnd = batchStart + batchSize;
  return array.slice(batchStart, batchEnd);
};

const clamp = (str) => {
  const maxLen = 10;
  if (str && str.length > maxLen) {
    return str.slice(0, maxLen) + '...';
  }
  return str;
};
