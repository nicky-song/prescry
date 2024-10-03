// Copyright 2022 Prescryptive Health, Inc.

import { IConfiguration } from '../../configuration';
import { IPatient } from '../../models/fhir/patient/patient';
import { IPatientAccount } from '../../models/platform/patient-account/patient-account';
import { updatePatientByMasterId } from '../external-api/identity/update-patient-by-master-id';
import { updatePatientAccount } from '../external-api/patient-account/update-patient-account';
import { buildPatientAccountReferences } from '../patient-account/patient-account.helper';
import {
  buildMemberId,
  buildPatientIdentifiers,
} from '../fhir-patient/patient.helper';
import { assertHasPatient } from '../../assertions/assert-has-patient';

export const setPatientAndPatientAccountIdentifiers = async (
  configuration: IConfiguration,
  existingPatientAccount: IPatientAccount,
  familyId: string,
  masterId: string,
  phoneNumber: string,
  dependentNumber = 1
): Promise<void> => {
  const existingPatient = existingPatientAccount.patient;
  assertHasPatient(existingPatient);

  const memberId = buildMemberId(familyId, dependentNumber);

  const updatedPatient: IPatient = {
    ...existingPatient,
    identifier: buildPatientIdentifiers(familyId, memberId, phoneNumber),
  };

  await updatePatientByMasterId(masterId, updatedPatient, configuration);

  const updatedPatientAccount: IPatientAccount = {
    ...existingPatientAccount,
    patient: updatedPatient,
    reference: buildPatientAccountReferences(
      phoneNumber,
      memberId,
      false,
      masterId
    ),
  };
  await updatePatientAccount(configuration, updatedPatientAccount);
};
