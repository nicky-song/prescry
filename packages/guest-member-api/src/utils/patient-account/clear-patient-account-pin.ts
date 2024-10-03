// Copyright 2022 Prescryptive Health, Inc.

import { IConfiguration } from '../../configuration';
import { IPatientAccount } from '../../models/platform/patient-account/patient-account';
import { IPatientAccountAuthentication } from '../../models/platform/patient-account/properties/patient-account-authentication';
import { updatePatientAccountAuthentication } from '../external-api/patient-account/update-patient-account-authentication';

export const clearPatientAccountPin = async (
  configuration: IConfiguration,
  patientAccount: IPatientAccount
): Promise<void> => {
  const authentication: IPatientAccountAuthentication = {
    ...patientAccount.authentication,
    metadata: {
      ...patientAccount.authentication.metadata,
      PIN: [],
    },
  };
  await updatePatientAccountAuthentication(
    configuration,
    authentication,
    patientAccount
  );
};
