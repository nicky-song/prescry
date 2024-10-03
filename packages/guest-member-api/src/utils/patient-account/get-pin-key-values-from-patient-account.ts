// Copyright 2022 Prescryptive Health, Inc.

import { assertHasPatient } from '../../assertions/assert-has-patient';
import { assertHasPatientAccount } from '../../assertions/assert-has-patient-account';
import { IPatientAccount } from '../../models/platform/patient-account/patient-account';
import { getHumanName, buildFirstName } from '../fhir/human-name.helper';
import { IPinKeyValues } from '../redis/redis.helper';
import { getPinDetails } from './get-pin-details';

export const getPinKeyValuesFromPatientAccount = (
  patientAccount: IPatientAccount | undefined
): IPinKeyValues | undefined => {
  assertHasPatientAccount(patientAccount);

  const pinDetails = getPinDetails(patientAccount);
  if (!pinDetails) {
    return undefined;
  }

  const { accountKey, pinHash } = pinDetails;

  const patient = patientAccount.patient;
  assertHasPatient(patient);

  const { birthDate } = patient;
  const name = getHumanName(patient.name, 'official');

  return {
    accountKey,
    pinHash,
    dateOfBirth: birthDate,
    firstName: buildFirstName(name),
    lastName: name?.family,
  };
};
