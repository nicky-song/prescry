// Copyright 2022 Prescryptive Health, Inc.

import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';
import { getNewDate } from '@phx/common/src/utils/date-time/get-new-date';
import { configurationMock } from '../../mock-data/configuration.mock';
import { IPatientAccountStatus } from '../../models/platform/patient-account/properties/patient-account-status';
import { updatePatientAccountStatus } from '../external-api/patient-account/update-patient-account-status';
import { setPatientAccountStatusToVerified } from './set-patient-account-status-to-verified';

jest.mock('../external-api/patient-account/update-patient-account-status');
const updatePatientAccountStatusMock = updatePatientAccountStatus as jest.Mock;

jest.mock('@phx/common/src/utils/date-time/get-new-date');
const getNewDateMock = getNewDate as jest.Mock;

describe('setPatientAccountStatusToVerified', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    updatePatientAccountStatusMock.mockResolvedValue(undefined);
  });

  it('sets account status to verified', async () => {
    const nowMock = new Date();
    getNewDateMock.mockReturnValue(nowMock);

    const accountIdMock = 'account-id';
    await setPatientAccountStatusToVerified(configurationMock, accountIdMock);

    const expectedStatus: IPatientAccountStatus = {
      lastStateUpdate: nowMock.toISOString(),
      state: 'VERIFIED',
    };
    expectToHaveBeenCalledOnceOnlyWith(
      updatePatientAccountStatusMock,
      configurationMock,
      accountIdMock,
      expectedStatus
    );
  });
});
