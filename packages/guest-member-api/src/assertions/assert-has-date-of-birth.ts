// Copyright 2022 Prescryptive Health, Inc.

import { assertIsTruthy } from '@phx/common/src/assertions/assert-is-truthy';
import { ErrorConstants } from '../constants/response-messages';

export function assertHasDateOfBirth(
  dateOfBirth: string | undefined
): asserts dateOfBirth is string {
  assertIsTruthy(dateOfBirth, ErrorConstants.PERSON_DOB_MISSING);
}
