// Copyright 2022 Prescryptive Health, Inc.

import { generateSHA512Hash } from '@phx/common/src/utils/crypto.helper';
import { IPatientAccount } from '../../models/platform/patient-account/patient-account';
import { IAdditionalProp } from '../../models/platform/patient-account/properties/patient-account-additional-prop';
import { IPatientAccountMetadata } from '../../models/platform/patient-account/properties/patient-account-metadata';

export const isPatientAccountVerified = (patientAccount?: IPatientAccount) =>
  patientAccount?.status?.state === 'VERIFIED';

export const buildPatientAccountReferences = (
  phoneNumber: string,
  memberId: string,
  isDependent: boolean,
  masterId?: string
): string[] =>
  isDependent
    ? [memberId]
    : [
        generateSHA512Hash(phoneNumber),
        memberId,
        ...(masterId ? [masterId] : []),
      ];

export const isPhoneNumberInReferences = (
  references: string[] = [],
  phoneNumber: string
) =>
  references.some((reference) => reference === generateSHA512Hash(phoneNumber));

export const buildPatientAccountMetadata = (
  accountKey?: string,
  pinHash?: string
): IPatientAccountMetadata => {
  const pinDetails: IAdditionalProp | undefined =
    pinHash && accountKey
      ? {
          key: accountKey,
          value: pinHash,
        }
      : undefined;
  return pinDetails ? { PIN: [pinDetails] } : {};
};

export const getMasterId = (
  patientAccount?: IPatientAccount
): string | undefined =>
  patientAccount ? patientAccount.patientProfile?.split('/').pop() : undefined;
