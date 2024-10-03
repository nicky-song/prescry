// Copyright 2022 Prescryptive Health, Inc.

import { LanguageCode } from '@phx/common/src/models/language';
import { IConfiguration } from '../../configuration';
import { IPatientAccount } from '../../models/platform/patient-account/patient-account';
import { IPatientAccountUserPreferences } from '../../models/platform/patient-account/properties/patient-account-user-preferences';
import { updatePatientAccount } from '../external-api/patient-account/update-patient-account';

export const updatePatientAccountLanguageCode = async (
  configuration: IConfiguration,
  existingPatientAccount: IPatientAccount,
  languageCode: LanguageCode
): Promise<void> => {
  const existingPatientAccountPreferences =
    existingPatientAccount.userPreferences as IPatientAccountUserPreferences;
  const patientAccount: IPatientAccount = {
    ...existingPatientAccount,
    userPreferences: {
      ...existingPatientAccountPreferences,
      language: languageCode,
    },
  };

  await updatePatientAccount(configuration, patientAccount);
};
