// Copyright 2022 Prescryptive Health, Inc.

import { IPatientAccount } from '../../models/platform/patient-account/patient-account';

export interface IPinDetails {
  accountKey: string;
  pinHash: string;
}
export const getPinDetails = (
  patientAccount?: IPatientAccount
): IPinDetails | undefined => {
  const pinDetails = patientAccount?.authentication?.metadata.PIN;

  if (!pinDetails?.length) {
    return undefined;
  }

  return {
    accountKey: pinDetails[0].key,
    pinHash: pinDetails[0].value,
  };
};
