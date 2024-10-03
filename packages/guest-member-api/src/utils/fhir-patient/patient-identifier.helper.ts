// Copyright 2022 Prescryptive Health, Inc.

import {
  IPatient,
  PatientIdentifierCodeableConceptCode,
} from '../../models/fhir/patient/patient';
import { findIdentifierForCodeableConceptCode } from '../fhir/identifier.helper';

export const getFamilyIdFromPatient = (
  patient: IPatient | undefined
): string | undefined =>
  findIdentifierForCodeableConceptCode(
    patient?.identifier,
    PatientIdentifierCodeableConceptCode.FAMILY_ID
  )?.value;

export const getMemberIdFromPatient = (
  patient: IPatient | undefined
): string | undefined =>
  findIdentifierForCodeableConceptCode(
    patient?.identifier,
    PatientIdentifierCodeableConceptCode.MEMBER_ID
  )?.value;
