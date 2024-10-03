// Copyright 2022 Prescryptive Health, Inc.

import { generateSHA512Hash } from '@phx/common/src/utils/crypto.helper';
import { IConfiguration } from '../../configuration';
import { IPatientAccount } from '../../models/platform/patient-account/patient-account';
import { getPatientAccountsByReference } from '../external-api/patient-account/get-patient-accounts-by-reference';

export const getPatientAccountByPhoneNumber = async (
  configuration: IConfiguration,
  phoneNumber: string
): Promise<IPatientAccount | undefined> => {
  const phoneNumberHash = generateSHA512Hash(phoneNumber);

  const patientAccounts = await getPatientAccountsByReference(
    configuration,
    phoneNumberHash,
    true,
    true
  );
  return patientAccounts?.length ? patientAccounts[0] : undefined;
};
