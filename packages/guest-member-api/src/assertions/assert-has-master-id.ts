// Copyright 2022 Prescryptive Health, Inc.

import { assertIsTruthy } from '@phx/common/src/assertions/assert-is-truthy';
import { ErrorConstants } from '../constants/response-messages';

export function assertHasMasterId(
  masterId: string | undefined,
  phoneNumber: string
): asserts masterId is string {
  assertIsTruthy(
    masterId,
    ErrorConstants.PATIENT_MASTER_ID_MISSING(phoneNumber)
  );
}
