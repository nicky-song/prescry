// Copyright 2022 Prescryptive Health, Inc.

import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';
import { configurationMock } from '../../mock-data/configuration.mock';
import {
  patientAccountPrimaryMock,
  patientAccountPrimaryWithOutAuthMock,
} from '../../mock-data/patient-account.mock';
import { IPatientAccountAuthentication } from '../../models/platform/patient-account/properties/patient-account-authentication';
import { updatePatientAccountAuthentication } from '../external-api/patient-account/update-patient-account-authentication';
import { updatePatientAccountPin } from './update-patient-account-pin';

jest.mock(
  '../external-api/patient-account/update-patient-account-authentication'
);
const updatePatientAccountAuthenticationMock =
  updatePatientAccountAuthentication as jest.Mock;

describe('updatePatientAccountPin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    updatePatientAccountAuthenticationMock.mockResolvedValue(undefined);
  });

  it('makes request to update patient account authentication', async () => {
    const pinKeyMock = 'pin-key';
    const pinHashMock = 'pin-hash';

    updatePatientAccountAuthenticationMock.mockResolvedValue(
      patientAccountPrimaryMock
    );

    const result = await updatePatientAccountPin(
      pinKeyMock,
      pinHashMock,
      configurationMock,
      patientAccountPrimaryWithOutAuthMock
    );

    const expectedAuthentication: IPatientAccountAuthentication = {
      metadata: {
        PIN: [
          {
            key: pinKeyMock,
            value: pinHashMock,
          },
        ],
      },
    };

    expectToHaveBeenCalledOnceOnlyWith(
      updatePatientAccountAuthenticationMock,
      configurationMock,
      expectedAuthentication,
      patientAccountPrimaryWithOutAuthMock
    );

    expect(result).toEqual(patientAccountPrimaryMock);
  });
});
