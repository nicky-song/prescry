// Copyright 2022 Prescryptive Health, Inc.

import { assertIsTruthy } from '@phx/common/src/assertions/assert-is-truthy';
import { ErrorConstants } from '../constants/response-messages';
import { IPatient } from '../models/fhir/patient/patient';

export function assertHasPatient(
  patient: IPatient | undefined
): asserts patient is IPatient {
  assertIsTruthy(patient, ErrorConstants.PATIENT_RECORD_MISSING);
}
