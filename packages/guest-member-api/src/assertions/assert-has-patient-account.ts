// Copyright 2022 Prescryptive Health, Inc.

import { assertIsTruthy } from '@phx/common/src/assertions/assert-is-truthy';
import { ErrorConstants } from '../constants/response-messages';
import { IPatientAccount } from '../models/platform/patient-account/patient-account';

export function assertHasPatientAccount(
  patientAccount: IPatientAccount | undefined
): asserts patientAccount is IPatientAccount {
  assertIsTruthy(patientAccount, ErrorConstants.PATIENT_ACCOUNT_MISSING);
}
