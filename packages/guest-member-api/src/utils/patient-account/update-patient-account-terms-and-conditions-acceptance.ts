// Copyright 2022 Prescryptive Health, Inc.

import { IConfiguration } from '../../configuration';
import { IPatientAccount } from '../../models/platform/patient-account/patient-account';
import { ITermsAndConditionsAcceptance } from '../../models/platform/patient-account/properties/patient-account-terms-and-conditions';
import { updatePatientAccount } from '../external-api/patient-account/update-patient-account';

export const updatePatientAccountTermsAndConditionsAcceptance = async (
  configuration: IConfiguration,
  existingPatientAccount: IPatientAccount,
  termsAndConditionsAcceptance: ITermsAndConditionsAcceptance
): Promise<IPatientAccount> => {
  const patientAccount: IPatientAccount = {
    ...existingPatientAccount,
    termsAndConditions: termsAndConditionsAcceptance,
  };

  await updatePatientAccount(configuration, patientAccount);

  return patientAccount;
};
