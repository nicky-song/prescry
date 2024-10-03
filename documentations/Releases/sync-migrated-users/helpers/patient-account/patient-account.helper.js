// Copyright 2022 Prescryptive Health, Inc.

import dateformat from 'dateformat';
import { generateSHA512Hash } from '../crypto.helper.js';
import { buildPbmPatientLink } from './build-pbm-patient-link.js';
import {
  buildPatientAddress,
  buildPatientGender,
  buildPatientIdentifiers,
  buildPatientNames,
  buildPatientTelecom,
} from './patient.helper.js';

const PATIENT_ACCOUNT_SOURCE_MYRX = 'myrx';

export const buildPatientAccount = (profile, primaryPhoneNumber = null) => {
  const { cashProfile, pbmProfile, benefitPerson, account } = profile;
  const {
    dateOfBirth,
    phoneNumber,
    gender,
    primaryMemberRxId,
    primaryMemberFamilyId,
    primaryMemberPersonCode,
  } = cashProfile;
  const isDependent = primaryMemberPersonCode !== '01';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { authToken: _, ...termsAndConditions } =
    account?.termsAndConditionsAcceptances ?? {};
  const birthDate = dateformat(dateOfBirth, 'yyyy-mm-dd', true);
  const patientAccount = {
    accountType: 'myrx',
    source: PATIENT_ACCOUNT_SOURCE_MYRX,
    reference: buildPatientAccountReferences(
      phoneNumber,
      primaryMemberRxId,
      benefitPerson?.masterId ? pbmProfile?.primaryMemberRxId : null,
      isDependent
    ),
    patient: {
      resourceType: 'Patient',
      active: true,
      birthDate,
      name: buildPatientNames(cashProfile),
      gender: buildPatientGender(gender),
      address: buildPatientAddress(cashProfile),
      communication: [],
      identifier: buildPatientIdentifiers(
        primaryMemberFamilyId,
        primaryMemberRxId,
        primaryPhoneNumber ?? phoneNumber
      ),
      telecom: buildPatientTelecom(
        cashProfile,
        account,
        isDependent,
        primaryPhoneNumber
      ),
      ...(benefitPerson
        ? { link: buildPbmPatientLink(benefitPerson.masterId) }
        : {}),
    },
    authentication: {
      metadata: account ? buildPatientAccountMetadata(account) : {},
    },
    roles: [],
    status: {
      state: isDependent ? 'UNVERIFIED' : 'VERIFIED',
      lastStateUpdate: cashProfile.effectiveDate
        ? buildPatientAccountLastStateUpdate(cashProfile.effectiveDate)
        : undefined,
    },
    termsAndConditions,
    userPreferences: buildPatientAccountUserPreferences(account),
  };

  return patientAccount;
};

function buildPatientAccountUserPreferences(account) {
  const userPreferences = { favorites: [] };
  if (account?.favoritedPharmacies) {
    userPreferences.favorites.push({
      type: 'pharmacies',
      value: account.favoritedPharmacies,
    });
  }
  if (account?.languageCode) {
    userPreferences.favorites.push({
      type: 'languageCode',
      value: [account.languageCode],
    });
  }
  return userPreferences;
}

function buildPatientAccountLastStateUpdate(date) {
  const dashes = `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`;
  return dateformat(dashes, 'isoUtcDateTime');
}

export const buildPatientAccountReferences = (
  phoneNumber,
  memberId,
  sieMemberId,
  isDependent = false
) =>
  isDependent
    ? [memberId]
    : [
        generateSHA512Hash(phoneNumber),
        memberId,
        ...(sieMemberId ? [sieMemberId] : []),
      ];

export const buildPatientAccountMetadata = ({ accountKey, pinHash }) =>
  pinHash && accountKey
    ? {
        PIN: [
          {
            key: accountKey,
            value: pinHash,
          },
        ],
      }
    : {};
