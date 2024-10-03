// Copyright 2022 Prescryptive Health, Inc.

import { IConfiguration } from '../../configuration';
import { IPatientAccount } from '../../models/platform/patient-account/patient-account';
import { IPatientAccountAuthentication } from '../../models/platform/patient-account/properties/patient-account-authentication';
import { buildPatientAccountMetadata } from './patient-account.helper';
import { updatePatientAccountAuthentication } from '../external-api/patient-account/update-patient-account-authentication';

export const updatePatientAccountPin = async (
  pinKey: string,
  pinHash: string,
  configuration: IConfiguration,
  patientAccount: IPatientAccount
): Promise<IPatientAccount> => {
  const authentication: IPatientAccountAuthentication = {
    ...patientAccount.authentication,
  };
  authentication.metadata.PIN = buildPatientAccountMetadata(
    pinKey,
    pinHash
  ).PIN;

  return await updatePatientAccountAuthentication(
    configuration,
    authentication,
    patientAccount
  );
};
