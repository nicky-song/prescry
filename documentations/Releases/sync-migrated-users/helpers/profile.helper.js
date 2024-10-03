// Copyright 2022 Prescryptive Health, Inc.

import { getBenefitPersonsForMemberIds } from './db-helpers/benefit.helper.js';
import { convertDateFormat } from '../utils/date-formatter.js';
import { toArrayLookup } from '../utils/to-lookup.js';
import {
  getAccountsForPhoneNumbers,
  getCashUsersForPhoneNumbers,
  getPBMUsersForPhoneNumbers,
} from './db-helpers/rx-collection.helper.js';
import { logLimited, logProgress, logVerbose } from './log.helper.js';
import { getPatientAccountByAccountId } from './patient-account/get-patient-account-by-reference.js';
import {
  buildPatientCommunication, getPatientId,
} from '../helpers/patient-account/patient.helper.js';
import {
  getPatientById,
} from './identity/get-patient-by-id.js';

export const hydrateProfilesFromCashUsers = async (cashUsers, logScope) => {
  const phoneNumbers = cashUsers.map((cashUser) => cashUser.phoneNumber);
  const pbmUsers = await getPBMUsersForPhoneNumbers(phoneNumbers);
  return hydrateAllProfiles(
    cashUsers,
    pbmUsers,
    null,
    phoneNumbers,
    false,
    logScope
  );
};

export const hydrateProfilesFromPbmUsers = async (pbmUsers, logScope) => {
  const phoneNumbers = pbmUsers.map((pbmUser) => pbmUser.phoneNumber);
  const cashUsers = await getCashUsersForPhoneNumbers(phoneNumbers);
  return hydrateAllProfiles(
    cashUsers,
    pbmUsers,
    null,
    phoneNumbers,
    true,
    logScope
  );
};

export const hydrateAllProfiles = async (
  cashUsers,
  pbmUsers,
  existingAccounts,
  phoneNumbers,
  includePatientAccounts,
  logScope
) => {
  const cashUsersByPhoneNumber = toArrayLookup(cashUsers, (x) => x.phoneNumber);

  const accounts =
    existingAccounts ?? (await getAccountsForPhoneNumbers(phoneNumbers));
  const accountsByPhoneNumber = toArrayLookup(accounts, (x) => x.phoneNumber);

  const sieProfiles =
    pbmUsers ?? (await getPBMUsersForPhoneNumbers(phoneNumbers));
  const sieProfilesByPhoneNumber = toArrayLookup(
    sieProfiles,
    (x) => x.phoneNumber
  );

  const sieMemberIds = sieProfiles.map((x) => x.primaryMemberRxId);
  const benefitPersons = await getBenefitPersonsForMemberIds(sieMemberIds);
  const benefitPersonsByUniqueId = toArrayLookup(
    benefitPersons,
    (x) => x.uniqueId
  );

  let patientAccountsByAccountId = {};
  if (includePatientAccounts) {
    const accountIds = cashUsers
      .map((profile) => profile.accountId)
      .filter((accountId) => accountId);

    const patientAccounts = await getPatientAccountsForAccountIds(
      accountIds,
      logScope
    );
    patientAccountsByAccountId = toArrayLookup(
      patientAccounts,
      (x) => x.accountId
    );
  }

  const successfulUsers = [];
  const exceptionUsers = [];
  logLimited(
    `${logScope} - Fetching profiles for ${phoneNumbers.length} users`,
    logScope
  );
  const addException = (profile, message) => {
    profile.exceptions.push(message);
    logLimited(message, logScope);
  };
  for (let i = 0; i < phoneNumbers.length; i++) {
    const phoneNumber = phoneNumbers[i];
    const context = `${logScope} ${phoneNumber}:`;

    const profile = { exceptions: [], phoneNumber };

    const cashProfiles = cashUsersByPhoneNumber[phoneNumber] ?? [];
    if (cashProfiles.length > 1) {
      addException(profile, `${context} has more than 1 cash profile`);
    } else if (!cashProfiles.length) {
      addException(profile, `${context} cash profile could not be found`);
    } else {
      profile.cashProfile = cashProfiles[0];
      logLimited(`${context} found cash user`, logScope);
    }

    const userAccounts = accountsByPhoneNumber[phoneNumber] ?? [];
    if (!userAccounts.length) {
      addException(profile, `${context} doesn't exist in Account collection`);
    } else if (!userAccounts.length) {
      addException(profile, `${context} account could not be found`);
    } else {
      profile.account = userAccounts[0];
      logLimited(`${context} found account`, logScope);
    }

    const pbmProfiles = sieProfilesByPhoneNumber[phoneNumber] ?? [];
    if (pbmProfiles.length > 1) {
      addException(profile, `${context} has more than 1 sie profile`);
    } else if (pbmProfiles.length) {
      const pbmProfile = pbmProfiles[0];
      profile.pbmProfile = pbmProfile;
      const userBenefitPersons =
        benefitPersonsByUniqueId[pbmProfile.primaryMemberRxId] ?? [];
      logLimited(`${context} found pbm user`, logScope);
      if (!userBenefitPersons.length) {
        addException(
          profile,
          `${context} doesn't have benefit person record though sie profile exists`
        );
      } else {
        const benefitPerson = userBenefitPersons[0];
        const formattedDateOfBirth = benefitPerson.birthDate
          ? convertDateFormat(benefitPerson.birthDate)
          : null;
        if (
          !benefitPerson.birthDate ||
          formattedDateOfBirth !== pbmProfile.dateOfBirth ||
          benefitPerson.familyId !== pbmProfile.primaryMemberFamilyId ||
          benefitPerson.uniqueId !== pbmProfile.primaryMemberRxId
        ) {
          addException(
            profile,
            `${context} benefit person record DOB/uniqueId/familyId doesn't match with sie profile`
          );
        } else {
          logLimited(`${context} found benefit user`, logScope);
          profile.benefitPerson = benefitPerson;
        }
      }
      if (
        profile.pbmProfile &&
        profile.cashProfile &&
        profile.pbmProfile.dateOfBirth !== profile.cashProfile.dateOfBirth
      ) {
        addException(
          profile,
          `${context} sie record DOB doesn't match with cash profile`
        );
      }
    }

    if (includePatientAccounts) {
      const userPatientAccounts =
        patientAccountsByAccountId[profile.cashProfile?.accountId] ?? [];
      if (userPatientAccounts.length) {
        logLimited(`${context} found patient account`, logScope);
        profile.patientAccount = userPatientAccounts[0];
        profile.patient = userPatientAccounts[0].patient;
      }
    }

    if (!profile.exceptions.length) {
      successfulUsers.push(profile);
    } else {
      exceptionUsers.push(profile);
    }
  }
  return { successfulUsers, exceptionUsers };
};

export const hydrateAllPatients = async (
  allPatientAccounts,
  logScope
) => {

  const successfulUsers = [];
  const exceptionUsers = [];
  const patientAccounts = allPatientAccounts.filter(x => x.PatientProfile);
  

  for (const account of patientAccounts) {
    const addException = (message) => {
      account.exceptions.push(message);
      logLimited(message, logScope);
    };

    const patientId = getPatientId(account.PatientProfile);
    const {isSuccess, record, error} = await getPatientById(patientId, logScope);

    if (!isSuccess) {
      const context = `${logScope} ${patientId}:`;
      addException(`${context} patient could not be found`);
    } else {
      const context = `${logScope} ${patientId}:`;
      logLimited(`${context} found patient`, logScope);
    }

    let communicationUpdated = [];
    if (account.UserPreferences && account.UserPreferences.Language) {
      communicationUpdated = buildPatientCommunication(account.UserPreferences.Language);
    }
    record.communication = communicationUpdated;

    logProgress(
      `${logScope} ${patientId} Updated with: ${JSON.stringify(communicationUpdated)}`
    );
    
    if (!account.exceptions?.length) {
      successfulUsers.push({ account, patient: record });
    } else {
      exceptionUsers.push({ account });
    }
  }
  return { successfulUsers, exceptionUsers };
};

const getPatientAccountsForAccountIds = async (accountIds, logScope) => {
  if (accountIds.length) {
    logProgress(`${logScope}: Fetching ${accountIds.length} patient accounts`);

    const patientAccounts = [];
    for (const accountId of accountIds) {
      logVerbose(
        `${logScope}: Fetching patient account for ${accountId}`,
        logScope
      );
      const { isSuccess, record, error } = await getPatientAccountByAccountId(
        accountId
      );
      if (isSuccess && record) {
        patientAccounts.push(record);
      } else if (error) {
        logLimited(`${logScope}: ${JSON.stringify(error)}`);
      } else {
        logProgress(`${logScope}: Patient account ${accountId} not found`);
      }
    }

    return patientAccounts;
  }
  return [];
};
