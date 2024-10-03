// Copyright 2022 Prescryptive Health, Inc.

import { LanguageCode } from '@phx/common/src/models/language';
import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';
import { configurationMock } from '../../mock-data/configuration.mock';
import { patientAccountPrimaryWithPreferencesMock } from '../../mock-data/patient-account.mock';
import { IPatientAccount } from '../../models/platform/patient-account/patient-account';
import { IPatientAccountUserPreferences } from '../../models/platform/patient-account/properties/patient-account-user-preferences';
import { updatePatientAccount } from '../external-api/patient-account/update-patient-account';
import { updatePatientAccountLanguageCode } from './update-patient-account-language-code';

jest.mock('../external-api/patient-account/update-patient-account');
const updatePatientAccountMock = updatePatientAccount as jest.Mock;

describe('updatePatientAccountLanguageCode', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    updatePatientAccountMock.mockResolvedValue(undefined);
  });

  it('calls updatePatientAccount', async () => {
    const languageCodeMock: LanguageCode = 'en';

    const patientAccountPreferences =
      patientAccountPrimaryWithPreferencesMock.userPreferences as IPatientAccountUserPreferences;

    await updatePatientAccountLanguageCode(
      configurationMock,
      patientAccountPrimaryWithPreferencesMock,
      languageCodeMock
    );

    const expectedPatientAccountForUpdate: IPatientAccount = {
      ...patientAccountPrimaryWithPreferencesMock,
      userPreferences: {
        ...patientAccountPreferences,
        language: languageCodeMock,
      },
    };

    expectToHaveBeenCalledOnceOnlyWith(
      updatePatientAccountMock,
      configurationMock,
      expectedPatientAccountForUpdate
    );
  });
});
