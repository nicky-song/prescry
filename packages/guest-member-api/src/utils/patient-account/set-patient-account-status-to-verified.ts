// Copyright 2022 Prescryptive Health, Inc.

import { getNewDate } from '@phx/common/src/utils/date-time/get-new-date';
import { IConfiguration } from '../../configuration';
import { IPatientAccountStatus } from '../../models/platform/patient-account/properties/patient-account-status';
import { updatePatientAccountStatus } from '../external-api/patient-account/update-patient-account-status';

export const setPatientAccountStatusToVerified = async (
  configuration: IConfiguration,
  accountId: string
): Promise<void> => {
  const patientAccountStatus: IPatientAccountStatus = {
    lastStateUpdate: getNewDate().toISOString(),
    state: 'VERIFIED',
  };
  await updatePatientAccountStatus(
    configuration,
    accountId,
    patientAccountStatus
  );
};
