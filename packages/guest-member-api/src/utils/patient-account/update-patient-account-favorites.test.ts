// Copyright 2022 Prescryptive Health, Inc.

import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';
import { configurationMock } from '../../mock-data/configuration.mock';
import { patientAccountPrimaryMock } from '../../mock-data/patient-account.mock';
import { IPatientAccount } from '../../models/platform/patient-account/patient-account';
import { IPatientAccountFavorite } from '../../models/platform/patient-account/properties/patient-account-favorite';
import { updatePatientAccount } from '../external-api/patient-account/update-patient-account';
import { updatePatientAccountFavorites } from './update-patient-account-favorites';

jest.mock('../external-api/patient-account/update-patient-account');
const updatePatientAccountMock = updatePatientAccount as jest.Mock;

describe('updatePatientAccountFavorites', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    updatePatientAccountMock.mockResolvedValue(undefined);
  });

  it('calls updatePatientAccount', async () => {
    const favoritesMock = [
      { type: 'pharmacies', value: ['test'] },
    ] as IPatientAccountFavorite[];

    await updatePatientAccountFavorites(
      configurationMock,
      patientAccountPrimaryMock,
      favoritesMock as IPatientAccountFavorite[]
    );

    const expectedPatientAccountForUpdate: IPatientAccount = {
      ...patientAccountPrimaryMock,
      userPreferences: {
        favorites: favoritesMock,
      },
    };

    expectToHaveBeenCalledOnceOnlyWith(
      updatePatientAccountMock,
      configurationMock,
      expectedPatientAccountForUpdate
    );
  });
});
