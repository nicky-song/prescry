// Copyright 2022 Prescryptive Health, Inc.

import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';
import { configurationMock } from '../../mock-data/configuration.mock';
import { patientAccountPrimaryMock } from '../../mock-data/patient-account.mock';
import { clearPatientAccountPin } from './clear-patient-account-pin';
import { updatePatientAccountAuthentication } from '../external-api/patient-account/update-patient-account-authentication';
import { IPatientAccountAuthentication } from '../../models/platform/patient-account/properties/patient-account-authentication';

jest.mock(
  '../external-api/patient-account/update-patient-account-authentication'
);
const updatePatientAccountAuthenticationMock =
  updatePatientAccountAuthentication as jest.Mock;

describe('clearPatientAccountPin', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    updatePatientAccountAuthenticationMock.mockResolvedValue(undefined);
  });

  it('updates patient account authentication with empty PIN', async () => {
    await clearPatientAccountPin(configurationMock, patientAccountPrimaryMock);

    const expectedAuthentication: IPatientAccountAuthentication = {
      ...patientAccountPrimaryMock.authentication,
      metadata: {
        ...patientAccountPrimaryMock.authentication.metadata,
        PIN: [],
      },
    };
    expectToHaveBeenCalledOnceOnlyWith(
      updatePatientAccountAuthenticationMock,
      configurationMock,
      expectedAuthentication,
      patientAccountPrimaryMock
    );
  });
});
