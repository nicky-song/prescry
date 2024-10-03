// Copyright 2022 Prescryptive Health, Inc.

import { IConfiguration } from '../../configuration';
import { IPatientAccount } from '../../models/platform/patient-account/patient-account';
import { IPatientAccountFavorite } from '../../models/platform/patient-account/properties/patient-account-favorite';
import { updatePatientAccount } from '../external-api/patient-account/update-patient-account';

export const updatePatientAccountFavorites = async (
  configuration: IConfiguration,
  existingPatientAccount: IPatientAccount,
  favorites: IPatientAccountFavorite[]
): Promise<void> => {
  const patientAccount: IPatientAccount = {
    ...existingPatientAccount,
    userPreferences: {
      ...(existingPatientAccount.userPreferences ?? {}),
      favorites,
    },
  };

  await updatePatientAccount(configuration, patientAccount);
};
